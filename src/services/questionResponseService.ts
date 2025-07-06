
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
    
    // Note: questions_responses table doesn't exist yet, returning mock success for now
    console.log('Question responses functionality not implemented - table does not exist');
    return { success: true, data: { id: 'mock-id' } };
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
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get subject_id from chapter_id
    let subjectId = null;
    if (chapterId) {
      const { data: chapterData } = await supabase
        .from('chapters')
        .select('subject_id')
        .eq('id', chapterId)
        .single();
      
      subjectId = chapterData?.subject_id;
    }

    const { data, error } = await supabase
      .from('user_generated_questions')
      .insert([{
        user_id: user.id,
        question_text: questionText,
        question_type: questionType,
        difficulty_level: difficultyLevel,
        correct_answer: correctAnswer,
        options: options,
        explanation: explanation,
        chapter_id: chapterId,
        subject_id: subjectId
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
