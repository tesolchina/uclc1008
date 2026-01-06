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
  // Parse lessonId - can be "weekId-lessonNumber" format (e.g., "1-1") or UUID
  const isWeekLessonFormat = /^\d+-\d+$/.test(lessonId);
  
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      let query = supabase.from('lessons').select('*');
      
      if (isWeekLessonFormat) {
        const [weekId, lessonNumber] = lessonId.split('-').map(Number);
        query = query.eq('week_id', weekId).eq('lesson_number', lessonNumber);
      } else {
        query = query.eq('id', lessonId);
      }
      
      const { data, error } = await query.single();

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