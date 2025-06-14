
-- Enable RLS and add policies for tables that are missing them

-- Enable RLS on doubt_conversations
ALTER TABLE public.doubt_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for doubt_conversations
CREATE POLICY "Users can view their own doubt conversations" 
  ON public.doubt_conversations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own doubt conversations" 
  ON public.doubt_conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own doubt conversations" 
  ON public.doubt_conversations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable RLS on doubt_responses
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

-- Enable RLS on doubts
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

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Enable RLS on study_sessions
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for study_sessions
CREATE POLICY "Users can view their own study sessions" 
  ON public.study_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study sessions" 
  ON public.study_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on study_statistics
ALTER TABLE public.study_statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for study_statistics
CREATE POLICY "Users can view their own study statistics" 
  ON public.study_statistics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study statistics" 
  ON public.study_statistics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study statistics" 
  ON public.study_statistics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable RLS on user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" 
  ON public.user_achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on user_notes
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

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

-- Enable RLS on user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_progress
CREATE POLICY "Users can view their own progress" 
  ON public.user_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
  ON public.user_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON public.user_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable public read access for subjects and chapters (these are shared data)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to subjects" 
  ON public.subjects 
  FOR SELECT 
  USING (true);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to chapters" 
  ON public.chapters 
  FOR SELECT 
  USING (true);
