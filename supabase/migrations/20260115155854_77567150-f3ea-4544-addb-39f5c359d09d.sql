-- Create table for assignment chat history
CREATE TABLE public.assignment_chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  assignment_key TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index for student + assignment combination
CREATE UNIQUE INDEX idx_assignment_chat_student_assignment 
  ON public.assignment_chat_history (student_id, assignment_key);

-- Create index for faster lookups
CREATE INDEX idx_assignment_chat_student_id 
  ON public.assignment_chat_history (student_id);

-- Enable RLS
ALTER TABLE public.assignment_chat_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read/write (uses student_id field, not auth)
CREATE POLICY "Anyone can read chat history by student_id" 
  ON public.assignment_chat_history 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert chat history" 
  ON public.assignment_chat_history 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own chat history" 
  ON public.assignment_chat_history 
  FOR UPDATE 
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_assignment_chat_history_updated_at
  BEFORE UPDATE ON public.assignment_chat_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();