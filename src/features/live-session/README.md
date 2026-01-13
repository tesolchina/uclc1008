# Live Session Module

A reusable, context-agnostic module for managing real-time educational sessions between teachers and students.

## Overview

This module provides hooks, utilities, and types for:
- **Teachers**: Create, manage, and control live sessions
- **Students**: Join sessions, submit responses, receive prompts

## File Structure

```
src/features/live-session/
├── index.ts              # Barrel exports (public API)
├── types.ts              # TypeScript interfaces
├── constants.ts          # Configuration values
├── hooks/
│   ├── index.ts
│   ├── useTeacherSession.ts  # Teacher session management
│   └── useStudentSession.ts  # Student participation
└── utils/
    ├── index.ts
    ├── persistence.ts    # Session state persistence
    └── helpers.ts        # Pure utility functions
```

## Quick Start

### Teacher Usage

```tsx
import { useTeacherSession } from '@/features/live-session';

function TeacherPanel({ lessonId }) {
  const {
    session,
    participants,
    responses,
    createSession,
    startSession,
    endSession,
    updatePosition,
    sendPrompt,
  } = useTeacherSession(lessonId);

  return (
    <div>
      {!session ? (
        <button onClick={() => createSession('My Lesson')}>
          Create Session
        </button>
      ) : (
        <div>
          <p>Code: {session.session_code}</p>
          <p>Students: {participants.length}</p>
          <button onClick={startSession}>Start</button>
        </div>
      )}
    </div>
  );
}
```

### Student Usage

```tsx
import { useStudentSession, getStudentIdentifier } from '@/features/live-session';

function StudentView() {
  const studentId = getStudentIdentifier();
  const {
    session,
    joinSession,
    leaveSession,
    submitResponse,
    latestPrompt,
  } = useStudentSession(studentId);

  const handleJoin = async (code: string) => {
    await joinSession(code, 'My Name');
  };

  return session ? (
    <div>In session: {session.session_code}</div>
  ) : (
    <JoinForm onJoin={handleJoin} />
  );
}
```

## Configuration

Modify `constants.ts` to customize:

```ts
export const DEFAULT_CONFIG = {
  joinBaseUrl: 'https://your-domain.com/join',
  heartbeatInterval: 5000,
  participantRefreshInterval: 10000,
  debug: false,
};
```

## Database Requirements

This module expects the following Supabase tables:
- `live_sessions` - Session records
- `session_participants` - Joined students
- `session_responses` - Student answers
- `session_prompts` - Teacher messages

See existing migrations for schema details.

## Reusability

To use in a different project:

1. Copy the `src/features/live-session/` folder
2. Update `constants.ts` with your configuration
3. Ensure Supabase client is available at `@/integrations/supabase/client`
4. Run the required database migrations
