/**
 * =============================================================================
 * AI LIVE CLASS - TEACHER VIEW COMPONENT
 * =============================================================================
 * 
 * The main teacher interface for AI Live Class sessions.
 * Layout hierarchy reflects the interaction dynamic:
 * 
 * 1. MAIN STAGE: Teacher-AI conversation (dominant, central)
 * 2. SIDELINE: Student queue in minimizable bottom drawer
 * 3. PROMOTE FLOW: Teacher selects student messages to enrich conversation
 * 
 * @module ai-live-class/components/TeacherAIClassView
 * @version 1.0.0
 * 
 * =============================================================================
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Send, 
  Users, 
  ChevronUp, 
  ChevronDown, 
  Pause, 
  Play, 
  Square,
  MessageCircle,
  Sparkles,
  Check,
  X,
  Star,
  Copy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTeacherAISession } from '../hooks/useTeacherAISession';
import { useAIConversation } from '../hooks/useAIConversation';
import { useMessageQueue } from '../hooks/useMessageQueue';
import { formatSessionCodeForDisplay } from '../utils/sessionCode';
import { parseTasksFromMessage, TASK_GENERATION_INSTRUCTION } from '../utils/taskParser';
import { STATUS_DISPLAY, DEFAULT_PROMPTS } from '../constants';
import { TaskGenerationPanel } from './TaskGenerationPanel';
import { ChatTaskDisplay } from './ChatTaskDisplay';
import type { AILiveSession, ConversationMessage, QueuedMessage } from '../types';
import type { TaskLibraryItem, GeneratedTask } from '../types/tasks';

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface TeacherAIClassViewProps {
  /**
   * The active session to display.
   */
  session: AILiveSession;
  
  /**
   * Session code for students to join.
   */
  sessionCode: string;
  
  /**
   * Teacher's user ID.
   */
  teacherId: string;
  
  /**
   * Callback when session ends.
   */
  onSessionEnd?: () => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TeacherAIClassView({
  session,
  sessionCode,
  teacherId,
  onSessionEnd,
}: TeacherAIClassViewProps) {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  
  const [messageInput, setMessageInput] = useState('');
  const [isQueueExpanded, setIsQueueExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  
  const {
    participants,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
  } = useTeacherAISession({ teacherId });
  
  // Enhance system prompt with task generation instruction
  const enhancedSystemPrompt = useMemo(() => {
    return `${DEFAULT_PROMPTS.ACADEMIC_GENERAL}\n\n${TASK_GENERATION_INSTRUCTION}`;
  }, []);
  
  const {
    messages,
    isGenerating,
    sendMessage,
    promoteMessage,
  } = useAIConversation({
    sessionId: session.id,
    systemPrompt: enhancedSystemPrompt,
  });
  
  const {
    queue,
    pendingCount,
    promote,
    dismiss,
    toggleHighlight,
  } = useMessageQueue({
    sessionId: session.id,
    onNewMessage: () => {
      // Play a subtle notification sound or flash
      if (!isQueueExpanded && pendingCount === 0) {
        toast.info('New student question received');
      }
    },
  });
  
  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  
  const handleSendMessage = async () => {
    if (!messageInput.trim() || isGenerating) return;
    
    const content = messageInput.trim();
    setMessageInput('');
    await sendMessage(content, 'teacher');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handlePromoteMessage = async (queuedMessage: QueuedMessage) => {
    await promoteMessage(queuedMessage);
    await promote(queuedMessage.id);
    toast.success('Question promoted to conversation');
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    toast.success('Session code copied');
  };
  
  const handleEndSession = async () => {
    await endSession();
    onSessionEnd?.();
  };
  
  // Handle task generation request from panel
  const handleRequestTask = async (prompt: string) => {
    await sendMessage(prompt, 'teacher');
  };
  
  // Handle library task selection - inject into conversation
  const handleSelectLibraryTask = async (task: TaskLibraryItem) => {
    const prompt = `Please create a task for the students based on this:\n\nTitle: ${task.title}\n\nPrompt: ${task.prompt}${task.context ? `\n\nContext: ${task.context}` : ''}${task.wordLimit ? `\n\nWord limit: ${task.wordLimit} words` : ''}`;
    
    await sendMessage(prompt, 'teacher');
    toast.success(`Selected: ${task.title}`);
  };
  
  // ---------------------------------------------------------------------------
  // COMPUTED
  // ---------------------------------------------------------------------------
  
  const onlineCount = participants.filter(p => p.is_online).length;
  const statusConfig = STATUS_DISPLAY[session.status as keyof typeof STATUS_DISPLAY];
  const pendingMessages = queue.filter(m => m.status === 'pending');
  
  // Parse messages for embedded tasks
  const parsedMessages = useMemo(() => {
    return messages.map(msg => {
      if (msg.author === 'ai') {
        const parseResult = parseTasksFromMessage(msg.content);
        return { message: msg, ...parseResult };
      }
      return { message: msg, cleanContent: msg.content, tasks: [], hasTasks: false };
    });
  }, [messages]);
  
  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* ===== TOP BAR: Session Info ===== */}
      <div className="flex-shrink-0 border-b bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Topic & Status */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-semibold text-lg">{session.topic}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", statusConfig?.bgColor, statusConfig?.color)}
                >
                  <span className={cn("w-2 h-2 rounded-full mr-1.5", statusConfig?.dotColor)} />
                  {statusConfig?.label || session.status}
                </Badge>
                <Separator orientation="vertical" className="h-4" />
                <Users className="h-4 w-4" />
                <span>{onlineCount} online</span>
              </div>
            </div>
          </div>
          
          {/* Center: Session Code */}
          <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
            <span className="text-sm text-muted-foreground">Join Code:</span>
            <code className="font-mono font-bold text-lg tracking-wider">
              {formatSessionCodeForDisplay(sessionCode)}
            </code>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {session.status === 'waiting' && (
              <Button onClick={startSession} size="sm">
                <Play className="h-4 w-4 mr-1" /> Start
              </Button>
            )}
            {session.status === 'active' && (
              <Button onClick={pauseSession} variant="outline" size="sm">
                <Pause className="h-4 w-4 mr-1" /> Pause
              </Button>
            )}
            {session.status === 'paused' && (
              <Button onClick={resumeSession} size="sm">
                <Play className="h-4 w-4 mr-1" /> Resume
              </Button>
            )}
            <Button onClick={handleEndSession} variant="destructive" size="sm">
              <Square className="h-4 w-4 mr-1" /> End
            </Button>
          </div>
        </div>
      </div>
      
      {/* ===== MAIN STAGE: AI Conversation ===== */}
      <div className="flex-1 flex flex-col min-h-0 p-4">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Conversation
                <Badge variant="secondary">
                  {messages.length} messages
                </Badge>
              </CardTitle>
              
              {/* Task Generation Button */}
              <TaskGenerationPanel
                onRequestTask={handleRequestTask}
                onSelectLibraryTask={handleSelectLibraryTask}
                isGenerating={isGenerating}
                currentTopic={session.topic || undefined}
              />
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col min-h-0 p-0">
            {/* Message List */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 py-4">
                {parsedMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Start the conversation by sending a message.</p>
                    <p className="text-sm mt-1">
                      Students can watch and submit questions.
                    </p>
                  </div>
                ) : (
                  parsedMessages.map(({ message: msg, cleanContent, tasks, hasTasks }) => (
                    <div key={msg.id} className="space-y-3">
                      <MessageBubble message={msg} cleanContent={cleanContent} />
                      
                      {/* Render embedded tasks */}
                      {hasTasks && tasks.map(({ task }) => (
                        <ChatTaskDisplay
                          key={task.id}
                          task={task}
                          sessionId={session.id}
                          isTeacher={true}
                        />
                      ))}
                    </div>
                  ))
                )}
                
                {/* Typing indicator */}
                {isGenerating && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Send a message to the AI..."
                  disabled={isGenerating || session.status !== 'active'}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isGenerating || session.status !== 'active'}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* ===== BOTTOM DRAWER: Student Queue ===== */}
      <div className={cn(
        "flex-shrink-0 border-t bg-card transition-all duration-300",
        isQueueExpanded ? "h-64" : "h-14"
      )}>
        {/* Drawer Toggle */}
        <button
          onClick={() => setIsQueueExpanded(!isQueueExpanded)}
          className="w-full h-14 px-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Student Queue</span>
            {pendingCount > 0 && (
              <Badge variant="default" className="bg-primary">
                {pendingCount} pending
              </Badge>
            )}
          </div>
          {isQueueExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        
        {/* Queue Content */}
        {isQueueExpanded && (
          <div className="h-[calc(100%-3.5rem)] overflow-hidden">
            <ScrollArea className="h-full px-4 pb-4">
              {pendingMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">No pending questions from students.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingMessages.map((msg) => (
                    <QueueItem
                      key={msg.id}
                      message={msg}
                      onPromote={() => handlePromoteMessage(msg)}
                      onDismiss={() => dismiss(msg.id)}
                      onHighlight={() => toggleHighlight(msg.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MESSAGE BUBBLE COMPONENT
// =============================================================================

interface MessageBubbleProps {
  message: ConversationMessage;
  cleanContent?: string;
}

function MessageBubble({ message, cleanContent }: MessageBubbleProps) {
  const displayContent = cleanContent ?? message.content;
  const isTeacher = message.author === 'teacher';
  const isAI = message.author === 'ai';
  const isPromoted = message.author === 'student';
  
  return (
    <div className={cn(
      "flex items-start gap-3",
      isTeacher && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isTeacher && "bg-secondary",
        isAI && "bg-primary/20",
        isPromoted && "bg-amber-500/20"
      )}>
        {isTeacher && <Users className="h-4 w-4 text-secondary-foreground" />}
        {isAI && <Sparkles className="h-4 w-4 text-primary" />}
        {isPromoted && <MessageCircle className="h-4 w-4 text-amber-600" />}
      </div>
      
      {/* Content */}
      <div className={cn(
        "max-w-[70%] rounded-lg px-4 py-3",
        isTeacher && "bg-secondary text-secondary-foreground",
        isAI && "bg-muted",
        isPromoted && "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
      )}>
        {isPromoted && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-1 font-medium">
            Promoted Question
          </p>
        )}
        <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
      </div>
    </div>
  );
}

// =============================================================================
// QUEUE ITEM COMPONENT
// =============================================================================

interface QueueItemProps {
  message: QueuedMessage;
  onPromote: () => void;
  onDismiss: () => void;
  onHighlight: () => void;
}

function QueueItem({ message, onPromote, onDismiss, onHighlight }: QueueItemProps) {
  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg border bg-card",
      message.is_highlighted && "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
    )}>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium truncate">{message.student_name}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.submitted_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onHighlight}
          title="Highlight"
        >
          <Star className={cn("h-4 w-4", message.is_highlighted && "fill-amber-500 text-amber-500")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDismiss}
          title="Dismiss"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onPromote}
          title="Promote to conversation"
        >
          <Check className="h-4 w-4 mr-1" />
          Promote
        </Button>
      </div>
    </div>
  );
}
