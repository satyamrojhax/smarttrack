
-- Fix doubt responses table structure and add missing indexes for better performance
ALTER TABLE doubt_responses 
DROP CONSTRAINT IF EXISTS doubt_responses_doubt_id_fkey,
ADD CONSTRAINT doubt_responses_conversation_id_fkey 
FOREIGN KEY (conversation_id) REFERENCES doubt_conversations(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doubt_responses_conversation_id ON doubt_responses(conversation_id);
CREATE INDEX IF NOT EXISTS idx_doubt_responses_user_id ON doubt_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_doubt_conversations_user_id ON doubt_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_generated_questions_user_id ON user_generated_questions(user_id);

-- Update RLS policies for better doubt handling
DROP POLICY IF EXISTS "Users can view doubt responses (consolidated)" ON doubt_responses;
CREATE POLICY "Users can view doubt responses" ON doubt_responses
FOR SELECT USING (
  user_id = auth.uid() OR 
  conversation_id IN (
    SELECT id FROM doubt_conversations WHERE user_id = auth.uid()
  )
);

-- Ensure proper update policy for doubt responses
CREATE POLICY IF NOT EXISTS "Users can update their own doubt responses" ON doubt_responses
FOR UPDATE USING (user_id = auth.uid());

-- Add trigger to update conversation timestamp when responses are added
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE doubt_conversations 
  SET updated_at = NOW() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON doubt_responses;
CREATE TRIGGER trigger_update_conversation_timestamp
  AFTER INSERT ON doubt_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();
