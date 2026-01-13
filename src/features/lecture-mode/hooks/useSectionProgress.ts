/**
 * useSectionProgress Hook
 * 
 * Manages persistent student progress through lecture sections.
 * Tracks visited sections, notes, and completion status.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { SectionProgress, SectionProgressState, SectionProgressActions } from '../types';

interface UseSectionProgressOptions {
  weekNumber: number;
  hourNumber: number;
}

export function useSectionProgress({
  weekNumber,
  hourNumber,
}: UseSectionProgressOptions): SectionProgressState & SectionProgressActions {
  const { user } = useAuth();
  const [progress, setProgress] = useState<SectionProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing progress
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('lecture_section_progress')
        .select('*')
        .eq('student_id', user.id)
        .eq('week_number', weekNumber)
        .eq('hour_number', hourNumber);

      if (error) {
        console.error('Error fetching section progress:', error);
        setIsLoading(false);
        return;
      }

      setProgress(
        (data || []).map(row => ({
          id: row.id,
          studentId: row.student_id,
          weekNumber: row.week_number,
          hourNumber: row.hour_number,
          sectionId: row.section_id,
          sectionIndex: row.section_index,
          notes: row.notes,
          keyTakeawayViewed: row.key_takeaway_viewed,
          completedAt: row.completed_at,
          visitedAt: row.visited_at,
        }))
      );
      setIsLoading(false);
    };

    fetchProgress();
  }, [user?.id, weekNumber, hourNumber]);

  // Mark section as visited
  const markSectionVisited = useCallback(async (sectionId: string, sectionIndex: number) => {
    if (!user?.id) return;

    const existing = progress.find(p => p.sectionId === sectionId);
    if (existing) {
      // Update visited_at
      await supabase
        .from('lecture_section_progress')
        .update({ visited_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('lecture_section_progress')
        .insert({
          student_id: user.id,
          week_number: weekNumber,
          hour_number: hourNumber,
          section_id: sectionId,
          section_index: sectionIndex,
        })
        .select()
        .single();

      if (!error && data) {
        setProgress(prev => [...prev, {
          id: data.id,
          studentId: data.student_id,
          weekNumber: data.week_number,
          hourNumber: data.hour_number,
          sectionId: data.section_id,
          sectionIndex: data.section_index,
          notes: data.notes,
          keyTakeawayViewed: data.key_takeaway_viewed,
          completedAt: data.completed_at,
          visitedAt: data.visited_at,
        }]);
      }
    }
  }, [user?.id, weekNumber, hourNumber, progress]);

  // Mark key takeaway as viewed
  const markKeyTakeawayViewed = useCallback(async (sectionId: string) => {
    if (!user?.id) return;

    const existing = progress.find(p => p.sectionId === sectionId);
    if (!existing) return;

    await supabase
      .from('lecture_section_progress')
      .update({ key_takeaway_viewed: true })
      .eq('id', existing.id);

    setProgress(prev => prev.map(p => 
      p.sectionId === sectionId ? { ...p, keyTakeawayViewed: true } : p
    ));
  }, [user?.id, progress]);

  // Update notes for a section
  const updateNotes = useCallback(async (sectionId: string, notes: string) => {
    if (!user?.id) return;

    const existing = progress.find(p => p.sectionId === sectionId);
    if (!existing) return;

    await supabase
      .from('lecture_section_progress')
      .update({ notes })
      .eq('id', existing.id);

    setProgress(prev => prev.map(p => 
      p.sectionId === sectionId ? { ...p, notes } : p
    ));
  }, [user?.id, progress]);

  // Mark section as complete
  const markSectionComplete = useCallback(async (sectionId: string) => {
    if (!user?.id) return;

    const existing = progress.find(p => p.sectionId === sectionId);
    if (!existing) return;

    const completedAt = new Date().toISOString();
    
    await supabase
      .from('lecture_section_progress')
      .update({ completed_at: completedAt })
      .eq('id', existing.id);

    setProgress(prev => prev.map(p => 
      p.sectionId === sectionId ? { ...p, completedAt } : p
    ));
  }, [user?.id, progress]);

  return {
    progress,
    isLoading,
    markSectionVisited,
    markKeyTakeawayViewed,
    updateNotes,
    markSectionComplete,
  };
}
