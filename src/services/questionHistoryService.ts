
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
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('question_history')
      .insert([{
        user_id: session.user.id,
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
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('question_history')
      .select('*')
      .eq('user_id', session.user.id)
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
