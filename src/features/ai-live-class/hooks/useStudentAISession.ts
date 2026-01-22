/**
 * =============================================================================
 * AI LIVE CLASS - STUDENT SESSION HOOK
 * =============================================================================
 * 
 * This hook manages the student experience for AI Live Class sessions.
 * It handles joining sessions, submitting messages, and viewing the conversation.
 * 
 * @module ai-live-class/hooks/useStudentAISession
 * @version 1.0.0
 * 
 * USAGE:
 * ```typescript
 * const {
 *   session,
 *   messages,
 *   joinSession,
 *   submitMessage,
 *   isConnected,
 * } = useStudentAISession({ studentId: 'student-id' });
 * ```
 * 
 * =============================================================================
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { normalizeSessionCode, isValidSessionCode } from '../utils/sessionCode';
import {
  SESSION_CONFIG,
  QUEUE_CONFIG,
  ERROR_MESSAGES,
  STORAGE_KEYS,
} from '../constants';
import type {
  AILiveSession,
  ConversationMessage,
  QueuedMessage,
  MessageAuthor,
  StudentSessionState,
} from '../types';

// =============================================================================
// HOOK OPTIONS INTERFACE
// =============================================================================

/**
 * Configuration options for the useStudentAISession hook.
 */
export interface UseStudentAISessionOptions {
  /**
   * The student's unique identifier.
   * Can be a user ID or student number.
   */
  studentId: string;

  /**
   * Optional callback when a message is promoted.
   * Provides feedback that the student's message was selected.
   */
  onMessagePromoted?: (message: QueuedMessage) => void;

  /**
   * Whether to automatically reconnect to a previous session.
   * Default: true
   */
  autoReconnect?: boolean;
}

// =============================================================================
// MAIN HOOK IMPLEMENTATION
// =============================================================================

/**
 * Hook for students to participate in AI Live Class sessions.
 * 
 * Features:
 * - Join sessions by code
 * - View real-time conversation between teacher and AI
 * - Submit messages to the moderation queue
 * - Track which of your messages were promoted
 * - Heartbeat mechanism for online status
 * 
 * @param options - Configuration options
 * @returns State and methods for session participation
 * 
 * @example
 * ```typescript
 * function StudentView() {
 *   const { user } = useAuth();
 *   const {
 *     session,
 *     messages,
 *     myQueuedMessages,
 *     isConnected,
 *     joinSession,
 *     submitMessage,
 *     leaveSession,
 *   } = useStudentAISession({ studentId: user.student_id });
 * 
 *   const [code, setCode] = useState('');
 *   const [name, setName] = useState('');
 * 
 *   if (!session) {
 *     return (
 *       <JoinForm
 *         code={code}
 *         name={name}
 *         onCodeChange={setCode}
 *         onNameChange={setName}
 *         onJoin={() => joinSession(code, name)}
 *       />
 *     );
 *   }
 * 
 *   return (
 *     <div>
 *       <ConversationView messages={messages} />
 *       <MessageInput onSubmit={submitMessage} />
 *       <MyMessages messages={myQueuedMessages} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useStudentAISession(options: UseStudentAISessionOptions): StudentSessionState {
  const {
    studentId,
    onMessagePromoted,
    autoReconnect = true,
  } = options;

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  /**
   * The current session (if joined).
   */
  const [session, setSession] = useState<AILiveSession | null>(null);

  /**
   * Participant record for this student.
   */
  const [participantId, setParticipantId] = useState<string | null>(null);

  /**
   * All messages in the conversation (read-only view).
   */
  const [messages, setMessages] = useState<ConversationMessage[]>([]);

  /**
   * This student's queued messages.
   */
  const [myQueuedMessages, setMyQueuedMessages] = useState<QueuedMessage[]>([]);

  /**
   * Whether currently connected to a session.
   */
  const [isConnected, setIsConnected] = useState(false);

  /**
   * Whether currently loading/joining.
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Error message if any.
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Ref for heartbeat interval.
   */
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Rate limiting: track message timestamps.
   */
  const messageTimestampsRef = useRef<number[]>([]);

  // ---------------------------------------------------------------------------
  // AUTO-RECONNECT
  // ---------------------------------------------------------------------------

  /**
   * Attempts to reconnect to a previously joined session.
   */
  useEffect(() => {
    const attemptReconnect = async () => {
      if (!studentId || !autoReconnect) return;

      try {
        // Check for stored session
        const storedCode = localStorage.getItem(STORAGE_KEYS.LAST_SESSION_CODE);
        const storedName = localStorage.getItem(STORAGE_KEYS.DISPLAY_NAME);

        if (storedCode && storedName) {
          // Verify session is still active
          const { data: sessionData } = await supabase
            .from('ai_live_sessions')
            .select('*')
            .eq('session_code', storedCode)
            .in('status', ['waiting', 'active', 'paused'])
            .single();

          if (sessionData) {
            // Try to rejoin
            await joinSession(storedCode, storedName, true);
          } else {
            // Session ended - clear storage
            localStorage.removeItem(STORAGE_KEYS.LAST_SESSION_CODE);
          }
        }
      } catch {
        // Reconnect failed silently
      }
    };

    attemptReconnect();
  }, [studentId, autoReconnect]);

  // ---------------------------------------------------------------------------
  // HEARTBEAT MECHANISM
  // ---------------------------------------------------------------------------

  /**
   * Starts the heartbeat to maintain online status.
   */
  const startHeartbeat = useCallback(() => {
    // Clear any existing heartbeat
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
    }

    heartbeatRef.current = setInterval(async () => {
      if (!participantId) return;

      try {
        await supabase
          .from('ai_session_participants')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', participantId);
      } catch {
        // Heartbeat failed - might have been disconnected
      }
    }, SESSION_CONFIG.HEARTBEAT_INTERVAL);
  }, [participantId]);

  /**
   * Stops the heartbeat.
   */
  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // Start heartbeat when participant ID is set
  useEffect(() => {
    if (participantId) {
      startHeartbeat();
    }
    return () => stopHeartbeat();
  }, [participantId, startHeartbeat, stopHeartbeat]);

  // ---------------------------------------------------------------------------
  // JOIN SESSION
  // ---------------------------------------------------------------------------

  /**
   * Joins a session by code.
   * 
   * @param code - The 6-character session code
   * @param displayName - Name to display in the session
   * @param silent - If true, don't show toast messages (for auto-reconnect)
   * @returns True if joined successfully
   */
  const joinSession = useCallback(async (
    code: string,
    displayName: string,
    silent: boolean = false
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Normalize and validate code
      const normalizedCode = normalizeSessionCode(code);
      
      if (!isValidSessionCode(normalizedCode)) {
        setError('Invalid session code format');
        if (!silent) toast.error('Invalid session code');
        return false;
      }

      // Find the session
      const { data: sessionData, error: sessionError } = await supabase
        .from('ai_live_sessions')
        .select('*')
        .eq('session_code', normalizedCode)
        .single();

      if (sessionError || !sessionData) {
        setError(ERROR_MESSAGES.SESSION_NOT_FOUND);
        if (!silent) toast.error(ERROR_MESSAGES.SESSION_NOT_FOUND);
        return false;
      }

      // Check if session is still active
      if (sessionData.status === 'ended') {
        setError(ERROR_MESSAGES.SESSION_ENDED);
        if (!silent) toast.error(ERROR_MESSAGES.SESSION_ENDED);
        return false;
      }

      // Check if already a participant (for reconnection)
      const { data: existingParticipant } = await supabase
        .from('ai_session_participants')
        .select('*')
        .eq('session_id', sessionData.id)
        .eq('student_id', studentId)
        .single();

      let participantRecord;

      if (existingParticipant) {
        // Update existing participant record
        const { data: updated, error: updateError } = await supabase
          .from('ai_session_participants')
          .update({
            is_online: true,
            last_seen_at: new Date().toISOString(),
            display_name: displayName,
          })
          .eq('id', existingParticipant.id)
          .select()
          .single();

        if (updateError) throw updateError;
        participantRecord = updated;
      } else {
        // Create new participant record
        const { data: newParticipant, error: createError } = await supabase
          .from('ai_session_participants')
          .insert({
            session_id: sessionData.id,
            student_id: studentId,
            display_name: displayName,
            is_online: true,
            joined_at: new Date().toISOString(),
            last_seen_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) throw createError;
        participantRecord = newParticipant;
      }

      // Store for auto-reconnect
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_SESSION_CODE, normalizedCode);
        localStorage.setItem(STORAGE_KEYS.DISPLAY_NAME, displayName);
      } catch {
        // localStorage unavailable
      }

      // Update state
      setSession(sessionData as AILiveSession);
      setParticipantId(participantRecord.id);
      setIsConnected(true);

      // Load conversation messages
      await loadMessages(sessionData.id);

      // Load my queued messages
      await loadMyQueuedMessages(sessionData.id);

      if (!silent) toast.success('Joined session!');
      return true;

    } catch (err) {
      console.error('[useStudentAISession] Error joining session:', err);
      setError('Failed to join session');
      if (!silent) toast.error('Failed to join session');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  // ---------------------------------------------------------------------------
  // LOAD MESSAGES
  // ---------------------------------------------------------------------------

  /**
   * Loads conversation messages for a session.
   */
  const loadMessages = async (sessionId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('ai_conversation_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[useStudentAISession] Error loading messages:', error);
        return;
      }

      setMessages((data || []).map(m => ({
        ...m,
        author: m.author as MessageAuthor,
      })));
    } catch (err) {
      console.error('[useStudentAISession] Unexpected error:', err);
    }
  };

  /**
   * Loads this student's queued messages.
   */
  const loadMyQueuedMessages = async (sessionId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('ai_message_queue')
        .select('*')
        .eq('session_id', sessionId)
        .eq('student_id', studentId)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('[useStudentAISession] Error loading my messages:', error);
        return;
      }

      setMyQueuedMessages((data || []) as QueuedMessage[]);
    } catch (err) {
      console.error('[useStudentAISession] Unexpected error:', err);
    }
  };

  // ---------------------------------------------------------------------------
  // REAL-TIME SUBSCRIPTIONS
  // ---------------------------------------------------------------------------

  /**
   * Subscribes to conversation and queue updates.
   */
  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`student-session-${session.id}`)
      // New conversation messages
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_conversation_messages',
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          const newMessage = payload.new as ConversationMessage;
          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      // Session status changes
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ai_live_sessions',
          filter: `id=eq.${session.id}`,
        },
        (payload) => {
          const updatedSession = payload.new as AILiveSession;
          setSession(updatedSession);

          if (updatedSession.status === 'ended') {
            setIsConnected(false);
            toast.info('Session has ended');
            localStorage.removeItem(STORAGE_KEYS.LAST_SESSION_CODE);
          }
        }
      )
      // My queued message updates
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ai_message_queue',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          const updatedMessage = payload.new as QueuedMessage;
          
          // Only process if it's for this session
          if (updatedMessage.session_id !== session.id) return;

          setMyQueuedMessages(prev => prev.map(m =>
            m.id === updatedMessage.id ? updatedMessage : m
          ));

          // Notify if promoted
          if (updatedMessage.status === 'promoted' && onMessagePromoted) {
            onMessagePromoted(updatedMessage);
            toast.success('Your message was promoted to the discussion!');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id, studentId, onMessagePromoted]);

  // ---------------------------------------------------------------------------
  // SUBMIT MESSAGE
  // ---------------------------------------------------------------------------

  /**
   * Submits a message to the moderation queue.
   * 
   * @param content - The message content
   * @returns True if submitted successfully
   */
  const submitMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!session?.id || !participantId) {
      toast.error('Not connected to session');
      return false;
    }

    // Validate content length
    if (content.length < QUEUE_CONFIG.MIN_MESSAGE_LENGTH) {
      toast.error(ERROR_MESSAGES.MESSAGE_TOO_SHORT);
      return false;
    }

    if (content.length > QUEUE_CONFIG.MAX_MESSAGE_LENGTH) {
      toast.error(ERROR_MESSAGES.MESSAGE_TOO_LONG);
      return false;
    }

    // Rate limiting check
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    messageTimestampsRef.current = messageTimestampsRef.current.filter(t => t > oneMinuteAgo);

    if (messageTimestampsRef.current.length >= QUEUE_CONFIG.RATE_LIMIT_PER_MINUTE) {
      toast.error(ERROR_MESSAGES.RATE_LIMITED);
      return false;
    }

    try {
      // Get display name from storage
      const displayName = localStorage.getItem(STORAGE_KEYS.DISPLAY_NAME) || 'Student';

      // Insert into queue
      const { data, error } = await supabase
        .from('ai_message_queue')
        .insert({
          session_id: session.id,
          student_id: studentId,
          student_name: displayName,
          content: content.trim(),
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('[useStudentAISession] Error submitting message:', error);
        toast.error('Failed to submit message');
        return false;
      }

      // Add to local state
      setMyQueuedMessages(prev => [data as QueuedMessage, ...prev]);

      // Record timestamp for rate limiting
      messageTimestampsRef.current.push(now);

      toast.success('Message submitted for review');
      return true;

    } catch (err) {
      console.error('[useStudentAISession] Unexpected error:', err);
      toast.error('Failed to submit message');
      return false;
    }
  }, [session?.id, participantId, studentId]);

  // ---------------------------------------------------------------------------
  // LEAVE SESSION
  // ---------------------------------------------------------------------------

  /**
   * Leaves the current session.
   */
  const leaveSession = useCallback(async (): Promise<void> => {
    if (!participantId) return;

    try {
      // Update participant status
      await supabase
        .from('ai_session_participants')
        .update({ is_online: false })
        .eq('id', participantId);

      // Clear storage
      localStorage.removeItem(STORAGE_KEYS.LAST_SESSION_CODE);

      // Clear state
      setSession(null);
      setParticipantId(null);
      setMessages([]);
      setMyQueuedMessages([]);
      setIsConnected(false);

      toast.info('Left session');
    } catch (err) {
      console.error('[useStudentAISession] Error leaving session:', err);
    }
  }, [participantId]);

  // ---------------------------------------------------------------------------
  // CLEANUP ON UNMOUNT
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      stopHeartbeat();
      // Mark as offline on unmount
      if (participantId) {
        supabase
          .from('ai_session_participants')
          .update({ is_online: false })
          .eq('id', participantId)
          .then(() => {});
      }
    };
  }, [participantId, stopHeartbeat]);

  // ---------------------------------------------------------------------------
  // RETURN STATE AND METHODS
  // ---------------------------------------------------------------------------

  return {
    session,
    messages,
    myQueuedMessages,
    isConnected,
    isLoading,
    error,
    joinSession,
    submitMessage,
    leaveSession,
  };
}
