
import { supabase } from '@/integrations/supabase/client';

export interface QuestionResponse {
  id: string;
  user_id: string;
  question_id?: string;
  generated_question_text: string;
  user_response?: string;
  correct_answer?: string;
  is_correct?: boolean;
  response_time?: number;
  created_at: string;
}

export const saveQuestionResponse = async (
  questionText: string,
  userResponse?: string,
  correctAnswer?: string,
  isCorrect?: boolean,
  responseTime?: number,
  questionId?: string
) => {
  try {
    console.log('Saving question response:', { questionText, userResponse, correctAnswer, isCorrect });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('questions_responses')
      .insert([{
        user_id: session.user.id,
        question_id: questionId,
        generated_question_text: questionText,
        user_response: userResponse,
        correct_answer: correctAnswer,
        is_correct: isCorrect,
        response_time: responseTime
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving question response:', error);
      throw error;
    }

    console.log('Question response saved successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in saveQuestionResponse:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getUserQuestionResponses = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('questions_responses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching question responses:', error);
    return [];
  }
};

export const saveGeneratedQuestion = async (
  questionText: string,
  questionType?: string,
  difficultyLevel?: number,
  correctAnswer?: string,
  options?: any,
  explanation?: string,
  chapterId?: string
) => {
  try {
    console.log('Saving generated question to database:', questionText);
    
    const { data, error } = await supabase
      .from('questions')
      .insert([{
        question_text: questionText,
        question_type: questionType || 'mcq',
        difficulty_level: difficultyLevel || 1,
        correct_answer: correctAnswer,
        options: options,
        explanation: explanation,
        chapter_id: chapterId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving question:', error);
      throw error;
    }

    console.log('Question saved successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in saveGeneratedQuestion:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
