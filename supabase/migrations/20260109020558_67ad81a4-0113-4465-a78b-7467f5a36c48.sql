
-- Phase 1b: Create user management tables

-- 1. Create students table (pre-registered student records)
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL UNIQUE,
  student_number TEXT,
  display_name TEXT,
  email TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Students RLS policies
CREATE POLICY "Admins and teachers can view all students"
  ON public.students FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Admins can insert students"
  ON public.students FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update students"
  ON public.students FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete students"
  ON public.students FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can validate student_id exists"
  ON public.students FOR SELECT
  USING (true);

-- Add updated_at trigger for students
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Create student_sessions table (tracks student activity)
CREATE TABLE public.student_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT REFERENCES public.students(student_id) ON DELETE SET NULL,
  browser_session_id TEXT NOT NULL,
  lesson_id TEXT,
  module_name TEXT,
  activity_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_interactions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  report_code TEXT UNIQUE,
  ai_report JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on student_sessions
ALTER TABLE public.student_sessions ENABLE ROW LEVEL SECURITY;

-- Student sessions RLS policies
CREATE POLICY "Anyone can insert student sessions"
  ON public.student_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own sessions by browser_session_id"
  ON public.student_sessions FOR UPDATE
  USING (true);

CREATE POLICY "Admins and teachers can view all sessions"
  ON public.student_sessions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Anyone can view sessions by browser_session_id or report_code"
  ON public.student_sessions FOR SELECT
  USING (true);

-- 3. Create student_id_merges table (audit trail)
CREATE TABLE public.student_id_merges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  primary_student_id TEXT NOT NULL,
  merged_student_id TEXT NOT NULL,
  merged_by UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on student_id_merges
ALTER TABLE public.student_id_merges ENABLE ROW LEVEL SECURITY;

-- Student ID merges RLS policies (admin only)
CREATE POLICY "Admins can view all merges"
  ON public.student_id_merges FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert merges"
  ON public.student_id_merges FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete merges"
  ON public.student_id_merges FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Create teacher_comments table (feedback on sessions)
CREATE TABLE public.teacher_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.student_sessions(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on teacher_comments
ALTER TABLE public.teacher_comments ENABLE ROW LEVEL SECURITY;

-- Teacher comments RLS policies
CREATE POLICY "Anyone can view teacher comments"
  ON public.teacher_comments FOR SELECT
  USING (true);

CREATE POLICY "Teachers can insert comments"
  ON public.teacher_comments FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can update their own comments"
  ON public.teacher_comments FOR UPDATE
  USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their own comments"
  ON public.teacher_comments FOR DELETE
  USING (teacher_id = auth.uid());

-- Add updated_at trigger for teacher_comments
CREATE TRIGGER update_teacher_comments_updated_at
  BEFORE UPDATE ON public.teacher_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_students_student_id ON public.students(student_id);
CREATE INDEX idx_students_is_active ON public.students(is_active);
CREATE INDEX idx_student_sessions_student_id ON public.student_sessions(student_id);
CREATE INDEX idx_student_sessions_browser_session_id ON public.student_sessions(browser_session_id);
CREATE INDEX idx_student_sessions_report_code ON public.student_sessions(report_code);
CREATE INDEX idx_student_sessions_lesson_id ON public.student_sessions(lesson_id);
CREATE INDEX idx_teacher_comments_session_id ON public.teacher_comments(session_id);
