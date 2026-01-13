/**
 * useLecturePosition Hook
 * 
 * Manages real-time synchronization of lecture position between teacher and students.
 * Uses live_sessions table for position tracking.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { LecturePositionState, LecturePositionActions, AgendaSectionEnhanced } from '../types';
import { generateSectionId } from '../constants';

interface UseLecturePositionOptions {
  sessionId: string | null;
  sections: AgendaSectionEnhanced[];
  isTeacher: boolean;
}

export function useLecturePosition({
  sessionId,
  sections,
  isTeacher,
}: UseLecturePositionOptions): LecturePositionState & LecturePositionActions {
  const { toast } = useToast();
  const [state, setState] = useState<LecturePositionState>({
    currentSectionIndex: 0,
    currentSectionId: sections[0]?.id || null,
    completedSections: [],
    sectionStartedAt: null,
    isLoading: true,
  });

  // Fetch initial position from session
  useEffect(() => {
    if (!sessionId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchPosition = async () => {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('current_agenda_index, completed_sections, section_started_at')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching lecture position:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const index = data.current_agenda_index || 0;
      const completed = (data.completed_sections as string[]) || [];

      setState({
        currentSectionIndex: index,
        currentSectionId: sections[index]?.id || generateSectionId(index, sections[index]?.title || ''),
        completedSections: completed,
        sectionStartedAt: data.section_started_at,
        isLoading: false,
      });
    };

    fetchPosition();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`lecture-position-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'live_sessions',
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          const data = payload.new as {
            current_agenda_index?: number;
            completed_sections?: string[];
            section_started_at?: string;
          };
          
          const index = data.current_agenda_index || 0;
          const completed = data.completed_sections || [];

          setState(prev => ({
            ...prev,
            currentSectionIndex: index,
            currentSectionId: sections[index]?.id || generateSectionId(index, sections[index]?.title || ''),
            completedSections: completed,
            sectionStartedAt: data.section_started_at || null,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, sections]);

  // Teacher: Advance to next section
  const advanceSection = useCallback(async () => {
    if (!sessionId || !isTeacher) return;
    
    const nextIndex = Math.min(state.currentSectionIndex + 1, sections.length - 1);
    const currentId = sections[state.currentSectionIndex]?.id || 
      generateSectionId(state.currentSectionIndex, sections[state.currentSectionIndex]?.title || '');
    
    const newCompleted = state.completedSections.includes(currentId)
      ? state.completedSections
      : [...state.completedSections, currentId];

    const { error } = await supabase
      .from('live_sessions')
      .update({
        current_agenda_index: nextIndex,
        completed_sections: newCompleted,
        section_started_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to advance section', variant: 'destructive' });
    }
  }, [sessionId, isTeacher, state.currentSectionIndex, state.completedSections, sections, toast]);

  // Teacher: Go to specific section
  const goToSection = useCallback(async (index: number) => {
    if (!sessionId || !isTeacher) return;
    if (index < 0 || index >= sections.length) return;

    const { error } = await supabase
      .from('live_sessions')
      .update({
        current_agenda_index: index,
        section_started_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to navigate to section', variant: 'destructive' });
    }
  }, [sessionId, isTeacher, sections.length, toast]);

  // Teacher: Mark current section as complete
  const markSectionComplete = useCallback(async () => {
    if (!sessionId || !isTeacher) return;

    const currentId = sections[state.currentSectionIndex]?.id || 
      generateSectionId(state.currentSectionIndex, sections[state.currentSectionIndex]?.title || '');
    
    if (state.completedSections.includes(currentId)) return;

    const newCompleted = [...state.completedSections, currentId];

    const { error } = await supabase
      .from('live_sessions')
      .update({ completed_sections: newCompleted })
      .eq('id', sessionId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to mark section complete', variant: 'destructive' });
    }
  }, [sessionId, isTeacher, state.currentSectionIndex, state.completedSections, sections, toast]);

  // Teacher: Reset position to beginning
  const resetPosition = useCallback(async () => {
    if (!sessionId || !isTeacher) return;

    const { error } = await supabase
      .from('live_sessions')
      .update({
        current_agenda_index: 0,
        completed_sections: [],
        section_started_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to reset position', variant: 'destructive' });
    }
  }, [sessionId, isTeacher, toast]);

  return {
    ...state,
    advanceSection,
    goToSection,
    markSectionComplete,
    resetPosition,
  };
}
