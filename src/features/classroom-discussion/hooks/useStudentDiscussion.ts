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

      // Get AI feedback using streaming response
      const task = tasks.find(t => t.id === taskId);
      
      // Use fetch directly to handle streaming response
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      let aiFeedback: string | null = null;
      
      try {
        const chatResponse = await fetch(`${supabaseUrl}/functions/v1/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          },
          body: JSON.stringify({
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
          }),
        });

        if (chatResponse.ok && chatResponse.body) {
          // Read the streaming response
          const reader = chatResponse.body.getReader();
          const decoder = new TextDecoder();
          let fullContent = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                try {
                  const jsonStr = line.slice(6).trim();
                  if (jsonStr) {
                    const parsed = JSON.parse(jsonStr);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      fullContent += content;
                    }
                  }
                } catch {
                  // Ignore parse errors for partial JSON
                }
              }
            }
          }

          aiFeedback = fullContent || null;
        }
      } catch (chatErr) {
        console.error('Error getting AI feedback:', chatErr);
      }

      // Save to database - check if exists first, then insert or update
      const { data: existingRecord } = await supabase
        .from('student_task_responses')
        .select('id')
        .eq('student_id', studentId)
        .eq('question_key', questionKey)
        .maybeSingle();

      let saveError;
      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('student_task_responses')
          .update({
            response,
            ai_feedback: aiFeedback,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingRecord.id);
        saveError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('student_task_responses')
          .insert({
            student_id: studentId,
            question_key: questionKey,
            response,
            ai_feedback: aiFeedback,
            submitted_at: new Date().toISOString(),
          });
        saveError = error;
      }

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
