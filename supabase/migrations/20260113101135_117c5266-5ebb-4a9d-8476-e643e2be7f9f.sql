-- Add lecture position tracking to live_sessions
ALTER TABLE public.live_sessions 
ADD COLUMN IF NOT EXISTS current_agenda_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS section_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completed_sections JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS session_type TEXT DEFAULT 'lecture';

-- Create table for tracking student section progress (for review)
CREATE TABLE IF NOT EXISTS public.lecture_section_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  week_number INTEGER NOT NULL,
  hour_number INTEGER NOT NULL,
  section_id TEXT NOT NULL,
  section_index INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  key_takeaway_viewed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, week_number, hour_number, section_id)
);

-- Enable RLS
ALTER TABLE public.lecture_section_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for lecture_section_progress
CREATE POLICY "Users can view their own section progress"
ON public.lecture_section_progress
FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Users can insert their own section progress"
ON public.lecture_section_progress
FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update their own section progress"
ON public.lecture_section_progress
FOR UPDATE
USING (auth.uid() = student_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lecture_section_progress_student 
ON public.lecture_section_progress(student_id, week_number, hour_number);

-- Enable realtime for lecture_section_progress
ALTER PUBLICATION supabase_realtime ADD TABLE public.lecture_section_progress;