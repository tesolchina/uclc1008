-- Add hkbu_api_key column to students table for storing validated API keys
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS hkbu_api_key TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_api_key ON public.students(hkbu_api_key) WHERE hkbu_api_key IS NOT NULL;

COMMENT ON COLUMN public.students.hkbu_api_key IS 'Validated HKBU GenAI API key for the student';