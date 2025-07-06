
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface QuestionData {
  question_text: string;
  question_type?: string;
  difficulty_level?: number;
  correct_answer?: string;
  explanation?: string;
  options?: any;
  subject_id?: string;
  chapter_id?: string;
}

export const saveUserQuestionResponse = async (questionData: QuestionData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to save questions.",
        variant: "destructive",
      });
      throw new Error('User not authenticated');
    }

    // Check if this exact question already exists for this user
    const { data: existingQuestion } = await supabase
      .from('user_generated_questions')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_text', questionData.question_text)
      .maybeSingle();

    if (existingQuestion) {
      console.log('Question already exists, skipping save');
      return { success: true, data: existingQuestion, isDuplicate: true };
    }

    const { data, error } = await supabase
      .from('user_generated_questions')
      .insert({
        user_id: user.id,
        question_text: questionData.question_text,
        question_type: questionData.question_type || 'general',
        difficulty_level: questionData.difficulty_level || 1,
        correct_answer: questionData.correct_answer,
        explanation: questionData.explanation,
        options: questionData.options,
        subject_id: questionData.subject_id,
        chapter_id: questionData.chapter_id
      })
      .select()
      .single();

    if (error) {
      console.error('Database error saving question:', error);
      toast({
        title: "Error Saving Question",
        description: "Failed to save the question. Please try again.",
        variant: "destructive",
      });
      throw error;
    }

    return { success: true, data, isDuplicate: false };
  } catch (error) {
    console.error('Error saving question response:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const saveQuestionResponse = async (
  questionText: string,
  userAnswer?: string,
  correctAnswer?: string,
  isCorrect?: boolean,
  timeTaken?: number,
  questionId?: string
) => {
  try {
    const result = await saveUserQuestionResponse({
      question_text: questionText,
      correct_answer: correctAnswer,
      explanation: `User answer: ${userAnswer || 'Not provided'}. Correct: ${isCorrect ? 'Yes' : 'No'}. Time taken: ${timeTaken || 0}s`
    });
    return result;
  } catch (error) {
    console.error('Error saving question response:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const saveQuestionToDatabase = async (
  questionText: string,
  questionType: string,
  difficultyLevel: number,
  correctAnswer: string,
  options?: string[],
  explanation?: string,
  chapterId?: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Create a unique identifier based on question content to prevent duplicates
    const questionHash = questionText.trim().toLowerCase();
    
    // Check if this exact question already exists for this user
    const { data: existingQuestion } = await supabase
      .from('user_generated_questions')
      .select('id')
      .eq('user_id', user.id)
      .ilike('question_text', questionHash)
      .maybeSingle();

    if (existingQuestion) {
      console.log('Question already exists, skipping duplicate save');
      return { success: true, data: existingQuestion, isDuplicate: true };
    }

    const { data, error } = await supabase
      .from('user_generated_questions')
      .insert({
        user_id: user.id,
        question_text: questionText,
        question_type: questionType,
        difficulty_level: difficultyLevel,
        correct_answer: correctAnswer,
        options: options ? JSON.stringify(options) : null,
        explanation: explanation,
        chapter_id: chapterId
      })
      .select()
      .single();

    if (error) {
      console.error('Database error saving question:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data, isDuplicate: false };
  } catch (error) {
    console.error('Error in saveQuestionToDatabase:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getUserQuestionResponses = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('No authenticated user found');
      return [];
    }

    const { data, error } = await supabase
      .from('user_generated_questions')
      .select(`
        *,
        subjects (name),
        chapters (name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching question responses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching question responses:', error);
    return [];
  }
};

export const deleteUserQuestionResponse = async (questionId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to delete questions.",
        variant: "destructive",
      });
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('user_generated_questions')
      .delete()
      .eq('id', questionId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Database error deleting question:', error);
      toast({
        title: "Error Deleting Question",
        description: "Failed to delete the question. Please try again.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Question Deleted",
      description: "The question has been deleted successfully.",
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};
