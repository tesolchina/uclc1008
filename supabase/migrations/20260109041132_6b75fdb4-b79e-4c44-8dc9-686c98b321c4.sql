-- Set REPLICA IDENTITY FULL for session_responses to ensure realtime updates include all columns
ALTER TABLE public.session_responses REPLICA IDENTITY FULL;