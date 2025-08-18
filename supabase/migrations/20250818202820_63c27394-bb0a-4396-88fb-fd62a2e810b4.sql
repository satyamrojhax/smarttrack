-- Fix security issues: Add missing RLS policies and fix function search path

-- Fix the function search path issue for the existing function
CREATE OR REPLACE FUNCTION public.update_study_statistics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

-- Add missing RLS policies for tables that need them

-- Add policies for mcq_quiz_sessions
DROP POLICY IF EXISTS "Users can delete their own quiz sessions" ON mcq_quiz_sessions;
DROP POLICY IF EXISTS "Users can update their own quiz sessions" ON mcq_quiz_sessions;

CREATE POLICY "Users can delete their own quiz sessions" 
ON mcq_quiz_sessions FOR DELETE 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own quiz sessions" 
ON mcq_quiz_sessions FOR UPDATE 
USING (user_id = auth.uid());

-- Add policies for study_sessions
DROP POLICY IF EXISTS "Users can delete their own study sessions" ON study_sessions;
DROP POLICY IF EXISTS "Users can update their own study sessions" ON study_sessions;

CREATE POLICY "Users can delete their own study sessions" 
ON study_sessions FOR DELETE 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own study sessions" 
ON study_sessions FOR UPDATE 
USING (user_id = auth.uid());

-- Add policies for user_achievements  
DROP POLICY IF EXISTS "Users can delete their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can update their own achievements" ON user_achievements;

CREATE POLICY "Users can delete their own achievements" 
ON user_achievements FOR DELETE 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own achievements" 
ON user_achievements FOR UPDATE 
USING (user_id = auth.uid());

-- Add policies for user_progress
DROP POLICY IF EXISTS "Users can delete own progress" ON user_progress;

CREATE POLICY "Users can delete own progress" 
ON user_progress FOR DELETE 
USING (user_id = auth.uid());