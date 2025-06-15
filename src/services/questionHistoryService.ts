
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
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated - please log in');
    }

    // For now, we'll save this as a generated question since that table exists
    const { data, error } = await supabase
      .from('user_generated_questions')
      .insert([{
        user_id: user.id,
        question_text: questionText,
        question_type: questionType,
        difficulty_level: difficultyLevel,
        correct_answer: correctAnswer,
        explanation: `User answer: ${userAnswer || 'Not provided'}. Correct: ${isCorrect ? 'Yes' : 'No'}. Time taken: ${timeTaken || 0}s`
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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('user_generated_questions')
      .select(`
        *,
        subjects(name),
        chapters(name)
      `)
      .eq('user_id', user.id)
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
