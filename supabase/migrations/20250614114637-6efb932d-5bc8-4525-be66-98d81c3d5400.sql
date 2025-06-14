
-- Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create policy to allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Enable RLS on other tables and create policies for user data collection

-- User progress table policies
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

CREATE POLICY "Users can view own progress" 
ON public.user_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
ON public.user_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
ON public.user_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- User bookmarks table policies
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users can insert own bookmarks" ON public.user_bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.user_bookmarks;

CREATE POLICY "Users can view own bookmarks" 
ON public.user_bookmarks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" 
ON public.user_bookmarks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" 
ON public.user_bookmarks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Doubts table policies
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own doubts" ON public.doubts;
DROP POLICY IF EXISTS "Users can insert own doubts" ON public.doubts;
DROP POLICY IF EXISTS "Users can update own doubts" ON public.doubts;

CREATE POLICY "Users can view own doubts" 
ON public.doubts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own doubts" 
ON public.doubts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own doubts" 
ON public.doubts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Doubt responses table policies
ALTER TABLE public.doubt_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own responses" ON public.doubt_responses;
DROP POLICY IF EXISTS "Users can insert own responses" ON public.doubt_responses;

CREATE POLICY "Users can view own responses" 
ON public.doubt_responses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses" 
ON public.doubt_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow public read access to subjects, chapters, and questions (educational content)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view subjects" ON public.subjects;
DROP POLICY IF EXISTS "Anyone can view chapters" ON public.chapters;
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;

CREATE POLICY "Anyone can view subjects" 
ON public.subjects 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Anyone can view chapters" 
ON public.chapters 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Anyone can view questions" 
ON public.questions 
FOR SELECT 
TO authenticated
USING (true);
