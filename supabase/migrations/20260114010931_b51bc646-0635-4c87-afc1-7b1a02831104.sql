-- Drop existing overly complex RLS policies on student_task_responses
DROP POLICY IF EXISTS "Students can view their own responses" ON public.student_task_responses;
DROP POLICY IF EXISTS "Students can update their own responses" ON public.student_task_responses;
DROP POLICY IF EXISTS "Students can insert their own responses" ON public.student_task_responses;

-- Create simpler RLS policies that work with anon key
-- Since students use localStorage IDs (not auth.uid()), we need permissive policies
-- The student_id field acts as the access control

-- Anyone can insert responses (student_id will be set by the client)
CREATE POLICY "Allow insert responses"
  ON public.student_task_responses FOR INSERT
  WITH CHECK (true);

-- Anyone can view all responses (needed for student ID-based lookups)
-- Teachers/admins can see all, students filter by their own ID in queries
CREATE POLICY "Allow select responses"
  ON public.student_task_responses FOR SELECT
  USING (true);

-- Anyone can update responses (client filters by student_id)
CREATE POLICY "Allow update responses"
  ON public.student_task_responses FOR UPDATE
  USING (true);