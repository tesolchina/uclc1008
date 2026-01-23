/**
 * =============================================================================
 * AI LIVE CLASS - STUDENT VIEW COMPONENT
 * =============================================================================
 * 
 * The student interface for watching AI Live Class sessions.
 * Students are the audience: they watch the teacher-AI conversation
 * and can submit questions to a moderation queue.
 * 
 * Key design decisions:
 * - Conversation is read-only (students watch, not participate directly)
 * - Questions go to a queue for teacher review
 * - Promoted questions appear anonymously in the main conversation
 * 
 * @module ai-live-class/components/StudentAIClassView
 * @version 1.0.0
 * 
 * =============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Users, 
  MessageCircle,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useStudentAISession } from '../hooks/useStudentAISession';
import { STATUS_DISPLAY, QUEUE_CONFIG } from '../constants';
import { StudentReadingPassage } from './ReadingPassageModule';
import type { AILiveSession, ConversationMessage, QueuedMessage } from '../types';

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface StudentAIClassViewProps {
  /**
   * The session the student has joined.
   */
  session: AILiveSession;
  
  /**
   * Student's unique identifier.
   */
  studentId: string;
  
  /**
   * Student's display name.
   */
  displayName: string;
  
  /**
   * Callback when student leaves.
   */
  onLeave?: () => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function StudentAIClassView({
  session,
  studentId,
  displayName,
  onLeave,
}: StudentAIClassViewProps) {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  
  const [questionInput, setQuestionInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  
  const {
    messages,
    myQueuedMessages,
    submitMessage,
    leaveSession,
  } = useStudentAISession({
    studentId,
    onMessagePromoted: (msg) => {
      if (msg.student_id === studentId) {
        toast.success('Your question was promoted to the conversation!');
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
  
  const handleSubmitQuestion = async () => {
    if (!questionInput.trim() || isSubmitting) return;
    
    const content = questionInput.trim();
    
    // Validation
    if (content.length < QUEUE_CONFIG.MIN_MESSAGE_LENGTH) {
      toast.error(`Question must be at least ${QUEUE_CONFIG.MIN_MESSAGE_LENGTH} characters`);
      return;
    }
    if (content.length > QUEUE_CONFIG.MAX_MESSAGE_LENGTH) {
      toast.error(`Question cannot exceed ${QUEUE_CONFIG.MAX_MESSAGE_LENGTH} characters`);
      return;
    }
    
    setIsSubmitting(true);
    setQuestionInput('');
    
    const success = await submitMessage(content);
    
    if (success) {
      toast.success('Question submitted for review');
    } else {
      setQuestionInput(content); // Restore on failure
    }
    
    setIsSubmitting(false);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuestion();
    }
  };
  
  const handleLeave = async () => {
    await leaveSession();
    onLeave?.();
  };
  
  // ---------------------------------------------------------------------------
  // COMPUTED
  // ---------------------------------------------------------------------------
  
  const statusConfig = STATUS_DISPLAY[session.status as keyof typeof STATUS_DISPLAY];
  const isPaused = session.status === 'paused';
  const isEnded = session.status === 'ended';
  
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
                <span>Watching as {displayName}</span>
              </div>
            </div>
          </div>
          
          {/* Right: Leave Button */}
          <Button onClick={handleLeave} variant="outline" size="sm">
            Leave Session
          </Button>
        </div>
      </div>
      
      {/* ===== PAUSED/ENDED OVERLAY ===== */}
      {(isPaused || isEnded) && (
        <div className="flex-shrink-0 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
          <p className="text-amber-700 dark:text-amber-300 text-sm text-center">
            {isPaused && '⏸️ Session is paused. Please wait for the teacher to resume.'}
            {isEnded && '✅ This session has ended. Thank you for participating!'}
          </p>
        </div>
      )}
      
      {/* ===== MAIN AREA: Conversation (Read-Only) ===== */}
      <div className="flex-1 flex flex-col min-h-0 p-4 gap-4">
        {/* Reading Passage (if teacher shared one) */}
        {session.description && (
          <StudentReadingPassage
            content={session.description}
            title="Reading Passage"
          />
        )}
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="flex-shrink-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-primary" />
              Live Conversation
              <Badge variant="secondary" className="ml-auto">
                {messages.length} messages
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col min-h-0 p-0">
            {/* Message List (Read-Only) */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 py-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>Waiting for the conversation to begin...</p>
                    <p className="text-sm mt-1">
                      The teacher will start chatting with the AI shortly.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <StudentMessageBubble key={msg.id} message={msg} />
                  ))
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      {/* ===== BOTTOM: Question Submission ===== */}
      <div className="flex-shrink-0 border-t bg-card p-4">
        {/* My Queue Status */}
        {myQueuedMessages.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-2">Your submitted questions:</p>
            <div className="flex flex-wrap gap-2">
              {myQueuedMessages.slice(-3).map((msg) => (
                <QueueStatusBadge key={msg.id} message={msg} />
              ))}
            </div>
          </div>
        )}
        
        {/* Question Input */}
        <div className="flex gap-2">
          <Input
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Submit a question for the teacher to consider..."
            disabled={isSubmitting || isPaused || isEnded}
            maxLength={QUEUE_CONFIG.MAX_MESSAGE_LENGTH}
            className="flex-1"
          />
          <Button 
            onClick={handleSubmitQuestion}
            disabled={!questionInput.trim() || isSubmitting || isPaused || isEnded}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Questions go to the teacher for review. Approved questions may appear in the conversation.
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// MESSAGE BUBBLE (STUDENT VIEW)
// =============================================================================

interface StudentMessageBubbleProps {
  message: ConversationMessage;
}

function StudentMessageBubble({ message }: StudentMessageBubbleProps) {
  const isTeacher = message.author === 'teacher';
  const isAI = message.author === 'ai';
  const isPromoted = message.author === 'student';
  
  return (
    <div className="flex items-start gap-3">
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
        "flex-1 max-w-[85%] rounded-lg px-4 py-3",
        isTeacher && "bg-secondary",
        isAI && "bg-muted",
        isPromoted && "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
      )}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            {isTeacher && 'Teacher'}
            {isAI && 'AI Tutor'}
            {isPromoted && 'Promoted Question'}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

// =============================================================================
// QUEUE STATUS BADGE
// =============================================================================

interface QueueStatusBadgeProps {
  message: QueuedMessage;
}

function QueueStatusBadge({ message }: QueueStatusBadgeProps) {
  const isPending = message.status === 'pending';
  const isPromoted = message.status === 'promoted';
  const isDismissed = message.status === 'dismissed';
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        "text-xs max-w-48 truncate",
        isPending && "border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/20",
        isPromoted && "border-green-300 text-green-600 bg-green-50 dark:bg-green-950/20",
        isDismissed && "border-muted text-muted-foreground"
      )}
    >
      {isPending && <Clock className="h-3 w-3 mr-1" />}
      {isPromoted && <CheckCircle className="h-3 w-3 mr-1" />}
      {isDismissed && <XCircle className="h-3 w-3 mr-1" />}
      <span className="truncate">{message.content.slice(0, 30)}...</span>
    </Badge>
  );
}
