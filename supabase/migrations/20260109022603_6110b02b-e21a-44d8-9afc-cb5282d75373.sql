-- Create student_api_usage table to track shared API usage
CREATE TABLE public.student_api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  request_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, usage_date)
);

-- Enable RLS
ALTER TABLE public.student_api_usage ENABLE ROW LEVEL SECURITY;

-- Service role can manage all usage records
CREATE POLICY "Service role can manage student_api_usage"
  ON public.student_api_usage
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create system_settings table for admin configuration
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Anyone can read system_settings"
  ON public.system_settings
  FOR SELECT
  USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can manage system_settings"
  ON public.system_settings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default settings
INSERT INTO public.system_settings (key, value) VALUES 
  ('shared_api_enabled', '{"enabled": true}'::jsonb),
  ('shared_api_daily_limit', '{"limit": 50}'::jsonb);

-- Create trigger for updated_at on student_api_usage
CREATE TRIGGER update_student_api_usage_updated_at
  BEFORE UPDATE ON public.student_api_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on system_settings
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();