-- Add token tracking columns to student_api_usage table
ALTER TABLE public.student_api_usage 
ADD COLUMN IF NOT EXISTS prompt_tokens integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS completion_tokens integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_tokens integer NOT NULL DEFAULT 0;

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_student_api_usage_student_date 
ON public.student_api_usage(student_id, usage_date DESC);