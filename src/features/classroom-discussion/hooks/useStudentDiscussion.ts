/**
 * Hook for student self-study and live session participation
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Hour3Task, StudentTaskProgress, DiscussionThread } from '../types';
import { getHour3Tasks } from '../constants';

interface UseStudentDiscussionOptions {
  weekNumber: number;
  studentId: string;
}

export function useStudentDiscussion({ weekNumber, studentId }: UseStudentDiscussionOptions) {
  const [tasks] = useState<Hour3Task[]>(() => getHour3Tasks(weekNumber));
  const [taskProgress, setTaskProgress] = useState<Record<string, StudentTaskProgress>>({});
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [spotlightThreads, setSpotlightThreads] = useState<DiscussionThread[]>([]);

  // Load existing progress from database
  const loadProgress = useCallback(async () => {
    if (!studentId) return;

    try {
      const { data, error } = await supabase
        .from('student_task_responses')
        .select('*')
        .eq('student_id', studentId)
        .like('question_key', `week-${weekNumber}-hour3-%`);

      if (error) throw error;

      const progress: Record<string, StudentTaskProgress> = {};
      for (const response of data || []) {
        const taskId = response.question_key?.replace(`week-${weekNumber}-hour3-`, '') || '';
        progress[taskId] = {
          taskId,
          status: 'completed',
          response: response.response,
          aiFeedback: response.ai_feedback || undefined,
          submittedAt: response.submitted_at,
        };
      }
      setTaskProgress(progress);
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setIsLoading(false);
    }
  }, [weekNumber, studentId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Save response and get AI feedback
  const submitResponse = useCallback(async (taskId: string, response: string): Promise<string | null> => {
    if (!studentId) {
      toast.error('Please log in to submit responses');
      return null;
    }

    const questionKey = `week-${weekNumber}-hour3-${taskId}`;

    try {
      // Update progress to in-progress
      setTaskProgress(prev => ({
        ...prev,
        [taskId]: {
          taskId,
          status: 'in-progress',
          response,
        }
      }));

      // Get AI feedback
      const task = tasks.find(t => t.id === taskId);
      const { data: feedbackData, error: feedbackError } = await supabase.functions.invoke('chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: `You are an academic writing tutor providing feedback on student responses. Focus on:
1. Whether the student met the task requirements
2. Specific strengths in their response
3. One or two areas for improvement
4. Encourage the student

Task: ${task?.title}
Prompt: ${task?.prompt}
Rubric points to evaluate: ${task?.rubricPoints?.join(', ') || 'Clear, accurate, well-structured'}

Keep feedback concise (100-150 words), constructive, and encouraging.`
            },
            {
              role: 'user',
              content: `Student's response:\n\n${response}`
            }
          ],
          studentId,
        }
      });

      const aiFeedback = feedbackError ? null : (feedbackData?.content || feedbackData?.message || null);

      // Save to database
      const { error: saveError } = await supabase
        .from('student_task_responses')
        .upsert({
          student_id: studentId,
          question_key: questionKey,
          response,
          ai_feedback: aiFeedback,
          submitted_at: new Date().toISOString(),
        }, {
          onConflict: 'student_id,question_key',
        });

      if (saveError) throw saveError;

      // Update local state
      setTaskProgress(prev => ({
        ...prev,
        [taskId]: {
          taskId,
          status: 'completed',
          response,
          aiFeedback: aiFeedback || undefined,
          submittedAt: new Date().toISOString(),
        }
      }));

      toast.success('Response submitted!');
      return aiFeedback;
    } catch (err) {
      console.error('Error submitting response:', err);
      toast.error('Failed to submit response');
      return null;
    }
  }, [weekNumber, studentId, tasks]);

  // Save draft without AI feedback
  const saveDraft = useCallback(async (taskId: string, response: string) => {
    setTaskProgress(prev => ({
      ...prev,
      [taskId]: {
        taskId,
        status: 'in-progress',
        response,
      }
    }));
  }, []);

  // Get progress for a specific task
  const getTaskProgress = useCallback((taskId: string): StudentTaskProgress => {
    return taskProgress[taskId] || {
      taskId,
      status: 'not-started',
    };
  }, [taskProgress]);

  // Calculate overall progress
  const overallProgress = {
    total: tasks.length,
    completed: Object.values(taskProgress).filter(p => p.status === 'completed').length,
    inProgress: Object.values(taskProgress).filter(p => p.status === 'in-progress').length,
  };

  return {
    tasks,
    taskProgress,
    selectedTaskId,
    setSelectedTaskId,
    isLoading,
    submitResponse,
    saveDraft,
    getTaskProgress,
    overallProgress,
    spotlightThreads,
  };
}
