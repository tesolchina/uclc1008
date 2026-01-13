-- Allow anyone to insert into students table for self-registration
-- The student_id uniqueness is enforced by the unique constraint
CREATE POLICY "Anyone can register as a student"
ON public.students
FOR INSERT
WITH CHECK (true);

-- Add unique constraint on student_id if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'students_student_id_key'
  ) THEN
    ALTER TABLE public.students ADD CONSTRAINT students_student_id_key UNIQUE (student_id);
  END IF;
END $$;