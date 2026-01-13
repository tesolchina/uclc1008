/**
 * Session Persistence Utilities
 * 
 * Helper functions for persisting live session state across page refreshes.
 * Uses localStorage for cross-tab persistence.
 */

import { STORAGE_KEYS } from '../constants';

// ============= Types =============

export interface PersistedSessionState {
  sessionId: string;
  sessionCode: string;
  lessonId: string;
  role: 'teacher' | 'student';
  participantId?: string;
  displayName?: string;
  studentIdentifier?: string;
  joinedAt: string;
}

// ============= Storage Functions =============

/**
 * Save session state to localStorage
 */
export function saveSessionState(state: PersistedSessionState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.sessionState, JSON.stringify(state));
    if (state.studentIdentifier) {
      localStorage.setItem(STORAGE_KEYS.studentIdentifier, state.studentIdentifier);
    }
    console.log('[SessionPersistence] Saved session state:', state.sessionCode, state.role);
  } catch (error) {
    console.error('[SessionPersistence] Error saving state:', error);
  }
}

/**
 * Load session state from localStorage
 */
export function loadSessionState(): PersistedSessionState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.sessionState);
    if (!stored) return null;
    const state = JSON.parse(stored) as PersistedSessionState;
    console.log('[SessionPersistence] Loaded session state:', state.sessionCode, state.role);
    return state;
  } catch (error) {
    console.error('[SessionPersistence] Error loading state:', error);
    return null;
  }
}

/**
 * Clear session state from localStorage
 */
export function clearSessionState(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.sessionState);
    console.log('[SessionPersistence] Cleared session state');
  } catch (error) {
    console.error('[SessionPersistence] Error clearing state:', error);
  }
}

/**
 * Get session state for a specific lesson
 */
export function getSessionStateForLesson(lessonId: string): PersistedSessionState | null {
  const state = loadSessionState();
  if (state && state.lessonId === lessonId) {
    return state;
  }
  return null;
}

/**
 * Get or create student identifier
 */
export function getStudentIdentifier(): string {
  let studentId = localStorage.getItem(STORAGE_KEYS.studentIdentifier);
  if (!studentId) {
    studentId = `anon_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem(STORAGE_KEYS.studentIdentifier, studentId);
  }
  return studentId;
}

/**
 * Store pending session join info (for redirect flows)
 */
export function setPendingJoin(code: string, displayName?: string): void {
  sessionStorage.setItem(STORAGE_KEYS.pendingSessionCode, code);
  if (displayName) {
    sessionStorage.setItem(STORAGE_KEYS.pendingDisplayName, displayName);
  }
}

/**
 * Get and clear pending session join info
 */
export function consumePendingJoin(): { code: string; displayName?: string } | null {
  const code = sessionStorage.getItem(STORAGE_KEYS.pendingSessionCode);
  if (!code) return null;
  
  const displayName = sessionStorage.getItem(STORAGE_KEYS.pendingDisplayName) || undefined;
  
  sessionStorage.removeItem(STORAGE_KEYS.pendingSessionCode);
  sessionStorage.removeItem(STORAGE_KEYS.pendingDisplayName);
  
  return { code, displayName };
}
