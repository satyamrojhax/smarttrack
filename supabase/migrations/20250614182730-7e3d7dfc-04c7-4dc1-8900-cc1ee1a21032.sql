
-- Create table for user notes and flashcards
CREATE TABLE IF NOT EXISTS public.user_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  note_type text DEFAULT 'note' CHECK (note_type IN ('note', 'flashcard')),
  flashcard_answer text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for study sessions (timer tracking)
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  duration_seconds integer NOT NULL,
  session_type text DEFAULT 'study' CHECK (session_type IN ('study', 'break')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for user achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  achievement_description text,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Create table for study statistics
CREATE TABLE IF NOT EXISTS public.study_statistics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_study_time integer DEFAULT 0,
  study_streak integer DEFAULT 0,
  last_study_date date,
  total_sessions integer DEFAULT 0,
  notes_created integer DEFAULT 0,
  chapters_completed integer DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_notes
CREATE POLICY "Users can view their own notes" 
  ON public.user_notes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
  ON public.user_notes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
  ON public.user_notes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
  ON public.user_notes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for study_sessions
CREATE POLICY "Users can view their own study sessions" 
  ON public.study_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study sessions" 
  ON public.study_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" 
  ON public.user_achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for study_statistics
CREATE POLICY "Users can view their own statistics" 
  ON public.study_statistics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own statistics" 
  ON public.study_statistics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own statistics" 
  ON public.study_statistics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to update study statistics
CREATE OR REPLACE FUNCTION public.update_study_statistics()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.study_statistics (user_id, total_study_time, total_sessions, updated_at)
  VALUES (NEW.user_id, NEW.duration_seconds, 1, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_study_time = study_statistics.total_study_time + NEW.duration_seconds,
    total_sessions = study_statistics.total_sessions + 1,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update statistics when study session is added
CREATE TRIGGER update_study_stats_trigger
  AFTER INSERT ON public.study_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_study_statistics();
