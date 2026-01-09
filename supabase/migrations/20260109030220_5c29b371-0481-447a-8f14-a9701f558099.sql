-- Live Sessions table for teachers to create classroom sessions
CREATE TABLE public.live_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_code VARCHAR(6) NOT NULL UNIQUE,
  lesson_id VARCHAR(20) NOT NULL, -- e.g., "1-1" for week 1 lesson 1
  teacher_id UUID NOT NULL REFERENCES public.profiles(id),
  title VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'paused', 'ended')),
  current_section VARCHAR(50), -- Track which section teacher is on: 'notes', 'mc', 'writing', 'reflection'
  current_question_index INTEGER DEFAULT 0, -- Which question is being shown
  allow_ahead BOOLEAN DEFAULT false, -- Can students work ahead of teacher?
  settings JSONB DEFAULT '{}', -- Additional settings
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Session Participants - students who joined a live session
CREATE TABLE public.session_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  student_identifier VARCHAR(100) NOT NULL, -- The unique ID from settings or browser session
  display_name VARCHAR(100), -- Optional display name
  is_online BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_section VARCHAR(50),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, student_identifier)
);

-- Session Responses - track student answers during live session
CREATE TABLE public.session_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.session_participants(id) ON DELETE CASCADE,
  question_type VARCHAR(20) NOT NULL, -- 'mc', 'open_ended', 'reflection'
  question_index INTEGER NOT NULL,
  response JSONB NOT NULL, -- The answer data
  is_correct BOOLEAN, -- For MC questions
  ai_feedback TEXT, -- AI feedback if requested
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Teacher Prompts - messages pushed to students during session
CREATE TABLE public.session_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  prompt_type VARCHAR(20) NOT NULL DEFAULT 'message' CHECK (prompt_type IN ('message', 'focus', 'timer', 'poll')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_prompts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for live_sessions
CREATE POLICY "Teachers can create sessions" ON public.live_sessions
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can manage their sessions" ON public.live_sessions
  FOR UPDATE USING (auth.uid() = teacher_id);

CREATE POLICY "Anyone can view active sessions by code" ON public.live_sessions
  FOR SELECT USING (true);

CREATE POLICY "Teachers can delete their sessions" ON public.live_sessions
  FOR DELETE USING (auth.uid() = teacher_id);

-- RLS Policies for session_participants
CREATE POLICY "Anyone can join sessions" ON public.session_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Participants visible to session teacher and self" ON public.session_participants
  FOR SELECT USING (true);

CREATE POLICY "Participants can update their own status" ON public.session_participants
  FOR UPDATE USING (true);

-- RLS Policies for session_responses
CREATE POLICY "Participants can submit responses" ON public.session_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Responses visible to teacher and participant" ON public.session_responses
  FOR SELECT USING (true);

CREATE POLICY "Participants can update their responses" ON public.session_responses
  FOR UPDATE USING (true);

-- RLS Policies for session_prompts
CREATE POLICY "Teachers can create prompts" ON public.session_prompts
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.live_sessions 
    WHERE id = session_id AND teacher_id = auth.uid()
  ));

CREATE POLICY "Anyone in session can view prompts" ON public.session_prompts
  FOR SELECT USING (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_prompts;

-- Function to generate unique session codes
CREATE OR REPLACE FUNCTION generate_session_code()
RETURNS VARCHAR(6) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code VARCHAR(6) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to auto-generate session code
CREATE OR REPLACE FUNCTION set_session_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.session_code IS NULL OR NEW.session_code = '' THEN
    NEW.session_code := generate_session_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trigger_set_session_code
  BEFORE INSERT ON public.live_sessions
  FOR EACH ROW
  EXECUTE FUNCTION set_session_code();

-- Update timestamp trigger
CREATE TRIGGER update_live_sessions_updated_at
  BEFORE UPDATE ON public.live_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();