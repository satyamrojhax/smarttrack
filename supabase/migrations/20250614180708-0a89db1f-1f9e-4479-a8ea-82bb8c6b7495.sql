
-- Drop all question-related tables and their data
DROP TABLE IF EXISTS public.questions_responses CASCADE;
DROP TABLE IF EXISTS public.question_history CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;

-- Remove any question-related policies (they will be dropped with the tables)
-- Remove any question-related functions if they exist
DROP FUNCTION IF EXISTS public.get_user_questions() CASCADE;
DROP FUNCTION IF EXISTS public.save_question_response() CASCADE;
