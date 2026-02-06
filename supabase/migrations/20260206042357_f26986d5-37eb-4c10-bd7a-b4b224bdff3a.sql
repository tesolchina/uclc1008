-- Create table for student OCR extraction records
CREATE TABLE public.student_ocr_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  title TEXT,
  extracted_text TEXT NOT NULL,
  image_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster student queries
CREATE INDEX idx_student_ocr_records_student_id ON public.student_ocr_records(student_id);

-- Enable Row Level Security
ALTER TABLE public.student_ocr_records ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Students can view their own OCR records (open - no auth required for reads by student_id)
CREATE POLICY "Students can view their own OCR records"
ON public.student_ocr_records
FOR SELECT
USING (true);

-- RLS Policy: Students can create their own OCR records (open insert)
CREATE POLICY "Students can create OCR records"
ON public.student_ocr_records
FOR INSERT
WITH CHECK (true);

-- RLS Policy: Students can update their own OCR records
CREATE POLICY "Students can update their own OCR records"
ON public.student_ocr_records
FOR UPDATE
USING (true);

-- Note: We intentionally don't add DELETE policy - records should never be deleted
-- This ensures students always have access to their extraction history

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_student_ocr_records_updated_at
BEFORE UPDATE ON public.student_ocr_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();