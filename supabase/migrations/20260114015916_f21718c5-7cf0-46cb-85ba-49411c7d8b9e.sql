-- Teacher's private notes on students (only visible to teachers)
CREATE TABLE public.teacher_student_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, student_id)
);

ALTER TABLE public.teacher_student_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage their own student notes"
  ON public.teacher_student_notes FOR ALL
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Teacher comments on specific student work (visible to students)
CREATE TABLE public.task_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  task_key TEXT NOT NULL,
  response_id UUID,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.task_feedback ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their feedback
CREATE POLICY "Teachers can manage task feedback"
  ON public.task_feedback FOR ALL
  USING (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));

-- Students can view feedback on their own work
CREATE POLICY "Students can view their own task feedback"
  ON public.task_feedback FOR SELECT
  USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_teacher_student_notes_updated_at
  BEFORE UPDATE ON public.teacher_student_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_feedback_updated_at
  BEFORE UPDATE ON public.task_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();