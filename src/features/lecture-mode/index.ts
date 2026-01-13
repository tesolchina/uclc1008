/**
 * Lecture Mode Module
 * 
 * A complete lecture outline and progress tracking system for teacher-led sessions.
 * 
 * Features:
 * - Real-time lecture position sync between teacher and students
 * - Section-by-section progress tracking
 * - Key takeaways for completed sections
 * - Student notes per section
 * - Behavior goal reminders
 * 
 * Usage:
 * ```tsx
 * import { LectureOutline, useLecturePosition, useSectionProgress } from '@/features/lecture-mode';
 * 
 * // In a component
 * const { currentSectionIndex, advanceSection } = useLecturePosition({
 *   sessionId: 'session-id',
 *   sections: hourData.agenda,
 *   isTeacher: true,
 * });
 * 
 * <LectureOutline
 *   weekNumber={1}
 *   hourNumber={1}
 *   sections={hourData.agenda}
 *   currentIndex={currentSectionIndex}
 *   completedIndices={[0, 1]}
 *   isLive={true}
 *   behaviorGoal={hourData.behaviourChange}
 * />
 * ```
 */

// Types
export * from './types';

// Constants
export * from './constants';

// Hooks
export { useLecturePosition } from './hooks/useLecturePosition';
export { useSectionProgress } from './hooks/useSectionProgress';

// Components
export { LectureOutline } from './components/LectureOutline';
export { SectionCard } from './components/SectionCard';
export { OutlineProgress } from './components/OutlineProgress';
