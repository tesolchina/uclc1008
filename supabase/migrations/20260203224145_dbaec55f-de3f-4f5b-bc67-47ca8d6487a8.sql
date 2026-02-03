-- Insert default feedback prompt for Week 4 Hour 3 OCR review
INSERT INTO system_settings (key, value)
VALUES (
  'w4h3_feedback_prompt',
  '{"prompt": "Evaluate this AWQ summary based on the 5 criteria (Summary Accuracy, Synthesis, Paraphrasing, Academic Tone, Citations - 20% each). Provide specific, actionable feedback. Point out strengths first, then areas for improvement. Keep feedback concise and encouraging but honest."}'::jsonb
)
ON CONFLICT (key) DO NOTHING;