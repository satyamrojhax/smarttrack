
-- Create a table to store doubt conversations/sessions
CREATE TABLE public.doubt_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on doubt_conversations
ALTER TABLE public.doubt_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for doubt_conversations
CREATE POLICY "Users can view their own conversations" 
  ON public.doubt_conversations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations" 
  ON public.doubt_conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
  ON public.doubt_conversations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" 
  ON public.doubt_conversations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add conversation_id to doubt_responses to link messages to conversations
ALTER TABLE public.doubt_responses 
ADD COLUMN conversation_id UUID REFERENCES public.doubt_conversations(id) ON DELETE CASCADE;

-- Update the existing doubts table to link to conversations (optional, for backward compatibility)
ALTER TABLE public.doubts 
ADD COLUMN conversation_id UUID REFERENCES public.doubt_conversations(id) ON DELETE SET NULL;
