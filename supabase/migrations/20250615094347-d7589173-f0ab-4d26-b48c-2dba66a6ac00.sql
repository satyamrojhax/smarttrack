
-- Create a table for user generated questions
CREATE TABLE public.user_generated_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT,
  difficulty_level INTEGER,
  subject_id UUID REFERENCES public.subjects(id),
  chapter_id UUID REFERENCES public.chapters(id),
  correct_answer TEXT,
  options JSONB,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_generated_questions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own generated questions" 
  ON public.user_generated_questions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generated questions" 
  ON public.user_generated_questions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated questions" 
  ON public.user_generated_questions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated questions" 
  ON public.user_generated_questions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_generated_questions_user_id ON public.user_generated_questions(user_id);
CREATE INDEX idx_user_generated_questions_subject_id ON public.user_generated_questions(subject_id);
CREATE INDEX idx_user_generated_questions_chapter_id ON public.user_generated_questions(chapter_id);
CREATE INDEX idx_user_generated_questions_created_at ON public.user_generated_questions(created_at);
