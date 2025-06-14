
-- First, let's check if we need RLS policies for existing tables and create a questions_responses table
-- Enable RLS on user_bookmarks if not already enabled
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_bookmarks
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users can create their own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.user_bookmarks;

CREATE POLICY "Users can view their own bookmarks" 
  ON public.user_bookmarks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" 
  ON public.user_bookmarks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
  ON public.user_bookmarks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on question_history if not already enabled
ALTER TABLE public.question_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for question_history
DROP POLICY IF EXISTS "Users can view their own question history" ON public.question_history;
DROP POLICY IF EXISTS "Users can create their own question history" ON public.question_history;

CREATE POLICY "Users can view their own question history" 
  ON public.question_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own question history" 
  ON public.question_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create questions_responses table for tracking user responses to questions
CREATE TABLE IF NOT EXISTS public.questions_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  generated_question_text text NOT NULL,
  user_response text,
  correct_answer text,
  is_correct boolean,
  response_time integer, -- in seconds
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on questions_responses
ALTER TABLE public.questions_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for questions_responses
CREATE POLICY "Users can view their own question responses" 
  ON public.questions_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own question responses" 
  ON public.questions_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own question responses" 
  ON public.questions_responses 
  FOR UPDATE 
  USING (auth.uid() = user_id);
