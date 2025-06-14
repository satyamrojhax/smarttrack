
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
    
    // Try to get session first, then fall back to getUser if needed
    let userId: string | null = null;
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (session?.user) {
      userId = session.user.id;
    } else {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      } else {
        console.error('Auth errors:', { sessionError, userError });
        throw new Error('User not authenticated - please log in');
      }
    }

    if (!userId) {
      throw new Error('Unable to get user ID');
    }

    const { data, error } = await supabase
      .from('questions_responses')
      .insert([{
        user_id: userId,
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

export const getUserQuestionResponses = async () => {
  try {
    // Try to get session first, then fall back to getUser if needed
    let userId: string | null = null;
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (session?.user) {
      userId = session.user.id;
    } else {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      } else {
        console.error('Auth errors:', { sessionError, userError });
        throw new Error('User not authenticated');
      }
    }

    if (!userId) {
      throw new Error('Unable to get user ID');
    }

    const { data, error } = await supabase
      .from('questions_responses')
      .select('*')
      .eq('user_id', userId)
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
