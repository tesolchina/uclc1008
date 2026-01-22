/**
 * Types for the classroom discussion module
 */

export type TaskExcerpt = {
  label: string;
  preview: string;
  full: string;
};

export type Hour3Task = {
  id: string;
  title: string;
  prompt: string;
  context?: string;
  skillFocus: string[];
  wordLimit?: number;
  sampleAnswer?: string;
  rubricPoints?: string[];
  excerpts?: TaskExcerpt[];
};

export type DiscussionSession = {
  id: string;
  session_id: string;
  week_number: number;
  current_task_id: string | null;
  task_context: string | null;
  created_at: string;
};

export type DiscussionThread = {
  id: string;
  session_id: string;
  response_id: string | null;
  author_type: 'ai' | 'teacher';
  content: string;
  parent_id: string | null;
  is_spotlight: boolean;
  created_at: string;
};

export type StudentTaskProgress = {
  taskId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  response?: string;
  aiFeedback?: string;
  submittedAt?: string;
};

export type ActiveSessionInfo = {
  sessionCode: string;
  teacherName: string;
  currentTaskId: string | null;
  currentTaskTitle: string | null;
  participantCount: number;
  weekNumber: number;
};
