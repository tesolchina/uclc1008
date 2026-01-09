// Helper hook for persisting live session state across page refreshes

const STORAGE_KEY = 'live_session_state';

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

export function saveSessionState(state: PersistedSessionState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log('[SessionPersistence] Saved session state:', state.sessionCode, state.role);
  } catch (error) {
    console.error('[SessionPersistence] Error saving state:', error);
  }
}

export function loadSessionState(): PersistedSessionState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const state = JSON.parse(stored) as PersistedSessionState;
    console.log('[SessionPersistence] Loaded session state:', state.sessionCode, state.role);
    return state;
  } catch (error) {
    console.error('[SessionPersistence] Error loading state:', error);
    return null;
  }
}

export function clearSessionState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[SessionPersistence] Cleared session state');
  } catch (error) {
    console.error('[SessionPersistence] Error clearing state:', error);
  }
}

export function getSessionStateForLesson(lessonId: string): PersistedSessionState | null {
  const state = loadSessionState();
  if (state && state.lessonId === lessonId) {
    return state;
  }
  return null;
}
