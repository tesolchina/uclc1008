-- Enable realtime for student_task_responses table for live dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_task_responses;