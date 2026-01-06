import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LessonProgress {
  id: string;
  profile_id: string;
  lesson_id: string;
  section_completed: Record<string, boolean>;
  notes: string | null;
  mc_answers: Record<string, number>;
  fill_blank_answers: Record<string, string[]>;
  open_ended_responses: { questionId: string; response: string; feedback?: string }[];
  ai_feedback: any[];
  reflection: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useLessonProgress(lessonId: string) {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['lesson-progress', lessonId, profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('profile_id', profile.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;
      
      return {
        ...data,
        section_completed: data.section_completed as Record<string, boolean> || {},
        mc_answers: data.mc_answers as Record<string, number> || {},
        fill_blank_answers: data.fill_blank_answers as Record<string, string[]> || {},
        open_ended_responses: (data.open_ended_responses as any[]) || [],
        ai_feedback: (data.ai_feedback as any[]) || [],
      } as LessonProgress;
    },
    enabled: !!lessonId && !!profile?.id,
  });
}

export function useSaveLessonProgress(lessonId: string) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progress: {
      mcAnswers: Record<string, number>;
      fillBlankAnswers: Record<string, string[]>;
      openEndedResponses: { questionId: string; response: string; feedback?: string }[];
      reflection: string;
    }) => {
      if (!profile?.id) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('lesson_progress')
        .upsert({
          profile_id: profile.id,
          lesson_id: lessonId,
          mc_answers: progress.mcAnswers,
          fill_blank_answers: progress.fillBlankAnswers,
          open_ended_responses: progress.openEndedResponses,
          reflection: progress.reflection,
        }, {
          onConflict: 'profile_id,lesson_id',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress', lessonId] });
    },
  });
}