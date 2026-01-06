import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Lesson {
  id: string;
  week_id: number;
  lesson_number: number;
  title: string;
  description: string | null;
  objectives: string[];
  key_concepts: string[];
  created_at: string;
  updated_at: string;
}

export function useLessons(weekId: number) {
  return useQuery({
    queryKey: ['lessons', weekId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('week_id', weekId)
        .order('lesson_number', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(lesson => ({
        ...lesson,
        objectives: Array.isArray(lesson.objectives) ? lesson.objectives : [],
        key_concepts: Array.isArray(lesson.key_concepts) ? lesson.key_concepts : [],
      })) as Lesson[];
    },
    enabled: weekId > 0,
  });
}

export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        objectives: Array.isArray(data.objectives) ? data.objectives : [],
        key_concepts: Array.isArray(data.key_concepts) ? data.key_concepts : [],
      } as Lesson;
    },
    enabled: !!lessonId,
  });
}