/**
 * Live Session Types
 * 
 * Core TypeScript interfaces for the live session system.
 * These types are designed to be framework-agnostic and reusable.
 */

// ============= Session Types =============

export interface LiveSession {
  id: string;
  session_code: string;
  lesson_id: string;
  teacher_id: string;
  title: string | null;
  status: SessionStatus;
  current_section: string | null;
  current_question_index: number;
  allow_ahead: boolean;
  settings: SessionSettings;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

export type SessionStatus = 'waiting' | 'active' | 'paused' | 'ended';

export interface SessionSettings {
  [key: string]: unknown;
}

// ============= Participant Types =============

export interface SessionParticipant {
  id: string;
  session_id: string;
  student_identifier: string;
  display_name: string | null;
  is_online: boolean;
  last_seen_at: string;
  current_section: string | null;
  joined_at: string;
}

// ============= Response Types =============

export interface SessionResponse {
  id: string;
  session_id: string;
  participant_id: string;
  question_type: string;
  question_index: number;
  response: ResponseData;
  is_correct: boolean | null;
  ai_feedback: string | null;
  submitted_at: string;
}

export interface ResponseData {
  answerIndex?: number;
  answer?: string;
  text?: string;
  [key: string]: unknown;
}

// ============= Prompt Types =============

export interface SessionPrompt {
  id: string;
  session_id: string;
  prompt_type: PromptType;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type PromptType = 'message' | 'focus' | 'timer' | 'poll';

// ============= Question Types =============

export interface MCQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface OpenEndedQuestion {
  id: string;
  question: string;
  hints?: string[];
  wordLimit?: number;
}

// ============= Session Content =============

export interface SessionContent {
  notes: string[];
  keyConcepts: string[];
  mcQuestions: MCQuestion[];
  openEndedQuestions: OpenEndedQuestion[];
}

// ============= Hook Return Types =============

export interface TeacherSessionState {
  session: LiveSession | null;
  participants: SessionParticipant[];
  responses: SessionResponse[];
  isLoading: boolean;
  isReconnecting: boolean;
}

export interface TeacherSessionActions {
  createSession: (title?: string) => Promise<LiveSession | null>;
  startSession: () => Promise<void>;
  togglePause: () => Promise<void>;
  endSession: () => Promise<void>;
  updatePosition: (section: string, questionIndex: number) => Promise<void>;
  sendPrompt: (type: PromptType, content: string, metadata?: Record<string, unknown>) => Promise<void>;
  toggleAllowAhead: () => Promise<void>;
  refreshResponses: () => Promise<void>;
}

export interface StudentSessionState {
  session: LiveSession | null;
  participant: SessionParticipant | null;
  participants: SessionParticipant[];
  prompts: SessionPrompt[];
  latestPrompt: SessionPrompt | null;
  responses: SessionResponse[];
  isJoining: boolean;
  isReconnecting: boolean;
}

export interface StudentSessionActions {
  joinSession: (code: string, displayName?: string) => Promise<boolean>;
  leaveSession: () => Promise<void>;
  submitResponse: (
    questionType: string,
    questionIndex: number,
    response: Record<string, unknown>,
    isCorrect?: boolean
  ) => Promise<void>;
  updateSection: (section: string) => Promise<void>;
  dismissPrompt: () => void;
}

// ============= Configuration =============

export interface LiveSessionConfig {
  /** Base URL for session join links */
  joinBaseUrl: string;
  /** Heartbeat interval in milliseconds */
  heartbeatInterval: number;
  /** Refresh interval for participants in milliseconds */
  participantRefreshInterval: number;
  /** Enable debug logging */
  debug: boolean;
}

// ============= Event Types =============

export type SessionEventType = 
  | 'session_created'
  | 'session_started'
  | 'session_paused'
  | 'session_resumed'
  | 'session_ended'
  | 'participant_joined'
  | 'participant_left'
  | 'response_submitted'
  | 'position_updated'
  | 'prompt_sent';

export interface SessionEvent {
  type: SessionEventType;
  timestamp: string;
  data: Record<string, unknown>;
}
