/**
 * =============================================================================
 * AI LIVE CLASS - UTILITIES INDEX
 * =============================================================================
 * 
 * Re-exports all utility functions for the AI Live Class feature.
 * Import utilities from this file for a cleaner API.
 * 
 * @module ai-live-class/utils
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * import { 
 *   generateSessionCode, 
 *   isValidSessionCode,
 *   parseSSEStream,
 * } from '@/features/ai-live-class/utils';
 * ```
 * 
 * =============================================================================
 */

// Session code utilities
export {
  generateSessionCode,
  isValidSessionCode,
  normalizeSessionCode,
  formatSessionCodeForDisplay,
  extractSessionCode,
} from './sessionCode';

// Stream parsing utilities
export {
  parseSSELine,
  parseSSEChunk,
  parseSSEStream,
  handleStreamingResponse,
  type StreamChunkCallback,
  type StreamParseResult,
} from './streamParser';
