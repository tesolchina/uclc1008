-- =============================================================================
-- AI LIVE CLASS - DATABASE SCHEMA
-- =============================================================================

-- Sessions table
CREATE TABLE public.ai_live_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code VARCHAR(6) UNIQUE NOT NULL,
  teacher_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting',
  topic TEXT,
  description TEXT,
  material_id UUID,
  week_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

-- Participants table
CREATE TABLE public.ai_session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES ai_live_sessions(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  is_online BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  messages_submitted INTEGER DEFAULT 0,
  messages_promoted INTEGER DEFAULT 0,
  UNIQUE(session_id, student_id)
);

-- Conversation messages table
CREATE TABLE public.ai_conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES ai_live_sessions(id) ON DELETE CASCADE,
  author VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  queued_message_id UUID,
  student_name TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message queue table
CREATE TABLE public.ai_message_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES ai_live_sessions(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  is_highlighted BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  promoted_message_id UUID
);

-- Enable Row Level Security
ALTER TABLE public.ai_live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_message_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Teachers manage own sessions" ON public.ai_live_sessions
  FOR ALL USING (true);

CREATE POLICY "View session participants" ON public.ai_session_participants
  FOR ALL USING (true);

CREATE POLICY "View conversation messages" ON public.ai_conversation_messages
  FOR ALL USING (true);

CREATE POLICY "Manage queue messages" ON public.ai_message_queue
  FOR ALL USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_live_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_conversation_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_message_queue;

-- Indexes
CREATE INDEX idx_ai_sessions_teacher ON public.ai_live_sessions(teacher_id);
CREATE INDEX idx_ai_sessions_code ON public.ai_live_sessions(session_code);
CREATE INDEX idx_ai_sessions_status ON public.ai_live_sessions(status);
CREATE INDEX idx_ai_participants_session ON public.ai_session_participants(session_id);
CREATE INDEX idx_ai_messages_session ON public.ai_conversation_messages(session_id);
CREATE INDEX idx_ai_queue_session ON public.ai_message_queue(session_id);
CREATE INDEX idx_ai_queue_status ON public.ai_message_queue(status);