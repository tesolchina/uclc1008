/**
 * =============================================================================
 * AI LIVE CLASS - TYPE DEFINITIONS
 * =============================================================================
 * 
 * This file contains all TypeScript interfaces and types for the AI Live Class
 * feature. These types define the data structures used throughout the module
 * for session management, message queuing, and participant handling.
 * 
 * @module ai-live-class/types
 * @version 1.0.0
 * 
 * USAGE:
 * ```typescript
 * import type { AILiveSession, QueuedMessage } from '@/features/ai-live-class';
 * ```
 * 
 * =============================================================================
 */

import type { Json } from '@/integrations/supabase/types';

// =============================================================================
// SESSION TYPES
// =============================================================================

/**
 * Represents the possible states of an AI Live Class session.
 * 
 * - 'waiting': Session created but not started, students can join
 * - 'active': Live session in progress, AI conversation happening
 * - 'paused': Temporarily paused by teacher
 * - 'ended': Session has concluded
 */
export type SessionStatus = 'waiting' | 'active' | 'paused' | 'ended';

/**
 * Core session data structure for an AI Live Class session.
 * 
 * This represents the main session entity that teachers create and students join.
 * Each session has a unique code for easy joining and tracks the current topic
 * being discussed with the AI.
 * 
 * @example
 * ```typescript
 * const session: AILiveSession = {
 *   id: 'uuid-here',
 *   session_code: 'ABC123',
 *   teacher_id: 'teacher-uuid',
 *   status: 'active',
 *   topic: 'Academic Writing: Citation Styles',
 *   created_at: '2024-01-22T10:00:00Z',
 *   started_at: '2024-01-22T10:05:00Z',
 * };
 * ```
 */
export interface AILiveSession {
  /** Unique identifier for the session (UUID) */
  id: string;
  
  /** 6-character alphanumeric code for students to join */
  session_code: string;
  
  /** UUID of the teacher who created the session */
  teacher_id: string;
  
  /** Current status of the session */
  status: SessionStatus;
  
  /** Topic or subject being discussed with the AI */
  topic: string | null;
  
  /** Optional description providing context for the session */
  description?: string | null;
  
  /** ISO timestamp when session was created */
  created_at: string;
  
  /** ISO timestamp when session was started (status changed to 'active') */
  started_at?: string | null;
  
  /** ISO timestamp when session ended */
  ended_at?: string | null;
  
  /** Optional reference to curriculum material being used */
  material_id?: string | null;
  
  /** Optional week number for course integration */
  week_number?: number | null;
}

// =============================================================================
// MESSAGE TYPES
// =============================================================================

/**
 * Defines who authored a message in the conversation.
 * 
 * - 'teacher': Message from the session host/teacher
 * - 'ai': Response from the AI assistant
 * - 'student': Promoted message from a student (originally from queue)
 * - 'system': System-generated messages (session events, etc.)
 */
export type MessageAuthor = 'teacher' | 'ai' | 'student' | 'system';

/**
 * Represents a message in the live AI conversation.
 * 
 * These are the messages visible to all participants in the main chat.
 * Student messages only appear here after being promoted by the teacher.
 * 
 * @example
 * ```typescript
 * const message: ConversationMessage = {
 *   id: 'msg-uuid',
 *   session_id: 'session-uuid',
 *   author: 'teacher',
 *   content: 'Can you explain APA citation format?',
 *   created_at: '2024-01-22T10:10:00Z',
 * };
 * ```
 */
export interface ConversationMessage {
  /** Unique identifier for the message */
  id: string;
  
  /** Session this message belongs to */
  session_id: string;
  
  /** Who authored this message */
  author: MessageAuthor;
  
  /** The actual message content (supports markdown) */
  content: string;
  
  /** ISO timestamp when message was created */
  created_at: string;
  
  /** If author is 'student', reference to the original queued message */
  queued_message_id?: string | null;
  
  /** If author is 'student', the student's display name */
  student_name?: string | null;
  
  /** Optional metadata (e.g., AI model used, token count) */
  metadata?: Json;
}

// =============================================================================
// MESSAGE QUEUE TYPES
// =============================================================================

/**
 * Status of a message in the moderation queue.
 * 
 * - 'pending': Awaiting teacher review
 * - 'promoted': Approved and added to main conversation
 * - 'dismissed': Reviewed but not added to conversation
 */
export type QueueStatus = 'pending' | 'promoted' | 'dismissed';

/**
 * Represents a student message in the moderation queue.
 * 
 * When students submit messages during a live session, they go into this queue
 * for the teacher to review. The teacher can then promote selected messages
 * to the main conversation for the AI to respond to.
 * 
 * @example
 * ```typescript
 * const queuedMessage: QueuedMessage = {
 *   id: 'queue-uuid',
 *   session_id: 'session-uuid',
 *   student_id: 'student-uuid',
 *   student_name: 'John D.',
 *   content: 'What about MLA format?',
 *   status: 'pending',
 *   submitted_at: '2024-01-22T10:12:00Z',
 * };
 * ```
 */
export interface QueuedMessage {
  /** Unique identifier for the queued message */
  id: string;
  
  /** Session this message was submitted to */
  session_id: string;
  
  /** UUID or identifier of the student who submitted */
  student_id: string;
  
  /** Display name of the student */
  student_name: string;
  
  /** The message content */
  content: string;
  
  /** Current status in the moderation workflow */
  status: QueueStatus;
  
  /** ISO timestamp when student submitted the message */
  submitted_at: string;
  
  /** ISO timestamp when teacher reviewed (promoted/dismissed) */
  reviewed_at?: string | null;
  
  /** If promoted, reference to the conversation message it became */
  promoted_message_id?: string | null;
  
  /** Optional flag if teacher wants to highlight this message */
  is_highlighted?: boolean;
}

// =============================================================================
// PARTICIPANT TYPES
// =============================================================================

/**
 * Represents a student participating in an AI Live Class session.
 * 
 * Tracks student presence and engagement during the session.
 */
export interface SessionParticipant {
  /** Unique identifier for this participation record */
  id: string;
  
  /** Session being participated in */
  session_id: string;
  
  /** Student's user ID or identifier */
  student_id: string;
  
  /** Display name shown in the session */
  display_name: string;
  
  /** Whether the student is currently connected */
  is_online: boolean;
  
  /** ISO timestamp when student joined */
  joined_at: string;
  
  /** ISO timestamp of last activity (for timeout detection) */
  last_seen_at: string;
  
  /** Number of messages submitted to queue */
  messages_submitted?: number;
  
  /** Number of messages that were promoted */
  messages_promoted?: number;
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

/**
 * Configuration options for creating a new AI Live Class session.
 */
export interface CreateSessionOptions {
  /** Topic or title for the session */
  topic: string;
  
  /** Optional description */
  description?: string;
  
  /** Optional curriculum material to reference */
  materialId?: string;
  
  /** Optional week number for course integration */
  weekNumber?: number;
  
  /** Initial system prompt for the AI */
  systemPrompt?: string;
}

/**
 * Return type for the useAIConversation hook.
 * Provides methods and state for managing the AI conversation.
 */
export interface AIConversationState {
  /** All messages in the conversation */
  messages: ConversationMessage[];
  
  /** Whether AI is currently generating a response */
  isGenerating: boolean;
  
  /** Whether the conversation is loading */
  isLoading: boolean;
  
  /** Send a message to the AI */
  sendMessage: (content: string, author?: MessageAuthor) => Promise<void>;
  
  /** Promote a queued student message to the conversation */
  promoteMessage: (queuedMessage: QueuedMessage) => Promise<void>;
  
  /** Clear the conversation (teacher only) */
  clearConversation: () => Promise<void>;
}

/**
 * Return type for the useMessageQueue hook.
 * Provides methods for managing the student message queue.
 */
export interface MessageQueueState {
  /** All messages currently in the queue */
  queue: QueuedMessage[];
  
  /** Count of pending messages */
  pendingCount: number;
  
  /** Whether queue is loading */
  isLoading: boolean;
  
  /** Promote a message to the main conversation */
  promote: (messageId: string) => Promise<void>;
  
  /** Dismiss a message without promoting */
  dismiss: (messageId: string) => Promise<void>;
  
  /** Dismiss all pending messages */
  dismissAll: () => Promise<void>;
  
  /** Highlight a message for later attention */
  toggleHighlight: (messageId: string) => Promise<void>;
}

/**
 * Return type for the useTeacherAISession hook.
 * Combines session management with conversation and queue control.
 */
export interface TeacherSessionState {
  /** The current session data */
  session: AILiveSession | null;
  
  /** Session code for sharing */
  sessionCode: string | null;
  
  /** Whether session is loading/reconnecting */
  isLoading: boolean;
  
  /** Number of online participants */
  participantCount: number;
  
  /** List of all participants */
  participants: SessionParticipant[];
  
  /** Create a new session */
  createSession: (options: CreateSessionOptions) => Promise<boolean>;
  
  /** Start the session (change to 'active') */
  startSession: () => Promise<void>;
  
  /** Pause the session */
  pauseSession: () => Promise<void>;
  
  /** Resume a paused session */
  resumeSession: () => Promise<void>;
  
  /** End the session permanently */
  endSession: () => Promise<void>;
  
  /** Update the session topic */
  updateTopic: (topic: string) => Promise<void>;
}

/**
 * Return type for the useStudentAISession hook.
 * Provides student-facing session interaction methods.
 */
export interface StudentSessionState {
  /** The current session (if joined) */
  session: AILiveSession | null;
  
  /** All conversation messages (read-only view) */
  messages: ConversationMessage[];
  
  /** Student's own queued messages */
  myQueuedMessages: QueuedMessage[];
  
  /** Whether currently connected */
  isConnected: boolean;
  
  /** Whether loading/joining */
  isLoading: boolean;
  
  /** Error message if any */
  error: string | null;
  
  /** Join a session by code */
  joinSession: (code: string, displayName: string) => Promise<boolean>;
  
  /** Submit a message to the queue */
  submitMessage: (content: string) => Promise<boolean>;
  
  /** Leave the current session */
  leaveSession: () => Promise<void>;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Props for the AI system prompt configuration.
 * Allows customization of AI behavior for different contexts.
 */
export interface AIPromptConfig {
  /** Base system prompt defining AI's role */
  systemPrompt: string;
  
  /** Additional context from curriculum materials */
  materialContext?: string;
  
  /** Specific instructions for this session */
  sessionInstructions?: string;
  
  /** Maximum response length hint */
  maxResponseLength?: number;
  
  /** Whether to include previous messages as context */
  includeHistory?: boolean;
  
  /** Number of previous messages to include (default: 10) */
  historyLimit?: number;
}

/**
 * Event types emitted during session lifecycle.
 * Used for real-time subscriptions and event handling.
 */
export type SessionEventType = 
  | 'session_created'
  | 'session_started'
  | 'session_paused'
  | 'session_resumed'
  | 'session_ended'
  | 'participant_joined'
  | 'participant_left'
  | 'message_sent'
  | 'message_queued'
  | 'message_promoted'
  | 'message_dismissed';

/**
 * Structure for session events used in real-time subscriptions.
 */
export interface SessionEvent {
  /** Type of event that occurred */
  type: SessionEventType;
  
  /** Session ID the event relates to */
  session_id: string;
  
  /** ISO timestamp of the event */
  timestamp: string;
  
  /** Additional event-specific data */
  payload?: Json;
}
