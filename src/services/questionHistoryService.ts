
import { supabase } from '@/integrations/supabase/client';

export interface QuestionHistory {
  id: string;
  user_id: string;
  question_id?: string;
  question_text: string;
  question_type?: string;
  difficulty_level?: number;
  user_answer?: string;
  correct_answer?: string;
  is_correct?: boolean;
  time_taken?: number;
  created_at: string;
}

export const saveQuestionToHistory = async (
  questionText: string,
  questionType?: string,
  difficultyLevel?: number,
  userAnswer?: string,
  correctAnswer?: string,
  isCorrect?: boolean,
  timeTaken?: number,
  questionId?: string
) => {
  try {
    console.log('Saving question to history:', { questionText, questionType, difficultyLevel });
    
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
      .from('question_history')
      .insert([{
        user_id: userId,
        question_id: questionId,
        question_text: questionText,
        question_type: questionType,
        difficulty_level: difficultyLevel,
        user_answer: userAnswer,
        correct_answer: correctAnswer,
        is_correct: isCorrect,
        time_taken: timeTaken
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving question to history:', error);
      throw error;
    }
    
    console.log('Question saved to history successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in saveQuestionToHistory:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getUserQuestionHistory = async () => {
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
      .from('question_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching question history:', error);
      throw error;
    }
    
    console.log('Question history fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getUserQuestionHistory:', error);
    return [];
  }
};
