-- Add columns for context tracking to assignment_chat_history
ALTER TABLE assignment_chat_history 
  ADD COLUMN IF NOT EXISTS context_type TEXT DEFAULT 'assignment',
  ADD COLUMN IF NOT EXISTS week_number INTEGER,
  ADD COLUMN IF NOT EXISTS hour_number INTEGER,
  ADD COLUMN IF NOT EXISTS lesson_id TEXT;

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_chat_history_student_context 
  ON assignment_chat_history(student_id, context_type);

CREATE INDEX IF NOT EXISTS idx_chat_history_week_hour 
  ON assignment_chat_history(week_number, hour_number);

-- Add RLS policy for teachers to view all chat history
CREATE POLICY "Teachers can view all chat history"
  ON assignment_chat_history
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'teacher'::app_role) OR has_role(auth.uid(), 'admin'::app_role)
  );