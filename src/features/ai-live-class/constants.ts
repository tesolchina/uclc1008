/**
 * =============================================================================
 * AI LIVE CLASS - CONSTANTS
 * =============================================================================
 * 
 * This file contains all configuration constants for the AI Live Class feature.
 * Centralizing these values makes it easy to adjust behavior without modifying
 * the core logic, and ensures consistency across all components.
 * 
 * @module ai-live-class/constants
 * @version 1.0.0
 * 
 * =============================================================================
 */

// =============================================================================
// SESSION CONFIGURATION
// =============================================================================

/**
 * Default configuration for AI Live Class sessions.
 * These can be overridden when creating individual sessions.
 */
export const SESSION_CONFIG = {
  /**
   * Length of the session join code.
   * 6 characters provides 2.1 billion combinations (36^6),
   * sufficient for uniqueness while remaining easy to type.
   */
  CODE_LENGTH: 6,

  /**
   * Characters used to generate session codes.
   * Excludes ambiguous characters (0, O, I, L) for readability.
   */
  CODE_CHARACTERS: 'ABCDEFGHJKMNPQRSTUVWXYZ23456789',

  /**
   * Maximum number of participants allowed in a single session.
   * Can be increased based on infrastructure capacity.
   */
  MAX_PARTICIPANTS: 100,

  /**
   * Interval (ms) for participant heartbeat pings.
   * Used to detect disconnected participants.
   */
  HEARTBEAT_INTERVAL: 30000, // 30 seconds

  /**
   * Time (ms) after which a participant is considered offline
   * if no heartbeat is received.
   */
  OFFLINE_THRESHOLD: 90000, // 90 seconds (3 missed heartbeats)
} as const;

// =============================================================================
// MESSAGE QUEUE CONFIGURATION
// =============================================================================

/**
 * Configuration for the message moderation queue.
 */
export const QUEUE_CONFIG = {
  /**
   * Maximum length of a student message in characters.
   * Prevents extremely long submissions that could disrupt the flow.
   */
  MAX_MESSAGE_LENGTH: 500,

  /**
   * Minimum length for a message to be valid.
   * Prevents empty or single-character submissions.
   */
  MIN_MESSAGE_LENGTH: 5,

  /**
   * Rate limit: maximum messages per student per minute.
   * Prevents spam while allowing active participation.
   */
  RATE_LIMIT_PER_MINUTE: 5,

  /**
   * Maximum pending messages shown in teacher queue.
   * Older messages are still accessible but hidden from immediate view.
   */
  VISIBLE_QUEUE_SIZE: 50,

  /**
   * Time (ms) to highlight a newly received message.
   * Provides visual feedback for new submissions.
   */
  NEW_MESSAGE_HIGHLIGHT_DURATION: 3000,
} as const;

// =============================================================================
// AI CONFIGURATION
// =============================================================================

/**
 * Configuration for AI conversation behavior.
 */
export const AI_CONFIG = {
  /**
   * Default model to use for AI responses.
   * Uses Lovable AI's supported models.
   */
  DEFAULT_MODEL: 'openai/gpt-5-mini',

  /**
   * Maximum tokens for AI responses.
   * Balances detail with response time.
   */
  MAX_RESPONSE_TOKENS: 1000,

  /**
   * Number of previous messages to include as context.
   * More context = better coherence but higher cost.
   */
  CONTEXT_MESSAGE_LIMIT: 10,

  /**
   * Temperature setting for AI responses.
   * 0.7 provides a balance between creativity and consistency.
   */
  TEMPERATURE: 0.7,

  /**
   * Timeout (ms) for AI response generation.
   * Prevents indefinite waiting on slow responses.
   */
  RESPONSE_TIMEOUT: 60000, // 60 seconds
} as const;

// =============================================================================
// DEFAULT PROMPTS
// =============================================================================

/**
 * Default system prompts for different contexts.
 * These can be customized per session or per topic.
 */
export const DEFAULT_PROMPTS = {
  /**
   * General academic discussion prompt.
   * Provides a balanced, educational AI persona.
   */
  ACADEMIC_GENERAL: `You are an expert academic tutor facilitating a live classroom discussion.

Your role:
- Provide clear, educational explanations
- Encourage critical thinking and deeper understanding
- Reference academic best practices and standards
- Keep responses focused and concise (2-3 paragraphs max)
- When student questions are promoted, address them directly and helpfully
- Maintain an encouraging, professional tone

Remember: This is a live session with students watching. Be engaging and interactive.`,

  /**
   * Academic writing specific prompt.
   * Focuses on writing skills and techniques.
   */
  ACADEMIC_WRITING: `You are an expert academic writing tutor facilitating a live classroom session.

Focus areas:
- Citation styles (APA, MLA, Chicago)
- Paraphrasing and summarizing techniques
- Argument construction and thesis development
- Academic tone and clarity
- Avoiding plagiarism and proper attribution

Guidelines:
- Provide specific, actionable feedback
- Use examples to illustrate concepts
- Reference standard academic conventions
- Keep explanations clear and accessible
- Encourage questions from students`,

  /**
   * Critical thinking and analysis prompt.
   */
  CRITICAL_ANALYSIS: `You are a critical thinking facilitator for an academic discussion.

Your approach:
- Guide students through analytical frameworks
- Ask probing questions to deepen understanding
- Help identify assumptions and biases
- Encourage evidence-based reasoning
- Model good analytical practices

Keep responses interactive and thought-provoking.`,
} as const;

// =============================================================================
// UI CONFIGURATION
// =============================================================================

/**
 * Configuration for UI behavior and display.
 */
export const UI_CONFIG = {
  /**
   * Maximum visible messages in the conversation panel.
   * Older messages can be scrolled to view.
   */
  MAX_VISIBLE_MESSAGES: 100,

  /**
   * Debounce time (ms) for typing indicators.
   */
  TYPING_DEBOUNCE: 500,

  /**
   * Animation duration (ms) for message transitions.
   */
  MESSAGE_ANIMATION_DURATION: 300,

  /**
   * Auto-scroll threshold: distance from bottom (px)
   * where auto-scroll remains active.
   */
  AUTO_SCROLL_THRESHOLD: 100,

  /**
   * Polling interval (ms) for participant count updates.
   * Used as fallback if realtime subscription fails.
   */
  PARTICIPANT_POLL_INTERVAL: 10000,
} as const;

// =============================================================================
// STATUS LABELS AND COLORS
// =============================================================================

/**
 * Display labels and associated colors for session statuses.
 * Uses semantic color tokens from the design system.
 */
export const STATUS_DISPLAY = {
  waiting: {
    label: 'Waiting to Start',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    dotColor: 'bg-amber-500',
  },
  active: {
    label: 'Live',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    dotColor: 'bg-green-500',
  },
  paused: {
    label: 'Paused',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    dotColor: 'bg-orange-500',
  },
  ended: {
    label: 'Ended',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    dotColor: 'bg-muted-foreground',
  },
} as const;

/**
 * Display labels for queue message statuses.
 */
export const QUEUE_STATUS_DISPLAY = {
  pending: {
    label: 'Pending Review',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  promoted: {
    label: 'Promoted',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  dismissed: {
    label: 'Dismissed',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
} as const;

// =============================================================================
// LOCAL STORAGE KEYS
// =============================================================================

/**
 * Keys for persisting data in localStorage.
 * Prefixed to avoid conflicts with other features.
 */
export const STORAGE_KEYS = {
  /** Last joined session code (for reconnection) */
  LAST_SESSION_CODE: 'ai-live-class:last-session',
  
  /** Student's preferred display name */
  DISPLAY_NAME: 'ai-live-class:display-name',
  
  /** Teacher's last used topic */
  LAST_TOPIC: 'ai-live-class:last-topic',
  
  /** Teacher's custom system prompt */
  CUSTOM_PROMPT: 'ai-live-class:custom-prompt',
} as const;

// =============================================================================
// ERROR MESSAGES
// =============================================================================

/**
 * User-friendly error messages for common scenarios.
 */
export const ERROR_MESSAGES = {
  SESSION_NOT_FOUND: 'Session not found. Please check the code and try again.',
  SESSION_ENDED: 'This session has ended.',
  SESSION_FULL: 'This session is full. Please try again later.',
  RATE_LIMITED: 'You\'re sending messages too quickly. Please wait a moment.',
  MESSAGE_TOO_LONG: `Message exceeds the ${QUEUE_CONFIG.MAX_MESSAGE_LENGTH} character limit.`,
  MESSAGE_TOO_SHORT: 'Please enter a longer message.',
  CONNECTION_LOST: 'Connection lost. Attempting to reconnect...',
  AI_ERROR: 'Failed to get AI response. Please try again.',
  NOT_AUTHENTICATED: 'Please log in to access this feature.',
  PERMISSION_DENIED: 'You don\'t have permission to perform this action.',
} as const;
