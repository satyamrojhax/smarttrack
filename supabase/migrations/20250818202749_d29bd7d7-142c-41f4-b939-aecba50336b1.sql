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

-- Add RLS policies for any tables that are missing them
-- (These are likely the tables that have RLS enabled but no policies)

-- Check and add missing policies for mcq_quiz_sessions if needed
CREATE POLICY IF NOT EXISTS "Users can delete their own quiz sessions" 
ON mcq_quiz_sessions FOR DELETE 
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update their own quiz sessions" 
ON mcq_quiz_sessions FOR UPDATE 
USING (user_id = auth.uid());

-- Check and add missing policies for study_sessions if needed  
CREATE POLICY IF NOT EXISTS "Users can delete their own study sessions" 
ON study_sessions FOR DELETE 
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update their own study sessions" 
ON study_sessions FOR UPDATE 
USING (user_id = auth.uid());

-- Check and add missing policies for user_achievements if needed
CREATE POLICY IF NOT EXISTS "Users can delete their own achievements" 
ON user_achievements FOR DELETE 
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update their own achievements" 
ON user_achievements FOR UPDATE 
USING (user_id = auth.uid());

-- Check and add missing policies for user_progress if needed
CREATE POLICY IF NOT EXISTS "Users can delete own progress" 
ON user_progress FOR DELETE 
USING (user_id = auth.uid());