-- Drop FK constraint on ai_message_queue so it can accept both 
-- live_sessions and ai_live_sessions IDs
ALTER TABLE ai_message_queue DROP CONSTRAINT IF EXISTS ai_message_queue_session_id_fkey;
