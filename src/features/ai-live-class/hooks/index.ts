/**
 * =============================================================================
 * AI LIVE CLASS - HOOKS INDEX
 * =============================================================================
 * 
 * Re-exports all hooks for the AI Live Class feature.
 * Import hooks from this file for a cleaner API.
 * 
 * @module ai-live-class/hooks
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * import {
 *   useTeacherAISession,
 *   useStudentAISession,
 *   useAIConversation,
 *   useMessageQueue,
 * } from '@/features/ai-live-class/hooks';
 * ```
 * 
 * =============================================================================
 */

// Teacher-side session management
export { useTeacherAISession } from './useTeacherAISession';
export type { UseTeacherAISessionOptions } from './useTeacherAISession';

// Student-side session participation
export { useStudentAISession } from './useStudentAISession';
export type { UseStudentAISessionOptions } from './useStudentAISession';

// AI conversation management
export { useAIConversation } from './useAIConversation';
export type { UseAIConversationOptions } from './useAIConversation';

// Message queue moderation
export { useMessageQueue } from './useMessageQueue';
export type { UseMessageQueueOptions } from './useMessageQueue';
