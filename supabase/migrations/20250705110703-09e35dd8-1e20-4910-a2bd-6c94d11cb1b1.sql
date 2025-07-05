
-- Create table for MCQ questions
CREATE TABLE public.mcq_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of 4 options
  correct_option INTEGER NOT NULL CHECK (correct_option >= 0 AND correct_option <= 3),
  subject_id UUID REFERENCES public.subjects,
  chapter_id UUID REFERENCES public.chapters,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 3),
  explanation TEXT,
  question_type TEXT DEFAULT 'mcq',
  is_pyq BOOLEAN DEFAULT false, -- Previous Year Question
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.mcq_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for MCQ questions
CREATE POLICY "Users can view their own MCQ questions" 
  ON public.mcq_questions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own MCQ questions" 
  ON public.mcq_questions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MCQ questions" 
  ON public.mcq_questions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MCQ questions" 
  ON public.mcq_questions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create table for MCQ quiz sessions
CREATE TABLE public.mcq_quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  score_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  time_taken INTEGER, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS for quiz sessions
ALTER TABLE public.mcq_quiz_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz sessions" 
  ON public.mcq_quiz_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz sessions" 
  ON public.mcq_quiz_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
