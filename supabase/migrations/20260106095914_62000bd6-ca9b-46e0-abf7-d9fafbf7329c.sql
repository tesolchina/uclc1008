-- Create process_logs table for real-time debugging
CREATE TABLE public.process_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation TEXT NOT NULL,
  step TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.process_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read logs (for debugging)
CREATE POLICY "Process logs are viewable by everyone"
ON public.process_logs
FOR SELECT
USING (true);

-- Allow service role to insert logs
CREATE POLICY "Service role can insert process logs"
ON public.process_logs
FOR INSERT
WITH CHECK (true);

-- Allow service role to delete old logs
CREATE POLICY "Service role can delete process logs"
ON public.process_logs
FOR DELETE
USING (true);

-- Create index for faster queries
CREATE INDEX idx_process_logs_session ON public.process_logs(session_id);
CREATE INDEX idx_process_logs_created ON public.process_logs(created_at DESC);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.process_logs;