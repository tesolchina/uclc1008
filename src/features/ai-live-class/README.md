# AI Live Class Module

> A comprehensive, reusable module for hosting live AI-augmented classroom sessions with moderated student participation.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Customization](#customization)
- [Best Practices](#best-practices)

---

## Overview

The AI Live Class module enables interactive classroom sessions where:

1. **Teachers** create sessions and engage in real-time conversation with an AI assistant
2. **Students** watch the live discussion and submit questions/comments to a moderation queue
3. **Teachers** review student submissions and selectively promote them to the main conversation
4. **AI** responds to promoted student messages, creating an interactive learning experience

### Key Features

| Feature | Description |
|---------|-------------|
| **Session Management** | Create, start, pause, resume, and end sessions |
| **Unique Join Codes** | 6-character codes for easy student joining |
| **Real-time Streaming** | AI responses stream in real-time |
| **Moderation Queue** | Review and promote student messages |
| **Auto-reconnection** | Students and teachers automatically reconnect |
| **Heartbeat System** | Track online/offline participant status |
| **Rate Limiting** | Prevent spam in the message queue |

---

## Architecture

```
src/features/ai-live-class/
├── index.ts                 # Public API - import everything from here
├── types.ts                 # TypeScript interfaces and types
├── constants.ts             # Configuration values and prompts
├── README.md                # This documentation
├── hooks/
│   ├── index.ts             # Hook exports
│   ├── useTeacherAISession.ts   # Teacher session management
│   ├── useStudentAISession.ts   # Student session participation
│   ├── useAIConversation.ts     # AI chat functionality
│   └── useMessageQueue.ts       # Queue moderation
└── utils/
    ├── index.ts             # Utility exports
    ├── sessionCode.ts       # Code generation/validation
    └── streamParser.ts      # SSE stream parsing
```

### Data Flow

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   TEACHER   │         │   SUPABASE  │         │   STUDENT   │
│             │         │             │         │             │
│ Create      │───────▶ │ ai_live_    │ ◀───────│ Join by     │
│ Session     │         │ sessions    │         │ Code        │
│             │         │             │         │             │
│ Send to AI  │───────▶ │ ai_conver-  │ ◀───────│ Watch       │
│             │         │ sation_msgs │         │ Messages    │
│             │         │             │         │             │
│ Review      │ ◀─────  │ ai_message_ │ ───────▶│ Submit      │
│ Queue       │         │ queue       │         │ Question    │
│             │         │             │         │             │
│ Promote     │───────▶ │ Updates     │ ───────▶│ See in      │
│ Message     │         │ Both Tables │         │ Conversation│
└─────────────┘         └─────────────┘         └─────────────┘
```

---

## Installation

### 1. Database Setup

Run this migration to create the required tables:

```sql
-- =============================================================================
-- AI LIVE CLASS - DATABASE SCHEMA
-- =============================================================================

-- Sessions table
CREATE TABLE public.ai_live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code VARCHAR(6) UNIQUE NOT NULL,
  teacher_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting',
  topic TEXT,
  description TEXT,
  material_id UUID,
  week_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

-- Participants table
CREATE TABLE public.ai_session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES ai_live_sessions(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  is_online BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  messages_submitted INTEGER DEFAULT 0,
  messages_promoted INTEGER DEFAULT 0,
  UNIQUE(session_id, student_id)
);

-- Conversation messages table
CREATE TABLE public.ai_conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES ai_live_sessions(id) ON DELETE CASCADE,
  author VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  queued_message_id UUID,
  student_name TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message queue table
CREATE TABLE public.ai_message_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES ai_live_sessions(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  is_highlighted BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  promoted_message_id UUID
);

-- Enable Row Level Security
ALTER TABLE public.ai_live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_message_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your auth setup)

-- Sessions: Teachers can manage their own, students can view active
CREATE POLICY "Teachers manage own sessions" ON public.ai_live_sessions
  FOR ALL USING (auth.uid()::text = teacher_id::text);

CREATE POLICY "Anyone can view active sessions" ON public.ai_live_sessions
  FOR SELECT USING (status IN ('waiting', 'active', 'paused'));

-- Participants: Can view/update own participation
CREATE POLICY "View session participants" ON public.ai_session_participants
  FOR SELECT USING (true);

CREATE POLICY "Join sessions" ON public.ai_session_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Update own participation" ON public.ai_session_participants
  FOR UPDATE USING (student_id = auth.uid()::text);

-- Messages: View all, create for teachers
CREATE POLICY "View conversation messages" ON public.ai_conversation_messages
  FOR SELECT USING (true);

CREATE POLICY "Teachers create messages" ON public.ai_conversation_messages
  FOR INSERT WITH CHECK (true);

-- Queue: Students submit, teachers moderate
CREATE POLICY "View queue messages" ON public.ai_message_queue
  FOR SELECT USING (true);

CREATE POLICY "Submit to queue" ON public.ai_message_queue
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Update queue messages" ON public.ai_message_queue
  FOR UPDATE USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_live_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_conversation_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_message_queue;

-- Indexes for performance
CREATE INDEX idx_ai_sessions_teacher ON public.ai_live_sessions(teacher_id);
CREATE INDEX idx_ai_sessions_code ON public.ai_live_sessions(session_code);
CREATE INDEX idx_ai_sessions_status ON public.ai_live_sessions(status);
CREATE INDEX idx_ai_participants_session ON public.ai_session_participants(session_id);
CREATE INDEX idx_ai_messages_session ON public.ai_conversation_messages(session_id);
CREATE INDEX idx_ai_queue_session ON public.ai_message_queue(session_id);
CREATE INDEX idx_ai_queue_status ON public.ai_message_queue(status);
```

### 2. Import the Module

```typescript
// Import everything you need from the main entry point
import {
  // Hooks
  useTeacherAISession,
  useStudentAISession,
  useAIConversation,
  useMessageQueue,
  
  // Types
  type AILiveSession,
  type ConversationMessage,
  type QueuedMessage,
  
  // Constants
  DEFAULT_PROMPTS,
  STATUS_DISPLAY,
  
  // Utilities
  formatSessionCodeForDisplay,
} from '@/features/ai-live-class';
```

---

## Quick Start

### Teacher Implementation

```tsx
import {
  useTeacherAISession,
  useAIConversation,
  useMessageQueue,
  DEFAULT_PROMPTS,
  formatSessionCodeForDisplay,
} from '@/features/ai-live-class';

function TeacherAIClassPage() {
  const { user } = useAuth();
  
  // ─── Session Management ───────────────────────────────────────────
  const {
    session,
    sessionCode,
    participants,
    participantCount,
    createSession,
    startSession,
    pauseSession,
    endSession,
    isLoading,
  } = useTeacherAISession({ 
    teacherId: user.id,
    onParticipantJoin: (p) => toast.info(`${p.display_name} joined`),
  });

  // ─── AI Conversation ──────────────────────────────────────────────
  const {
    messages,
    sendMessage,
    promoteMessage,
    isGenerating,
  } = useAIConversation({
    sessionId: session?.id || '',
    systemPrompt: DEFAULT_PROMPTS.ACADEMIC_WRITING,
    userId: user.id,
  });

  // ─── Message Queue ────────────────────────────────────────────────
  const {
    queue,
    pendingCount,
    promote,
    dismiss,
    toggleHighlight,
  } = useMessageQueue({
    sessionId: session?.id || '',
    onNewMessage: () => playNotificationSound(),
  });

  // ─── Handlers ─────────────────────────────────────────────────────
  const handleCreateSession = async () => {
    await createSession({
      topic: 'APA Citation Styles',
      description: 'Live Q&A about proper citation formatting',
    });
  };

  const handlePromoteMessage = async (msg: QueuedMessage) => {
    await promote(msg.id);
    await promoteMessage(msg); // This sends to AI for response
  };

  // ─── Render ───────────────────────────────────────────────────────
  if (isLoading) return <LoadingSpinner />;

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Start AI Live Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCreateSession}>
            Create Session
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Session Info */}
      <Card>
        <CardHeader>
          <CardTitle>Session: {session.topic}</CardTitle>
          <CardDescription>
            Code: {formatSessionCodeForDisplay(sessionCode)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{participantCount} students online</p>
          <div className="flex gap-2 mt-4">
            {session.status === 'waiting' && (
              <Button onClick={startSession}>Start</Button>
            )}
            {session.status === 'active' && (
              <Button onClick={pauseSession}>Pause</Button>
            )}
            <Button variant="destructive" onClick={endSession}>
              End Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Conversation */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isGenerating && <TypingIndicator />}
          </ScrollArea>
          <ChatInput onSend={sendMessage} disabled={isGenerating} />
        </CardContent>
      </Card>

      {/* Message Queue */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Student Questions ({pendingCount} pending)</CardTitle>
        </CardHeader>
        <CardContent>
          {queue.filter(m => m.status === 'pending').map(msg => (
            <QueueItem
              key={msg.id}
              message={msg}
              onPromote={() => handlePromoteMessage(msg)}
              onDismiss={() => dismiss(msg.id)}
              onHighlight={() => toggleHighlight(msg.id)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Student Implementation

```tsx
import { useState } from 'react';
import {
  useStudentAISession,
  formatSessionCodeForDisplay,
} from '@/features/ai-live-class';

function StudentAIClassPage() {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  
  // ─── Session Participation ────────────────────────────────────────
  const {
    session,
    messages,
    myQueuedMessages,
    isConnected,
    isLoading,
    error,
    joinSession,
    submitMessage,
    leaveSession,
  } = useStudentAISession({
    studentId: user.student_id,
    onMessagePromoted: (msg) => {
      toast.success('Your question was selected!');
    },
  });

  // ─── Join Form ────────────────────────────────────────────────────
  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Join AI Live Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive">{error}</Alert>}
          
          <Input
            placeholder="Session Code (e.g., ABC123)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
          />
          
          <Input
            placeholder="Your Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <Button 
            onClick={() => joinSession(code, name)}
            disabled={isLoading || code.length !== 6 || !name}
          >
            {isLoading ? 'Joining...' : 'Join Session'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ─── Session View ─────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <CardTitle>{session.topic}</CardTitle>
          <CardDescription>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Live Conversation */}
      <Card>
        <CardHeader>
          <CardTitle>Live Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {messages.map(msg => (
              <MessageBubble 
                key={msg.id} 
                message={msg}
                highlight={msg.author === 'student'}
              />
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Submit Question */}
      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>
            Your question will be reviewed by the teacher
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuestionInput onSubmit={submitMessage} />
        </CardContent>
      </Card>

      {/* My Submitted Questions */}
      <Card>
        <CardHeader>
          <CardTitle>My Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {myQueuedMessages.map(msg => (
            <div key={msg.id} className="flex items-center gap-2 p-2">
              <Badge variant={
                msg.status === 'promoted' ? 'default' :
                msg.status === 'pending' ? 'secondary' : 'outline'
              }>
                {msg.status}
              </Badge>
              <span className="truncate">{msg.content}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button variant="outline" onClick={leaveSession}>
        Leave Session
      </Button>
    </div>
  );
}
```

---

## API Reference

### Hooks

#### `useTeacherAISession(options)`

Manages the teacher's session lifecycle.

**Options:**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `teacherId` | `string` | Yes | Teacher's user ID |
| `onParticipantJoin` | `(participant) => void` | No | Callback when student joins |
| `onParticipantLeave` | `(participant) => void` | No | Callback when student leaves |
| `autoReconnect` | `boolean` | No | Auto-reconnect to active session (default: true) |

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `session` | `AILiveSession \| null` | Current session data |
| `sessionCode` | `string \| null` | 6-character join code |
| `participants` | `SessionParticipant[]` | All participants |
| `participantCount` | `number` | Online participant count |
| `isLoading` | `boolean` | Loading state |
| `createSession` | `(options) => Promise<boolean>` | Create new session |
| `startSession` | `() => Promise<void>` | Start the session |
| `pauseSession` | `() => Promise<void>` | Pause the session |
| `resumeSession` | `() => Promise<void>` | Resume paused session |
| `endSession` | `() => Promise<void>` | End the session |
| `updateTopic` | `(topic) => Promise<void>` | Change session topic |

---

#### `useStudentAISession(options)`

Manages student participation in sessions.

**Options:**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `studentId` | `string` | Yes | Student's identifier |
| `onMessagePromoted` | `(message) => void` | No | Callback when message promoted |
| `autoReconnect` | `boolean` | No | Auto-reconnect (default: true) |

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `session` | `AILiveSession \| null` | Current session |
| `messages` | `ConversationMessage[]` | All conversation messages |
| `myQueuedMessages` | `QueuedMessage[]` | Student's own submissions |
| `isConnected` | `boolean` | Connection status |
| `isLoading` | `boolean` | Loading state |
| `error` | `string \| null` | Error message |
| `joinSession` | `(code, name) => Promise<boolean>` | Join by code |
| `submitMessage` | `(content) => Promise<boolean>` | Submit to queue |
| `leaveSession` | `() => Promise<void>` | Leave session |

---

#### `useAIConversation(options)`

Manages the AI conversation with streaming support.

**Options:**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `sessionId` | `string` | Yes | Session ID |
| `systemPrompt` | `string` | Yes | AI system prompt |
| `onResponseComplete` | `(response) => void` | No | Callback on AI finish |
| `onStreamingUpdate` | `(chunk, full) => void` | No | Callback per chunk |
| `persistMessages` | `boolean` | No | Save to DB (default: true) |
| `userId` | `string` | No | User ID for tracking |

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `messages` | `ConversationMessage[]` | Conversation history |
| `isGenerating` | `boolean` | AI is responding |
| `isLoading` | `boolean` | Initial load state |
| `sendMessage` | `(content, author?) => Promise<void>` | Send message |
| `promoteMessage` | `(queued) => Promise<void>` | Promote from queue |
| `clearConversation` | `() => Promise<void>` | Clear all messages |

---

#### `useMessageQueue(options)`

Manages the moderation queue.

**Options:**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `sessionId` | `string` | Yes | Session ID |
| `onNewMessage` | `(message) => void` | No | New message callback |
| `onMessagePromoted` | `(message) => void` | No | Promotion callback |

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `queue` | `QueuedMessage[]` | All queue messages |
| `pendingCount` | `number` | Pending message count |
| `isLoading` | `boolean` | Loading state |
| `promote` | `(id) => Promise<void>` | Promote message |
| `dismiss` | `(id) => Promise<void>` | Dismiss message |
| `dismissAll` | `() => Promise<void>` | Dismiss all pending |
| `toggleHighlight` | `(id) => Promise<void>` | Toggle highlight |

---

### Utilities

#### Session Code Functions

```typescript
import {
  generateSessionCode,
  isValidSessionCode,
  normalizeSessionCode,
  formatSessionCodeForDisplay,
  extractSessionCode,
} from '@/features/ai-live-class';

// Generate a random 6-character code
const code = generateSessionCode(); // "HK7M2N"

// Validate format (not existence)
isValidSessionCode("ABC123"); // true
isValidSessionCode("abc123"); // false (lowercase)

// Normalize user input
normalizeSessionCode("  abc123  "); // "ABC123"

// Format for display
formatSessionCodeForDisplay("ABC123"); // "ABC 123"

// Extract from messy input
extractSessionCode("Join code: ABC123!"); // "ABC123"
```

#### Stream Parser Functions

```typescript
import {
  parseSSEStream,
  handleStreamingResponse,
} from '@/features/ai-live-class';

// Parse a stream with callbacks
const result = await parseSSEStream(response.body, (chunk, full) => {
  console.log('New chunk:', chunk);
  setContent(full); // Update UI
});

// Handle the complete flow
const result = await handleStreamingResponse(
  () => fetch('/api/chat', { method: 'POST', body: ... }),
  (chunk, full) => setContent(full)
);

if (result.success) {
  saveToDatabase(result.content);
}
```

---

### Constants

```typescript
import {
  SESSION_CONFIG,    // Session settings (code length, heartbeat, etc.)
  QUEUE_CONFIG,      // Queue settings (rate limits, lengths)
  AI_CONFIG,         // AI settings (model, tokens, timeout)
  UI_CONFIG,         // UI settings (animations, scroll)
  DEFAULT_PROMPTS,   // Pre-built system prompts
  STATUS_DISPLAY,    // Status labels and colors
  ERROR_MESSAGES,    // User-friendly error strings
  STORAGE_KEYS,      // localStorage keys
} from '@/features/ai-live-class';

// Example: Custom prompt
const prompt = DEFAULT_PROMPTS.ACADEMIC_WRITING;

// Example: Status display
const { label, color } = STATUS_DISPLAY[session.status];
// { label: 'Live', color: 'text-green-600' }
```

---

## Customization

### Custom System Prompts

```typescript
const customPrompt = `You are an expert in ${topic}.

Guidelines:
- Focus on ${specificArea}
- Use examples from ${domain}
- Keep responses concise

Remember: This is a live classroom session.`;

const { sendMessage } = useAIConversation({
  sessionId,
  systemPrompt: customPrompt,
});
```

### Custom Styling

Override the default status colors:

```typescript
import { STATUS_DISPLAY } from '@/features/ai-live-class';

// In your component
const customStatusColors = {
  ...STATUS_DISPLAY,
  active: {
    ...STATUS_DISPLAY.active,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
};
```

### Integration with Existing Auth

```typescript
// The hooks accept any string ID
const { user } = useAuth(); // Your auth context

// Teacher
useTeacherAISession({ teacherId: user.id });

// Student
useStudentAISession({ studentId: user.student_number });
```

---

## Best Practices

### 1. Error Handling

Always wrap async operations:

```typescript
const handleJoin = async () => {
  try {
    const success = await joinSession(code, name);
    if (!success) {
      // Error already shown via toast
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    toast.error('Something went wrong');
  }
};
```

### 2. Loading States

Show appropriate feedback:

```typescript
if (isLoading) {
  return <Skeleton className="h-48" />;
}

if (!session) {
  return <JoinForm />;
}

return <SessionView />;
```

### 3. Real-time Updates

The hooks handle subscriptions automatically, but ensure cleanup:

```typescript
// Hooks clean up on unmount
// No manual cleanup needed in most cases

// If you need manual control:
useEffect(() => {
  return () => {
    leaveSession(); // Clean exit
  };
}, []);
```

### 4. Rate Limiting

The queue has built-in rate limiting (5 messages/minute).
Handle the error gracefully:

```typescript
const success = await submitMessage(content);
if (!success) {
  // Rate limit error shown via toast
  // Disable input temporarily
  setCanSubmit(false);
  setTimeout(() => setCanSubmit(true), 10000);
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Messages not appearing | Check RLS policies, ensure Realtime is enabled |
| Can't join session | Verify session exists and isn't ended |
| AI not responding | Check edge function logs, verify API access |
| Heartbeat failing | Check network, session might have ended |
| Rate limited | Wait 60 seconds, reduce submission frequency |

---

## Contributing

When extending this module:

1. Add new types to `types.ts`
2. Add new constants to `constants.ts`
3. Create new hooks in `hooks/`
4. Export from `index.ts`
5. Update this README

Follow the existing documentation style with JSDoc comments.
