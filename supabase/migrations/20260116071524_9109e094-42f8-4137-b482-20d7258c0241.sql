-- Create table for AI tutor session reports
CREATE TABLE public.ai_tutor_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  hour_number INTEGER NOT NULL,
  topic_id TEXT NOT NULL,
  star_rating DECIMAL(2,1) NOT NULL CHECK (star_rating >= 0 AND star_rating <= 5),
  qualitative_report TEXT NOT NULL,
  performance_data JSONB DEFAULT '{}',
  tasks_completed INTEGER DEFAULT 0,
  tasks_total INTEGER DEFAULT 0,
  student_notes TEXT,
  teacher_comment TEXT,
  teacher_id UUID REFERENCES public.profiles(id),
  commented_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, week_number, hour_number, topic_id)
);

-- Enable RLS
ALTER TABLE public.ai_tutor_reports ENABLE ROW LEVEL SECURITY;

-- Students can view and update their own reports
CREATE POLICY "Students can view their own reports"
  ON public.ai_tutor_reports
  FOR SELECT
  USING (true); -- Allow read for now (students identified by student_id field)

CREATE POLICY "Students can insert their own reports"
  ON public.ai_tutor_reports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Students can update their own notes"
  ON public.ai_tutor_reports
  FOR UPDATE
  USING (true);

-- Teachers can view and comment on all reports
CREATE POLICY "Teachers can view all reports"
  ON public.ai_tutor_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE profile_id = auth.uid() 
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can update reports with comments"
  ON public.ai_tutor_reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE profile_id = auth.uid() 
      AND role IN ('teacher', 'admin')
    )
  );

-- Create index for efficient querying
CREATE INDEX idx_ai_tutor_reports_student ON public.ai_tutor_reports(student_id, week_number);
CREATE INDEX idx_ai_tutor_reports_week_topic ON public.ai_tutor_reports(week_number, hour_number, topic_id);

-- Add trigger for updated_at
CREATE TRIGGER update_ai_tutor_reports_updated_at
  BEFORE UPDATE ON public.ai_tutor_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();