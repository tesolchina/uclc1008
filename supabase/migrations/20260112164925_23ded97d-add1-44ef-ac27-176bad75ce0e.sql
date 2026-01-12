-- Create table for hour-based learning tasks (MC, T/F, fill-blank, writing)
CREATE TABLE public.hour_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_number INTEGER NOT NULL,
  hour_number INTEGER NOT NULL,
  task_order INTEGER NOT NULL DEFAULT 0,
  task_type TEXT NOT NULL CHECK (task_type IN ('mc', 'true-false', 'fill-blank', 'short-answer', 'sentence', 'paragraph')),
  question TEXT NOT NULL,
  context TEXT,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  word_limit INTEGER,
  hints JSONB,
  skill_focus TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for student task responses
CREATE TABLE public.student_task_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  task_id UUID REFERENCES public.hour_tasks(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  is_correct BOOLEAN,
  score NUMERIC(5,2),
  ai_feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for student questions to teacher
CREATE TABLE public.student_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  hour_number INTEGER,
  question TEXT NOT NULL,
  context TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'dismissed')),
  teacher_response TEXT,
  responded_by UUID REFERENCES public.profiles(id),
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_hour_tasks_week_hour ON public.hour_tasks(week_number, hour_number);
CREATE INDEX idx_student_task_responses_student ON public.student_task_responses(student_id);
CREATE INDEX idx_student_task_responses_task ON public.student_task_responses(task_id);
CREATE INDEX idx_student_questions_student ON public.student_questions(student_id);
CREATE INDEX idx_student_questions_status ON public.student_questions(status);

-- Enable Row Level Security
ALTER TABLE public.hour_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_task_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_questions ENABLE ROW LEVEL SECURITY;

-- RLS policies for hour_tasks (public read, admin write)
CREATE POLICY "Hour tasks are viewable by everyone" 
ON public.hour_tasks FOR SELECT USING (true);

CREATE POLICY "Teachers and admins can manage hour tasks"
ON public.hour_tasks FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND p.role IN ('teacher', 'admin')
  )
);

-- RLS policies for student_task_responses
CREATE POLICY "Students can view their own responses"
ON public.student_task_responses FOR SELECT
USING (student_id = current_setting('request.headers', true)::json->>'x-student-id' OR
       EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')));

CREATE POLICY "Students can insert their own responses"
ON public.student_task_responses FOR INSERT
WITH CHECK (true);

CREATE POLICY "Students can update their own responses"
ON public.student_task_responses FOR UPDATE
USING (student_id = current_setting('request.headers', true)::json->>'x-student-id');

-- RLS policies for student_questions
CREATE POLICY "Students can view their own questions"
ON public.student_questions FOR SELECT
USING (student_id = current_setting('request.headers', true)::json->>'x-student-id' OR
       EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')));

CREATE POLICY "Students can create questions"
ON public.student_questions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Teachers can update question responses"
ON public.student_questions FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')));

-- Add trigger for updated_at
CREATE TRIGGER update_hour_tasks_updated_at
BEFORE UPDATE ON public.hour_tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_task_responses_updated_at
BEFORE UPDATE ON public.student_task_responses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for student questions (teachers need to see new questions)
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_questions;