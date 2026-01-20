
-- Create discussion_sessions table
CREATE TABLE public.discussion_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 13),
  current_task_id VARCHAR(100),
  task_context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create discussion_threads table
CREATE TABLE public.discussion_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  response_id UUID REFERENCES public.session_responses(id) ON DELETE SET NULL,
  author_type VARCHAR(20) NOT NULL CHECK (author_type IN ('ai', 'teacher')),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
  is_spotlight BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_discussion_sessions_session_id ON public.discussion_sessions(session_id);
CREATE INDEX idx_discussion_sessions_week ON public.discussion_sessions(week_number);
CREATE INDEX idx_discussion_threads_session_id ON public.discussion_threads(session_id);
CREATE INDEX idx_discussion_threads_response_id ON public.discussion_threads(response_id);
CREATE INDEX idx_discussion_threads_spotlight ON public.discussion_threads(is_spotlight) WHERE is_spotlight = true;

-- Enable RLS
ALTER TABLE public.discussion_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discussion_sessions
CREATE POLICY "Teachers can manage their own discussion sessions"
ON public.discussion_sessions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.live_sessions ls
    WHERE ls.id = discussion_sessions.session_id
    AND ls.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students can view active discussion sessions"
ON public.discussion_sessions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.live_sessions ls
    WHERE ls.id = discussion_sessions.session_id
    AND ls.status IN ('active', 'paused')
  )
);

-- RLS Policies for discussion_threads
CREATE POLICY "Teachers can manage threads in their sessions"
ON public.discussion_threads
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.live_sessions ls
    WHERE ls.id = discussion_threads.session_id
    AND ls.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students can view spotlight threads"
ON public.discussion_threads
FOR SELECT
USING (
  is_spotlight = true
  OR EXISTS (
    SELECT 1 FROM public.session_participants sp
    WHERE sp.session_id = discussion_threads.session_id
    AND sp.student_identifier = auth.uid()::text
  )
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussion_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussion_threads;
