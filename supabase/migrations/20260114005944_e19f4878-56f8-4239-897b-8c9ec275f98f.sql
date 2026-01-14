-- Add a question_key column for text-based question identification (for MC questions without UUID task_ids)
ALTER TABLE public.student_task_responses 
ADD COLUMN IF NOT EXISTS question_key TEXT;

-- Create a unique constraint for student_id + question_key combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_student_task_responses_unique_question 
ON public.student_task_responses (student_id, question_key) 
WHERE question_key IS NOT NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_student_task_responses_question_key 
ON public.student_task_responses (question_key) 
WHERE question_key IS NOT NULL;