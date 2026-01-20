/**
 * @fileoverview Hour-related data exports.
 * 
 * This module re-exports all hour-specific data including:
 * - Practice paragraphs for exercises
 * - Concept options for different task types
 * - Progress tracking utilities
 */

// Practice data and concept options
export {
  PRACTICE_PARAGRAPHS,
  PARAPHRASING_STRATEGIES,
  AWQ_SKILLS,
  CITATION_CONCEPTS,
  OUTLINING_CONCEPTS,
  SKIMMING_SCANNING_CONCEPTS,
  HOUR_TASK_COUNTS,
  getHourTaskCount,
  getProgressKey,
  loadProgress,
  saveProgress,
} from './practiceData';
