
-- Create community_messages table for the chat feature
CREATE TABLE public.community_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for community messages
CREATE POLICY "Anyone can view community messages" 
  ON public.community_messages 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert community messages" 
  ON public.community_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" 
  ON public.community_messages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" 
  ON public.community_messages 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable realtime for community messages
ALTER TABLE public.community_messages REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.community_messages;
