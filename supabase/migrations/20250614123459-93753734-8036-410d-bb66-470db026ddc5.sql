
-- Create table for question history
CREATE TABLE public.question_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_id UUID REFERENCES public.questions(id),
  question_text TEXT NOT NULL,
  question_type TEXT,
  difficulty_level INTEGER,
  user_answer TEXT,
  correct_answer TEXT,
  is_correct BOOLEAN,
  time_taken INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on question_history
ALTER TABLE public.question_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for question_history
CREATE POLICY "Users can view their own question history" 
  ON public.question_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own question history" 
  ON public.question_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on user_bookmarks if not already enabled
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_bookmarks
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

-- Enable RLS on doubts if not already enabled
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for doubts
CREATE POLICY "Users can view their own doubts" 
  ON public.doubts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own doubts" 
  ON public.doubts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doubts" 
  ON public.doubts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable RLS on doubt_responses if not already enabled
ALTER TABLE public.doubt_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for doubt_responses
CREATE POLICY "Users can view their own doubt responses" 
  ON public.doubt_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own doubt responses" 
  ON public.doubt_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
