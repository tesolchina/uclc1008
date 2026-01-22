/**
 * =============================================================================
 * AI LIVE CLASS - TEACHER SESSION HOOK
 * =============================================================================
 * 
 * This hook manages the complete teacher experience for AI Live Class sessions.
 * It combines session lifecycle management with participant tracking.
 * 
 * @module ai-live-class/hooks/useTeacherAISession
 * @version 1.0.0
 * 
 * USAGE:
 * ```typescript
 * const {
 *   session,
 *   sessionCode,
 *   participantCount,
 *   createSession,
 *   startSession,
 *   endSession,
 * } = useTeacherAISession({ teacherId: 'teacher-uuid' });
 * ```
 * 
 * =============================================================================
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateSessionCode } from '../utils/sessionCode';
import { SESSION_CONFIG, ERROR_MESSAGES, STORAGE_KEYS } from '../constants';
import type {
  AILiveSession,
  SessionStatus,
  SessionParticipant,
  CreateSessionOptions,
  TeacherSessionState,
} from '../types';

// =============================================================================
// HOOK OPTIONS INTERFACE
// =============================================================================

/**
 * Configuration options for the useTeacherAISession hook.
 */
export interface UseTeacherAISessionOptions {
  /**
   * The teacher's user ID.
   * Required for session creation and permission checks.
   */
  teacherId: string;

  /**
   * Optional callback when a participant joins.
   */
  onParticipantJoin?: (participant: SessionParticipant) => void;

  /**
   * Optional callback when a participant leaves.
   */
  onParticipantLeave?: (participant: SessionParticipant) => void;

  /**
   * Whether to automatically reconnect to an existing session.
   * Default: true
   */
  autoReconnect?: boolean;
}

// =============================================================================
// MAIN HOOK IMPLEMENTATION
// =============================================================================

/**
 * Hook for teachers to manage AI Live Class sessions.
 * 
 * Provides complete session lifecycle management:
 * - Create new sessions with unique codes
 * - Start/pause/resume/end session control
 * - Real-time participant tracking
 * - Auto-reconnection to active sessions
 * 
 * @param options - Configuration options
 * @returns State and methods for session management
 * 
 * @example
 * ```typescript
 * function TeacherDashboard() {
 *   const { user } = useAuth();
 *   const {
 *     session,
 *     sessionCode,
 *     participants,
 *     participantCount,
 *     createSession,
 *     startSession,
 *     pauseSession,
 *     endSession,
 *     isLoading,
 *   } = useTeacherAISession({ teacherId: user.id });
 * 
 *   if (!session) {
 *     return (
 *       <Button onClick={() => createSession({ topic: 'APA Citation' })}>
 *         Start New Session
 *       </Button>
 *     );
 *   }
 * 
 *   return (
 *     <div>
 *       <SessionCodeDisplay code={sessionCode} />
 *       <ParticipantCount count={participantCount} />
 *       <SessionControls
 *         status={session.status}
 *         onStart={startSession}
 *         onPause={pauseSession}
 *         onEnd={endSession}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useTeacherAISession(options: UseTeacherAISessionOptions): TeacherSessionState {
  const {
    teacherId,
    onParticipantJoin,
    onParticipantLeave,
    autoReconnect = true,
  } = options;

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  /**
   * The current session data.
   * Null if no session is active.
   */
  const [session, setSession] = useState<AILiveSession | null>(null);

  /**
   * Session code for sharing with students.
   * Extracted from session for convenience.
   */
  const [sessionCode, setSessionCode] = useState<string | null>(null);

  /**
   * All participants in the current session.
   */
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);

  /**
   * Whether session data is loading.
   */
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  /**
   * Count of currently online participants.
   */
  const participantCount = participants.filter(p => p.is_online).length;

  // ---------------------------------------------------------------------------
  // AUTO-RECONNECT TO EXISTING SESSION
  // ---------------------------------------------------------------------------

  /**
   * Checks for and reconnects to an existing active session.
   */
  useEffect(() => {
    const checkExistingSession = async () => {
      if (!teacherId || !autoReconnect) {
        setIsLoading(false);
        return;
      }

      try {
        // Look for an active session created by this teacher
        const { data, error } = await supabase
          .from('ai_live_sessions')
          .select('*')
          .eq('teacher_id', teacherId)
          .in('status', ['waiting', 'active', 'paused'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          // No active session found - this is normal
          if (error.code !== 'PGRST116') {
            console.error('[useTeacherAISession] Error checking session:', error);
          }
        } else if (data) {
          // Found an active session - reconnect
          console.log('[useTeacherAISession] Reconnecting to session:', data.id);
          setSession(data as AILiveSession);
          setSessionCode(data.session_code);

          // Load participants
          await loadParticipants(data.id);
        }
      } catch (err) {
        console.error('[useTeacherAISession] Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, [teacherId, autoReconnect]);

  // ---------------------------------------------------------------------------
  // PARTICIPANT LOADING
  // ---------------------------------------------------------------------------

  /**
   * Loads participants for a given session.
   */
  const loadParticipants = async (sessionId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('ai_session_participants')
        .select('*')
        .eq('session_id', sessionId);

      if (error) {
        console.error('[useTeacherAISession] Error loading participants:', error);
        return;
      }

      if (data) {
        setParticipants(data as SessionParticipant[]);
      }
    } catch (err) {
      console.error('[useTeacherAISession] Unexpected error:', err);
    }
  };

  // ---------------------------------------------------------------------------
  // REAL-TIME SUBSCRIPTIONS
  // ---------------------------------------------------------------------------

  /**
   * Subscribes to participant changes for real-time updates.
   */
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`ai-session-participants-${session.id}`)
      // New participant joined
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_session_participants',
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          const newParticipant = payload.new as SessionParticipant;
          setParticipants(prev => {
            if (prev.some(p => p.id === newParticipant.id)) {
              return prev;
            }
            return [...prev, newParticipant];
          });

          if (onParticipantJoin) {
            onParticipantJoin(newParticipant);
          }
        }
      )
      // Participant status updated (online/offline)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ai_session_participants',
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          const updatedParticipant = payload.new as SessionParticipant;
          const oldParticipant = payload.old as SessionParticipant;

          setParticipants(prev => prev.map(p =>
            p.id === updatedParticipant.id ? updatedParticipant : p
          ));

          // Check if participant went offline
          if (oldParticipant.is_online && !updatedParticipant.is_online && onParticipantLeave) {
            onParticipantLeave(updatedParticipant);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id, onParticipantJoin, onParticipantLeave]);

  // ---------------------------------------------------------------------------
  // CREATE SESSION
  // ---------------------------------------------------------------------------

  /**
   * Creates a new AI Live Class session.
   * Generates a unique session code and persists to database.
   * 
   * @param createOptions - Options for the new session
   * @returns True if session was created successfully
   */
  const createSession = useCallback(async (
    createOptions: CreateSessionOptions
  ): Promise<boolean> => {
    if (!teacherId) {
      toast.error(ERROR_MESSAGES.NOT_AUTHENTICATED);
      return false;
    }

    setIsLoading(true);

    try {
      // Generate unique session code
      const code = generateSessionCode();

      // Create the session in the database
      const { data, error } = await supabase
        .from('ai_live_sessions')
        .insert({
          session_code: code,
          teacher_id: teacherId,
          status: 'waiting',
          topic: createOptions.topic,
          description: createOptions.description || null,
          material_id: createOptions.materialId || null,
          week_number: createOptions.weekNumber || null,
        })
        .select()
        .single();

      if (error) {
        console.error('[useTeacherAISession] Error creating session:', error);
        toast.error('Failed to create session');
        return false;
      }

      // Update local state
      setSession(data as AILiveSession);
      setSessionCode(data.session_code);
      setParticipants([]);

      // Store topic for reuse
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_TOPIC, createOptions.topic);
      } catch {
        // localStorage might be unavailable
      }

      toast.success(`Session created! Code: ${data.session_code}`);
      return true;

    } catch (err) {
      console.error('[useTeacherAISession] Unexpected error:', err);
      toast.error('Failed to create session');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [teacherId]);

  // ---------------------------------------------------------------------------
  // SESSION STATUS UPDATES
  // ---------------------------------------------------------------------------

  /**
   * Updates the session status in the database.
   * 
   * @param newStatus - The new status to set
   * @param additionalUpdates - Optional additional fields to update
   */
  const updateSessionStatus = async (
    newStatus: SessionStatus,
    additionalUpdates: Partial<AILiveSession> = {}
  ): Promise<void> => {
    if (!session?.id) return;

    try {
      const updates: Partial<AILiveSession> = {
        status: newStatus,
        ...additionalUpdates,
      };

      const { error } = await supabase
        .from('ai_live_sessions')
        .update(updates)
        .eq('id', session.id);

      if (error) {
        console.error('[useTeacherAISession] Error updating status:', error);
        toast.error('Failed to update session');
        return;
      }

      // Update local state
      setSession(prev => prev ? { ...prev, ...updates } : null);

    } catch (err) {
      console.error('[useTeacherAISession] Unexpected error:', err);
      toast.error('Failed to update session');
    }
  };

  /**
   * Starts the session (changes status from 'waiting' to 'active').
   */
  const startSession = useCallback(async (): Promise<void> => {
    await updateSessionStatus('active', {
      started_at: new Date().toISOString(),
    });
    toast.success('Session started!');
  }, [session?.id]);

  /**
   * Pauses an active session.
   */
  const pauseSession = useCallback(async (): Promise<void> => {
    await updateSessionStatus('paused');
    toast.info('Session paused');
  }, [session?.id]);

  /**
   * Resumes a paused session.
   */
  const resumeSession = useCallback(async (): Promise<void> => {
    await updateSessionStatus('active');
    toast.success('Session resumed');
  }, [session?.id]);

  /**
   * Ends the session permanently.
   */
  const endSession = useCallback(async (): Promise<void> => {
    await updateSessionStatus('ended', {
      ended_at: new Date().toISOString(),
    });

    // Clear local state
    setSession(null);
    setSessionCode(null);
    setParticipants([]);

    toast.success('Session ended');
  }, [session?.id]);

  // ---------------------------------------------------------------------------
  // UPDATE TOPIC
  // ---------------------------------------------------------------------------

  /**
   * Updates the session topic.
   * 
   * @param topic - The new topic
   */
  const updateTopic = useCallback(async (topic: string): Promise<void> => {
    if (!session?.id) return;

    try {
      const { error } = await supabase
        .from('ai_live_sessions')
        .update({ topic })
        .eq('id', session.id);

      if (error) {
        console.error('[useTeacherAISession] Error updating topic:', error);
        toast.error('Failed to update topic');
        return;
      }

      setSession(prev => prev ? { ...prev, topic } : null);
      toast.success('Topic updated');

    } catch (err) {
      console.error('[useTeacherAISession] Unexpected error:', err);
    }
  }, [session?.id]);

  // ---------------------------------------------------------------------------
  // RETURN STATE AND METHODS
  // ---------------------------------------------------------------------------

  return {
    session,
    sessionCode,
    isLoading,
    participantCount,
    participants,
    createSession,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    updateTopic,
  };
}
