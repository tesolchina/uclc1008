/**
 * Lecture Mode Types
 * 
 * Core TypeScript interfaces for the lecture outline and progress tracking system.
 */

// ============= Agenda Section Types =============

export interface AgendaSectionEnhanced {
  id: string;
  title: string;
  duration: string;
  activities: string[];
  keyTakeaway?: string;
  relatedConcepts?: string[];
  type?: 'intro' | 'concept' | 'practice' | 'discussion' | 'wrap-up';
}

// ============= Lecture Position Types =============

export interface LecturePosition {
  currentSectionIndex: number;
  currentSectionId: string;
  completedSections: string[];
  sectionStartedAt: string | null;
}

// ============= Section Progress Types =============

export interface SectionProgress {
  id: string;
  studentId: string;
  weekNumber: number;
  hourNumber: number;
  sectionId: string;
  sectionIndex: number;
  notes: string | null;
  keyTakeawayViewed: boolean;
  completedAt: string | null;
  visitedAt: string;
}

// ============= Outline State Types =============

export interface OutlineState {
  sections: AgendaSectionEnhanced[];
  currentIndex: number;
  completedIndices: number[];
  isLive: boolean;
  isTeacher: boolean;
}

// ============= Hook Return Types =============

export interface LecturePositionState {
  currentSectionIndex: number;
  currentSectionId: string | null;
  completedSections: string[];
  sectionStartedAt: string | null;
  isLoading: boolean;
}

export interface LecturePositionActions {
  // Teacher-only actions
  advanceSection: () => Promise<void>;
  goToSection: (index: number) => Promise<void>;
  markSectionComplete: () => Promise<void>;
  resetPosition: () => Promise<void>;
}

export interface SectionProgressState {
  progress: SectionProgress[];
  isLoading: boolean;
}

export interface SectionProgressActions {
  markSectionVisited: (sectionId: string, sectionIndex: number) => Promise<void>;
  markKeyTakeawayViewed: (sectionId: string) => Promise<void>;
  updateNotes: (sectionId: string, notes: string) => Promise<void>;
  markSectionComplete: (sectionId: string) => Promise<void>;
}

// ============= Component Props Types =============

export interface LectureOutlineProps {
  weekNumber: number;
  hourNumber: number;
  sections: AgendaSectionEnhanced[];
  currentIndex?: number;
  completedIndices?: number[];
  isLive?: boolean;
  isTeacher?: boolean;
  onSectionClick?: (index: number) => void;
  className?: string;
}

export interface SectionCardProps {
  section: AgendaSectionEnhanced;
  index: number;
  isCurrent: boolean;
  isCompleted: boolean;
  isUpcoming: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onClick?: () => void;
  notes?: string;
  onNotesChange?: (notes: string) => void;
}

export interface OutlineProgressProps {
  totalSections: number;
  completedCount: number;
  currentIndex: number;
  totalMinutes?: number;
  elapsedMinutes?: number;
}

// ============= Behavior Goal Types =============

export interface BehaviorGoal {
  habit: string;
  reminder: string;
  checkQuestion?: string;
}
