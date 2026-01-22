/**
 * =============================================================================
 * AI LIVE CLASS - TASK TYPES
 * =============================================================================
 * 
 * Types for dynamically generated tasks within AI conversations.
 * The AI can generate tasks on-the-fly using special tags, and teachers
 * can also request task generation manually.
 * 
 * @module ai-live-class/types/tasks
 * @version 1.0.0
 * 
 * =============================================================================
 */

/**
 * Task types that can be generated in the chat.
 */
export type GeneratedTaskType = 'mcq' | 'writing' | 'paragraph' | 'poll';

/**
 * Status of a generated task in the session.
 */
export type TaskStatus = 'active' | 'closed' | 'draft';

/**
 * An option for MCQ or Poll tasks.
 */
export interface TaskOption {
  id: string;
  label: string;
  isCorrect?: boolean; // Only for MCQ
}

/**
 * Base interface for all generated tasks.
 */
export interface GeneratedTaskBase {
  /** Unique identifier */
  id: string;
  
  /** Type of task */
  type: GeneratedTaskType;
  
  /** Task prompt/question */
  prompt: string;
  
  /** Current status */
  status: TaskStatus;
  
  /** ID of the message that contains this task */
  messageId?: string;
  
  /** Optional time limit in seconds */
  timeLimit?: number;
  
  /** Optional context/reading material */
  context?: string;
  
  /** Optional hints */
  hints?: string[];
  
  /** When task was created */
  createdAt: string;
}

/**
 * MCQ task with options.
 */
export interface MCQTask extends GeneratedTaskBase {
  type: 'mcq';
  options: TaskOption[];
  correctOptionId?: string;
  explanation?: string;
}

/**
 * Writing task (sentence-level).
 */
export interface WritingTask extends GeneratedTaskBase {
  type: 'writing';
  wordLimit?: number;
  modelAnswer?: string;
  rubricPoints?: string[];
}

/**
 * Paragraph task (longer form).
 */
export interface ParagraphTask extends GeneratedTaskBase {
  type: 'paragraph';
  wordLimit?: number;
  modelAnswer?: string;
  rubricPoints?: string[];
}

/**
 * Poll task (no correct answer).
 */
export interface PollTask extends GeneratedTaskBase {
  type: 'poll';
  options: TaskOption[];
}

/**
 * Union type for all generated tasks.
 */
export type GeneratedTask = MCQTask | WritingTask | ParagraphTask | PollTask;

/**
 * Parsed task from AI response.
 */
export interface ParsedTask {
  task: GeneratedTask;
  startIndex: number;
  endIndex: number;
  rawTag: string;
}

/**
 * Result of parsing an AI message for tasks.
 */
export interface TaskParseResult {
  /** Clean content with task tags removed */
  cleanContent: string;
  
  /** Extracted tasks */
  tasks: ParsedTask[];
  
  /** Whether any tasks were found */
  hasTasks: boolean;
}

/**
 * Task library item from the curriculum.
 */
export interface TaskLibraryItem {
  id: string;
  title: string;
  prompt: string;
  type: GeneratedTaskType;
  weekNumber: number;
  hourNumber?: number;
  skillFocus?: string[];
  wordLimit?: number;
  context?: string;
  excerpts?: {
    label: string;
    preview: string;
    full: string;
  }[];
  rubricPoints?: string[];
  sampleAnswer?: string;
}

/**
 * Props for rendering a task in the chat.
 */
export interface TaskRenderProps {
  task: GeneratedTask;
  sessionId: string;
  participantId?: string;
  isTeacher: boolean;
  onSubmit?: (response: unknown) => void;
  onClose?: () => void;
}
