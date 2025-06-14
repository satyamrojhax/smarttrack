
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
  generatedQuestionText: string,
  userResponse?: string,
  correctAnswer?: string,
  isCorrect?: boolean,
  responseTime?: number,
  questionId?: string
) => {
  try {
    console.log('Saving question response:', { generatedQuestionText, userResponse, correctAnswer, isCorrect });
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('questions_responses')
      .insert([{
        user_id: user.id,
        question_id: questionId,
        generated_question_text: generatedQuestionText,
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

export const saveQuestionToDatabase = async (
  questionText: string,
  questionType: string,
  difficultyLevel: number,
  correctAnswer?: string,
  options?: any,
  explanation?: string,
  chapterId?: string
) => {
  try {
    console.log('Saving question to database:', { questionText, questionType, difficultyLevel });
    
    const { data, error } = await supabase
      .from('questions')
      .insert([{
        question_text: questionText,
        question_type: questionType,
        difficulty_level: difficultyLevel,
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
    console.error('Error in saveQuestionToDatabase:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const saveQuestionHistory = async (
  questionText: string,
  userAnswer?: string,
  correctAnswer?: string,
  isCorrect?: boolean,
  timeTaken?: number,
  questionType?: string,
  difficultyLevel?: number,
  questionId?: string
) => {
  try {
    console.log('Saving question history:', { questionText, userAnswer, correctAnswer, isCorrect });
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('question_history')
      .insert([{
        user_id: user.id,
        question_id: questionId,
        question_text: questionText,
        user_answer: userAnswer,
        correct_answer: correctAnswer,
        is_correct: isCorrect,
        time_taken: timeTaken,
        question_type: questionType,
        difficulty_level: difficultyLevel
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving question history:', error);
      throw error;
    }
    
    console.log('Question history saved successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in saveQuestionHistory:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getUserQuestionResponses = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('questions_responses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching question responses:', error);
      throw error;
    }
    
    console.log('Question responses fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getUserQuestionResponses:', error);
    return [];
  }
};
