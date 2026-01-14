-- Table for paragraph notes (individual notes per paragraph)
CREATE TABLE public.paragraph_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  paragraph_key TEXT NOT NULL, -- e.g., "w1h1-p1", "w1h1-p2"
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, paragraph_key)
);

-- Table for writing drafts with version history
CREATE TABLE public.writing_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  task_key TEXT NOT NULL, -- e.g., "w1h1-macro-structure"
  content TEXT NOT NULL,
  ai_feedback TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  is_submitted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_paragraph_notes_student ON public.paragraph_notes(student_id);
CREATE INDEX idx_writing_drafts_student_task ON public.writing_drafts(student_id, task_key);

-- Enable RLS
ALTER TABLE public.paragraph_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_drafts ENABLE ROW LEVEL SECURITY;

-- RLS policies for paragraph_notes
CREATE POLICY "Students can view their own paragraph notes"
ON public.paragraph_notes FOR SELECT
USING (true);

CREATE POLICY "Students can insert their own paragraph notes"
ON public.paragraph_notes FOR INSERT
WITH CHECK (true);

CREATE POLICY "Students can update their own paragraph notes"
ON public.paragraph_notes FOR UPDATE
USING (true);

-- RLS policies for writing_drafts
CREATE POLICY "Students can view their own writing drafts"
ON public.writing_drafts FOR SELECT
USING (true);

CREATE POLICY "Students can insert their own writing drafts"
ON public.writing_drafts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Students can update their own writing drafts"
ON public.writing_drafts FOR UPDATE
USING (true);

-- Trigger for updated_at on paragraph_notes
CREATE TRIGGER update_paragraph_notes_updated_at
BEFORE UPDATE ON public.paragraph_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on writing_drafts  
CREATE TRIGGER update_writing_drafts_updated_at
BEFORE UPDATE ON public.writing_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();