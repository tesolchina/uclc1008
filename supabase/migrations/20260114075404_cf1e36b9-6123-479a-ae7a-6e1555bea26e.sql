-- Create teacher_sections table for section assignments
CREATE TABLE public.teacher_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  section_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(teacher_id, section_number)
);

-- Enable RLS
ALTER TABLE public.teacher_sections ENABLE ROW LEVEL SECURITY;

-- Admins can manage all section assignments
CREATE POLICY "Admins can manage all teacher sections"
  ON public.teacher_sections
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Teachers can view their own section assignments
CREATE POLICY "Teachers can view own sections"
  ON public.teacher_sections
  FOR SELECT
  TO authenticated
  USING (teacher_id = auth.uid());

-- Add section_number to students table if not exists
ALTER TABLE public.students 
  ADD COLUMN IF NOT EXISTS section_number TEXT;

-- Create index for efficient section lookups
CREATE INDEX IF NOT EXISTS idx_students_section ON public.students(section_number);
CREATE INDEX IF NOT EXISTS idx_teacher_sections_teacher ON public.teacher_sections(teacher_id);

-- Update RLS policies on student-related tables for teacher access

-- Students table: Admins see all, teachers see their sections OR search by ID
DROP POLICY IF EXISTS "Admins and teachers can view students" ON public.students;
CREATE POLICY "Admins can view all students"
  ON public.students
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view students in their sections"
  ON public.students
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'teacher') AND (
      -- Teacher's assigned sections
      section_number IN (
        SELECT section_number FROM public.teacher_sections 
        WHERE teacher_id = auth.uid()
      )
      -- Or allow all if teacher has no sections assigned (for search functionality)
      OR NOT EXISTS (
        SELECT 1 FROM public.teacher_sections 
        WHERE teacher_id = auth.uid()
      )
    )
  );

-- Student task responses: same pattern
DROP POLICY IF EXISTS "Admins and teachers can view all responses" ON public.student_task_responses;
CREATE POLICY "Admins can view all task responses"
  ON public.student_task_responses
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view task responses"
  ON public.student_task_responses
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'teacher') AND (
      student_id IN (
        SELECT student_id FROM public.students 
        WHERE section_number IN (
          SELECT section_number FROM public.teacher_sections 
          WHERE teacher_id = auth.uid()
        )
      )
      OR NOT EXISTS (
        SELECT 1 FROM public.teacher_sections 
        WHERE teacher_id = auth.uid()
      )
    )
  );

-- Writing drafts: same pattern
DROP POLICY IF EXISTS "Admins and teachers can view all drafts" ON public.writing_drafts;
CREATE POLICY "Admins can view all writing drafts"
  ON public.writing_drafts
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view writing drafts"
  ON public.writing_drafts
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'teacher') AND (
      student_id IN (
        SELECT student_id FROM public.students 
        WHERE section_number IN (
          SELECT section_number FROM public.teacher_sections 
          WHERE teacher_id = auth.uid()
        )
      )
      OR NOT EXISTS (
        SELECT 1 FROM public.teacher_sections 
        WHERE teacher_id = auth.uid()
      )
    )
  );

-- Paragraph notes: same pattern
DROP POLICY IF EXISTS "Admins and teachers can view all paragraph notes" ON public.paragraph_notes;
CREATE POLICY "Admins can view all paragraph notes"
  ON public.paragraph_notes
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view paragraph notes"
  ON public.paragraph_notes
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'teacher') AND (
      student_id IN (
        SELECT student_id FROM public.students 
        WHERE section_number IN (
          SELECT section_number FROM public.teacher_sections 
          WHERE teacher_id = auth.uid()
        )
      )
      OR NOT EXISTS (
        SELECT 1 FROM public.teacher_sections 
        WHERE teacher_id = auth.uid()
      )
    )
  );

-- Student questions: same pattern
DROP POLICY IF EXISTS "Admins and teachers can view all questions" ON public.student_questions;
CREATE POLICY "Admins can view all student questions"
  ON public.student_questions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view student questions"
  ON public.student_questions
  FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'teacher') AND (
      student_id IN (
        SELECT student_id FROM public.students 
        WHERE section_number IN (
          SELECT section_number FROM public.teacher_sections 
          WHERE teacher_id = auth.uid()
        )
      )
      OR NOT EXISTS (
        SELECT 1 FROM public.teacher_sections 
        WHERE teacher_id = auth.uid()
      )
    )
  );