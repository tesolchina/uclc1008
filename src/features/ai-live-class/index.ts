/**
 * =============================================================================
 * AI LIVE CLASS - FEATURE MODULE
 * =============================================================================
 * 
 * This module provides a complete solution for hosting live classroom sessions
 * where a teacher engages in real-time conversation with an AI assistant while
 * students watch and submit questions through a moderated queue.
 * 
 * @module ai-live-class
 * @version 1.0.0
 * 
 * FEATURE OVERVIEW:
 * ─────────────────
 * The AI Live Class feature enables interactive, AI-augmented classroom sessions:
 * 
 * 1. TEACHER CAPABILITIES:
 *    - Create sessions with unique join codes
 *    - Engage in real-time conversation with AI
 *    - Review and moderate student submissions
 *    - Promote selected messages to the main discussion
 *    - Control session lifecycle (start/pause/resume/end)
 * 
 * 2. STUDENT CAPABILITIES:
 *    - Join sessions using a 6-character code
 *    - Watch the live AI-teacher conversation
 *    - Submit questions/comments to the moderation queue
 *    - See when their messages are promoted
 *    - Receive real-time updates
 * 
 * 3. AI INTEGRATION:
 *    - Streaming responses for real-time display
 *    - Customizable system prompts per session
 *    - Context-aware responses using conversation history
 * 
 * ARCHITECTURE:
 * ─────────────
 * 
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │                    AI LIVE CLASS FEATURE                     │
 *   ├─────────────────────────────────────────────────────────────┤
 *   │                                                             │
 *   │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
 *   │  │   Types     │    │  Constants  │    │   Utils     │    │
 *   │  │             │    │             │    │             │    │
 *   │  │ - Session   │    │ - Config    │    │ - Session   │    │
 *   │  │ - Message   │    │ - Prompts   │    │   Codes     │    │
 *   │  │ - Queue     │    │ - Errors    │    │ - Stream    │    │
 *   │  │ - Hooks     │    │ - Storage   │    │   Parser    │    │
 *   │  └─────────────┘    └─────────────┘    └─────────────┘    │
 *   │                                                             │
 *   │  ┌───────────────────────────────────────────────────────┐ │
 *   │  │                       HOOKS                           │ │
 *   │  ├───────────────────────────────────────────────────────┤ │
 *   │  │                                                       │ │
 *   │  │  ┌──────────────────┐    ┌──────────────────┐       │ │
 *   │  │  │ useTeacher       │    │ useStudent       │       │ │
 *   │  │  │ AISession        │    │ AISession        │       │ │
 *   │  │  │                  │    │                  │       │ │
 *   │  │  │ - Create session │    │ - Join session   │       │ │
 *   │  │  │ - Manage status  │    │ - View messages  │       │ │
 *   │  │  │ - Track users    │    │ - Submit to queue│       │ │
 *   │  │  └──────────────────┘    └──────────────────┘       │ │
 *   │  │                                                       │ │
 *   │  │  ┌──────────────────┐    ┌──────────────────┐       │ │
 *   │  │  │ useAI            │    │ useMessage       │       │ │
 *   │  │  │ Conversation     │    │ Queue            │       │ │
 *   │  │  │                  │    │                  │       │ │
 *   │  │  │ - Send messages  │    │ - View queue     │       │ │
 *   │  │  │ - Stream AI      │    │ - Promote/dismiss│       │ │
 *   │  │  │ - Promote msgs   │    │ - Highlight      │       │ │
 *   │  │  └──────────────────┘    └──────────────────┘       │ │
 *   │  │                                                       │ │
 *   │  └───────────────────────────────────────────────────────┘ │
 *   │                                                             │
 *   └─────────────────────────────────────────────────────────────┘
 * 
 * USAGE EXAMPLES:
 * ───────────────
 * 
 * TEACHER VIEW:
 * ```typescript
 * import {
 *   useTeacherAISession,
 *   useAIConversation,
 *   useMessageQueue,
 *   DEFAULT_PROMPTS,
 * } from '@/features/ai-live-class';
 * 
 * function TeacherAIClass() {
 *   const { user } = useAuth();
 *   
 *   // Session management
 *   const {
 *     session,
 *     sessionCode,
 *     participants,
 *     createSession,
 *     startSession,
 *     endSession,
 *   } = useTeacherAISession({ teacherId: user.id });
 * 
 *   // AI conversation
 *   const {
 *     messages,
 *     sendMessage,
 *     promoteMessage,
 *     isGenerating,
 *   } = useAIConversation({
 *     sessionId: session?.id || '',
 *     systemPrompt: DEFAULT_PROMPTS.ACADEMIC_WRITING,
 *   });
 * 
 *   // Student message queue
 *   const {
 *     queue,
 *     pendingCount,
 *     promote,
 *     dismiss,
 *   } = useMessageQueue({ sessionId: session?.id || '' });
 * 
 *   // ... render UI
 * }
 * ```
 * 
 * STUDENT VIEW:
 * ```typescript
 * import { useStudentAISession } from '@/features/ai-live-class';
 * 
 * function StudentAIClass() {
 *   const { user } = useAuth();
 *   
 *   const {
 *     session,
 *     messages,
 *     myQueuedMessages,
 *     joinSession,
 *     submitMessage,
 *     isConnected,
 *   } = useStudentAISession({
 *     studentId: user.student_id,
 *     onMessagePromoted: (msg) => {
 *       playSound('promoted');
 *     },
 *   });
 * 
 *   // ... render UI
 * }
 * ```
 * 
 * DATABASE TABLES REQUIRED:
 * ─────────────────────────
 * - ai_live_sessions: Session records
 * - ai_session_participants: Student participation
 * - ai_conversation_messages: Main conversation
 * - ai_message_queue: Student moderation queue
 * 
 * See README.md for complete database schema and migration SQL.
 * 
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// COMPONENT EXPORTS
// -----------------------------------------------------------------------------

export { 
  AISessionLauncher,
  type AISessionLauncherProps,
} from './components';

// -----------------------------------------------------------------------------
// TYPE EXPORTS
// -----------------------------------------------------------------------------

export type {
  // Session types
  SessionStatus,
  AILiveSession,
  
  // Message types
  MessageAuthor,
  ConversationMessage,
  
  // Queue types
  QueueStatus,
  QueuedMessage,
  
  // Participant types
  SessionParticipant,
  
  // Hook return types
  CreateSessionOptions,
  AIConversationState,
  MessageQueueState,
  TeacherSessionState,
  StudentSessionState,
  
  // Utility types
  AIPromptConfig,
  SessionEventType,
  SessionEvent,
} from './types';

// -----------------------------------------------------------------------------
// HOOK EXPORTS
// -----------------------------------------------------------------------------

export {
  // Teacher hooks
  useTeacherAISession,
  type UseTeacherAISessionOptions,
  
  // Student hooks
  useStudentAISession,
  type UseStudentAISessionOptions,
  
  // Conversation hooks
  useAIConversation,
  type UseAIConversationOptions,
  
  // Queue hooks
  useMessageQueue,
  type UseMessageQueueOptions,
} from './hooks';

// -----------------------------------------------------------------------------
// CONSTANT EXPORTS
// -----------------------------------------------------------------------------

export {
  // Configuration
  SESSION_CONFIG,
  QUEUE_CONFIG,
  AI_CONFIG,
  UI_CONFIG,
  
  // Prompts
  DEFAULT_PROMPTS,
  
  // Display helpers
  STATUS_DISPLAY,
  QUEUE_STATUS_DISPLAY,
  
  // Storage
  STORAGE_KEYS,
  
  // Error messages
  ERROR_MESSAGES,
} from './constants';

// -----------------------------------------------------------------------------
// UTILITY EXPORTS
// -----------------------------------------------------------------------------

export {
  // Session code utilities
  generateSessionCode,
  isValidSessionCode,
  normalizeSessionCode,
  formatSessionCodeForDisplay,
  extractSessionCode,
  
  // Stream parsing utilities
  parseSSELine,
  parseSSEChunk,
  parseSSEStream,
  handleStreamingResponse,
  type StreamChunkCallback,
  type StreamParseResult,
} from './utils';
