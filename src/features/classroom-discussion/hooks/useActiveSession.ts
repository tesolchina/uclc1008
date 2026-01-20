/**
 * Hook to check for active Hour 3 discussion sessions for a given week
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ActiveSessionInfo } from '../types';
import { getTaskById } from '../constants';

export function useActiveSession(weekNumber: number) {
  const [activeSession, setActiveSession] = useState<ActiveSessionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  const fetchActiveSession = useCallback(async () => {
    try {
      // Find active live sessions for Hour 3 of this week
      const { data: sessions, error } = await supabase
        .from('live_sessions')
        .select(`
          id,
          session_code,
          teacher_id,
          status,
          profiles!live_sessions_teacher_id_fkey(display_name)
        `)
        .eq('status', 'active')
        .eq('lesson_id', `week-${weekNumber}-hour-3`);

      if (error) {
        console.error('Error fetching active sessions:', error);
        return;
      }

      if (!sessions || sessions.length === 0) {
        setActiveSession(null);
        return;
      }

      const session = sessions[0];

      // Get discussion session details
      const { data: discussionSession } = await supabase
        .from('discussion_sessions')
        .select('current_task_id')
        .eq('session_id', session.id)
        .single();

      // Get participant count
      const { count } = await supabase
        .from('session_participants')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', session.id)
        .eq('is_online', true);

      const currentTaskId = discussionSession?.current_task_id || null;
      const currentTask = currentTaskId ? getTaskById(currentTaskId) : null;

      setActiveSession({
        sessionCode: session.session_code,
        teacherName: (session.profiles as any)?.display_name || 'Teacher',
        currentTaskId,
        currentTaskTitle: currentTask?.title || null,
        participantCount: count || 0,
        weekNumber,
      });
    } catch (err) {
      console.error('Error in fetchActiveSession:', err);
    } finally {
      setIsLoading(false);
    }
  }, [weekNumber]);

  useEffect(() => {
    fetchActiveSession();

    // Subscribe to live_sessions changes
    const channel = supabase
      .channel(`active-sessions-week-${weekNumber}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_sessions',
        },
        () => {
          fetchActiveSession();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'discussion_sessions',
        },
        () => {
          fetchActiveSession();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [weekNumber, fetchActiveSession]);

  const dismissSession = useCallback(() => {
    setIsDismissed(true);
  }, []);

  const showSession = useCallback(() => {
    setIsDismissed(false);
  }, []);

  return {
    activeSession,
    isLoading,
    isDismissed,
    dismissSession,
    showSession,
    refetch: fetchActiveSession,
  };
}
