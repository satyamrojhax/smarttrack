
-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Users can view doubt responses (consolidated)" ON doubt_responses;

-- Create a better policy that allows users to view responses in their own conversations
CREATE POLICY "Users can view doubt responses" ON doubt_responses
FOR SELECT USING (
  user_id = auth.uid() OR 
  conversation_id IN (
    SELECT id FROM doubt_conversations WHERE user_id = auth.uid()
  )
);

-- Update the insert policy to allow saving responses to user's own conversations
DROP POLICY IF EXISTS "Users can insert their own doubt responses" ON doubt_responses;
CREATE POLICY "Users can insert doubt responses" ON doubt_responses
FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  conversation_id IN (
    SELECT id FROM doubt_conversations WHERE user_id = auth.uid()
  )
);
