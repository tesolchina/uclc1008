/**
 * Student Session Hook
 * 
 * React hook for students to join and participate in live sessions.
 * Handles real-time sync, response submission, and session state.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { saveSessionState, loadSessionState, clearSessionState } from '../utils/persistence';
import { DEFAULT_CONFIG } from '../constants';
import type {
  LiveSession,
  SessionParticipant,
  SessionResponse,
  SessionPrompt,
  StudentSessionState,
  StudentSessionActions,
} from '../types';

export function useStudentSession(studentIdentifier: string): StudentSessionState & StudentSessionActions {
  const [session, setSession] = useState<LiveSession | null>(null);
  const [participant, setParticipant] = useState<SessionParticipant | null>(null);
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const [prompts, setPrompts] = useState<SessionPrompt[]>([]);
  const [latestPrompt, setLatestPrompt] = useState<SessionPrompt | null>(null);
  const [responses, setResponses] = useState<SessionResponse[]>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { toast } = useToast();

  // Auto-reconnect to existing session on mount
  useEffect(() => {
    const reconnectSession = async () => {
      const savedState = loadSessionState();
      if (savedState && savedState.role === 'student' && savedState.studentIdentifier === studentIdentifier) {
        setIsReconnecting(true);
        console.log('[StudentSession] Attempting to reconnect to session:', savedState.sessionCode);
        
        try {
          // Check if session is still active
          const { data: sessionData, error: sessionError } = await supabase
            .from('live_sessions')
            .select('*')
            .eq('id', savedState.sessionId)
            .neq('status', 'ended')
            .single();

          if (!sessionData || sessionError) {
            console.log('[StudentSession] Session no longer active, clearing saved state');
            clearSessionState();
            setIsReconnecting(false);
            return;
          }

          // Reconnect as participant
          const { data: participantData, error: participantError } = await supabase
            .from('session_participants')
            .upsert({
              session_id: sessionData.id,
              student_identifier: studentIdentifier,
              display_name: savedState.displayName || null,
              is_online: true,
              last_seen_at: new Date().toISOString(),
            }, { onConflict: 'session_id,student_identifier' })
            .select()
            .single();

          if (participantError) throw participantError;

          // Fetch existing responses
          const { data: existingResponses } = await supabase
            .from('session_responses')
            .select('*')
            .eq('session_id', sessionData.id)
            .eq('participant_id', participantData.id);

          if (existingResponses) {
            setResponses(existingResponses as SessionResponse[]);
          }

          // Fetch other participants
          const { data: participantsData } = await supabase
            .from('session_participants')
            .select('*')
            .eq('session_id', sessionData.id);
          
          if (participantsData) {
            setParticipants(participantsData as SessionParticipant[]);
          }
          
          setSession({
            ...sessionData,
            current_question_index: sessionData.current_question_index ?? 0,
            allow_ahead: sessionData.allow_ahead ?? true,
            settings: (sessionData.settings as Record<string, unknown>) || {},
          } as LiveSession);
          setParticipant(participantData as SessionParticipant);
          
          console.log('[StudentSession] Successfully reconnected to session:', sessionData.session_code);
          toast({ title: 'Session restored', description: `Reconnected to ${sessionData.session_code}` });
        } catch (error) {
          console.error('[StudentSession] Error reconnecting:', error);
          clearSessionState();
        } finally {
          setIsReconnecting(false);
        }
      }
    };

    reconnectSession();
  }, [studentIdentifier, toast]);

  // Join a session by code
  const joinSession = useCallback(async (sessionCode: string, displayName?: string): Promise<boolean> => {
    setIsJoining(true);
    try {
      // Find the session
      const { data: sessionData, error: sessionError } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('session_code', sessionCode.toUpperCase())
        .neq('status', 'ended')
        .single();

      if (sessionError || !sessionData) {
        toast({ title: 'Session not found', description: 'Check the code and try again', variant: 'destructive' });
        return false;
      }

      // Join as participant (upsert to handle rejoins)
      const { data: participantData, error: participantError } = await supabase
        .from('session_participants')
        .upsert({
          session_id: sessionData.id,
          student_identifier: studentIdentifier,
          display_name: displayName || null,
          is_online: true,
          last_seen_at: new Date().toISOString(),
        }, { onConflict: 'session_id,student_identifier' })
        .select()
        .single();

      if (participantError) throw participantError;

      // Fetch existing responses for this participant
      const { data: existingResponses } = await supabase
        .from('session_responses')
        .select('*')
        .eq('session_id', sessionData.id)
        .eq('participant_id', participantData.id);
      
      if (existingResponses) {
        setResponses(existingResponses as SessionResponse[]);
      }

      // Fetch other participants
      const { data: participantsData } = await supabase
        .from('session_participants')
        .select('*')
        .eq('session_id', sessionData.id);
      
      if (participantsData) {
        setParticipants(participantsData as SessionParticipant[]);
      }

      setSession({
        ...sessionData,
        current_question_index: sessionData.current_question_index ?? 0,
        allow_ahead: sessionData.allow_ahead ?? true,
        settings: (sessionData.settings as Record<string, unknown>) || {},
      } as LiveSession);
      setParticipant(participantData as SessionParticipant);
      
      // Save session state for persistence
      saveSessionState({
        sessionId: sessionData.id,
        sessionCode: sessionData.session_code,
        lessonId: sessionData.lesson_id,
        role: 'student',
        participantId: participantData.id,
        displayName: displayName,
        studentIdentifier: studentIdentifier,
        joinedAt: new Date().toISOString(),
      });
      
      toast({ title: 'Joined session!', description: sessionData.title || `Session ${sessionCode}` });
      return true;
    } catch (error) {
      console.error('Error joining session:', error);
      toast({ title: 'Error', description: 'Failed to join session', variant: 'destructive' });
      return false;
    } finally {
      setIsJoining(false);
    }
  }, [studentIdentifier, toast]);

  // Leave the session
  const leaveSession = useCallback(async () => {
    if (!participant) return;
    await supabase
      .from('session_participants')
      .update({ is_online: false })
      .eq('id', participant.id);
    
    clearSessionState();
    setSession(null);
    setParticipant(null);
    setParticipants([]);
    setPrompts([]);
    setLatestPrompt(null);
    setResponses([]);
  }, [participant]);

  // Submit a response
  const submitResponse = useCallback(async (
    questionType: string,
    questionIndex: number,
    response: Record<string, unknown>,
    isCorrect?: boolean
  ) => {
    if (!session || !participant) return;
    
    const { data, error } = await supabase
      .from('session_responses')
      .upsert({
        session_id: session.id,
        participant_id: participant.id,
        question_type: questionType,
        question_index: questionIndex,
        response,
        is_correct: isCorrect ?? null,
      } as any, { onConflict: 'session_id,participant_id,question_type,question_index' })
      .select()
      .single();
    
    if (error) {
      console.error('Error submitting response:', error);
    } else if (data) {
      setResponses(prev => {
        const existing = prev.findIndex(r => 
          r.question_type === questionType && r.question_index === questionIndex
        );
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = data as SessionResponse;
          return updated;
        }
        return [...prev, data as SessionResponse];
      });
    }
  }, [session, participant]);

  // Update current section (heartbeat)
  const updateSection = useCallback(async (section: string) => {
    if (!participant) return;
    await supabase
      .from('session_participants')
      .update({ 
        current_section: section, 
        last_seen_at: new Date().toISOString(),
        is_online: true 
      })
      .eq('id', participant.id);
  }, [participant]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!session) return;

    console.log('[StudentSession] Subscribing to session updates for:', session.id);

    const channel = supabase
      .channel(`student-session-${session.id}-${Date.now()}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'live_sessions',
        filter: `id=eq.${session.id}`,
      }, (payload) => {
        console.log('[StudentSession] Session update received:', payload.new);
        const newSession = payload.new;
        
        if (newSession.status === 'ended') {
          console.log('[StudentSession] Session ended, clearing persisted state');
          clearSessionState();
        }
        
        setSession(prev => prev ? {
          ...prev,
          status: newSession.status as LiveSession['status'],
          current_section: newSession.current_section,
          current_question_index: newSession.current_question_index ?? 0,
          allow_ahead: newSession.allow_ahead ?? true,
          settings: (newSession.settings as Record<string, unknown>) || {},
          ended_at: newSession.ended_at,
        } : null);
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'session_prompts',
        filter: `session_id=eq.${session.id}`,
      }, (payload) => {
        console.log('[StudentSession] New prompt received:', payload.new);
        const newPrompt = payload.new as SessionPrompt;
        setPrompts(prev => [...prev, newPrompt]);
        setLatestPrompt(newPrompt);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'session_participants',
        filter: `session_id=eq.${session.id}`,
      }, async () => {
        const { data: participantsData } = await supabase
          .from('session_participants')
          .select('*')
          .eq('session_id', session.id);
        if (participantsData) {
          setParticipants(participantsData as SessionParticipant[]);
        }
      })
      .subscribe((status) => {
        console.log('[StudentSession] Subscription status:', status);
      });

    // Heartbeat to keep online status
    const heartbeat = setInterval(async () => {
      if (participant) {
        await supabase
          .from('session_participants')
          .update({ last_seen_at: new Date().toISOString(), is_online: true })
          .eq('id', participant.id);
        
        // Re-fetch participants
        const { data: participantsData } = await supabase
          .from('session_participants')
          .select('*')
          .eq('session_id', session.id);
        if (participantsData) {
          setParticipants(participantsData as SessionParticipant[]);
        }
        
        // Re-fetch session for sync backup
        const { data: freshSession } = await supabase
          .from('live_sessions')
          .select('*')
          .eq('id', session.id)
          .single();
        
        if (freshSession) {
          if (freshSession.status === 'ended') {
            console.log('[StudentSession] Session ended (via heartbeat), clearing persisted state');
            clearSessionState();
          }
          
          setSession(prev => prev ? {
            ...prev,
            status: freshSession.status as LiveSession['status'],
            current_section: freshSession.current_section,
            current_question_index: freshSession.current_question_index ?? 0,
            allow_ahead: freshSession.allow_ahead ?? true,
            settings: (freshSession.settings as Record<string, unknown>) || {},
            ended_at: freshSession.ended_at,
          } : null);
        }
      }
    }, DEFAULT_CONFIG.heartbeatInterval);

    return () => {
      console.log('[StudentSession] Cleaning up subscription');
      supabase.removeChannel(channel);
      clearInterval(heartbeat);
    };
  }, [session?.id, participant?.id]);

  // Clear latest prompt after viewing
  const dismissPrompt = useCallback(() => {
    setLatestPrompt(null);
  }, []);

  return {
    session,
    participant,
    participants,
    prompts,
    latestPrompt,
    responses,
    isJoining,
    isReconnecting,
    joinSession,
    leaveSession,
    submitResponse,
    updateSection,
    dismissPrompt,
  };
}
