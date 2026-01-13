/**
 * Live Session Helper Utilities
 * 
 * Pure utility functions for the live session system.
 */

import { ANONYMOUS_ANIMALS } from '../constants';
import type { SessionResponse, MCQuestion } from '../types';

// ============= Anonymous Identity =============

/**
 * Generate consistent anonymous animal identity from participant ID
 */
export function getAnonymousAnimal(participantId: string): { name: string; emoji: string } {
  // Simple hash function to get consistent index
  let hash = 0;
  for (let i = 0; i < participantId.length; i++) {
    const char = participantId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % ANONYMOUS_ANIMALS.length;
  return ANONYMOUS_ANIMALS[index];
}

// ============= Response Statistics =============

export interface ResponseStats {
  total: number;
  correct: number;
  incorrect: number;
  pending: number;
  responses: SessionResponse[];
}

/**
 * Calculate response statistics for a question
 */
export function getResponseStats(
  responses: SessionResponse[],
  participantCount: number,
  questionType: string,
  questionIndex: number
): ResponseStats {
  const questionResponses = responses.filter(
    r => r.question_type === questionType && r.question_index === questionIndex
  );
  const correct = questionResponses.filter(r => r.is_correct === true).length;
  const incorrect = questionResponses.filter(r => r.is_correct === false).length;
  const pending = Math.max(0, participantCount - questionResponses.length);
  
  return {
    total: questionResponses.length,
    correct,
    incorrect,
    pending,
    responses: questionResponses,
  };
}

/**
 * Calculate answer distribution for MC question
 */
export function getMCAnswerDistribution(
  responses: SessionResponse[],
  questionIndex: number,
  optionCount: number
): number[] {
  const distribution = Array(optionCount).fill(0);
  
  responses
    .filter(r => r.question_type === 'mc' && r.question_index === questionIndex)
    .forEach(r => {
      const answerIndex = r.response?.answerIndex;
      if (typeof answerIndex === 'number' && answerIndex >= 0 && answerIndex < optionCount) {
        distribution[answerIndex]++;
      }
    });
  
  return distribution;
}

// ============= Page Navigation =============

export interface PagePosition {
  currentPage: number;
  totalPages: number;
}

/**
 * Calculate current page position based on section and index
 */
export function calculatePagePosition(
  currentType: string,
  currentIndex: number,
  mcCount: number,
  writingCount: number
): PagePosition {
  // Total pages = 1 (notes) + MC questions + writing tasks
  const totalPages = 1 + mcCount + writingCount;
  
  let currentPage = 1;
  if (currentType === 'notes') {
    currentPage = 1;
  } else if (currentType === 'mc') {
    currentPage = 2 + currentIndex; // 1 (notes) + 1 (base) + index
  } else if (currentType === 'writing') {
    currentPage = 2 + mcCount + currentIndex; // 1 (notes) + MC count + 1 (base) + index
  }
  
  return { currentPage, totalPages };
}

/**
 * Get next navigation position
 */
export function getNextPosition(
  currentType: string,
  currentIndex: number,
  mcCount: number,
  writingCount: number,
  direction: 'prev' | 'next'
): { type: string; index: number } {
  let newType = currentType;
  let newIndex = currentIndex;

  if (direction === 'next') {
    if (currentType === 'notes') {
      newType = 'mc';
      newIndex = 0;
    } else if (currentType === 'mc' && currentIndex < mcCount - 1) {
      newIndex = currentIndex + 1;
    } else if (currentType === 'mc') {
      newType = 'writing';
      newIndex = 0;
    } else if (currentType === 'writing' && currentIndex < writingCount - 1) {
      newIndex = currentIndex + 1;
    }
  } else {
    if (currentType === 'writing' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (currentType === 'writing' && currentIndex === 0) {
      newType = 'mc';
      newIndex = mcCount - 1;
    } else if (currentType === 'mc' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (currentType === 'mc' && currentIndex === 0) {
      newType = 'notes';
      newIndex = 0;
    }
  }

  return { type: newType, index: newIndex };
}

// ============= Formatting =============

/**
 * Get human-readable label for current position
 */
export function getPositionLabel(type: string, index: number): string {
  if (type === 'notes') return 'Lead-in Notes';
  if (type === 'mc') return `MC Question ${index + 1}`;
  if (type === 'writing') return `Writing Task ${index + 1}`;
  return 'Unknown';
}

/**
 * Format response for display
 */
export function formatResponseValue(response: Record<string, unknown>): string {
  if (response.answer) return String(response.answer);
  if (response.text) return String(response.text);
  if (response.answerIndex !== undefined) return `Option ${Number(response.answerIndex) + 1}`;
  return JSON.stringify(response);
}

/**
 * Generate session code (for display, actual generation happens server-side)
 */
export function formatSessionCode(code: string): string {
  return code.toUpperCase();
}

/**
 * Validate session code format
 */
export function isValidSessionCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code.toUpperCase());
}
