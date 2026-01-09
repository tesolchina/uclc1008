-- Add unique constraint for upsert to work properly on session_responses
CREATE UNIQUE INDEX IF NOT EXISTS idx_session_responses_unique 
ON public.session_responses (session_id, participant_id, question_type, question_index);