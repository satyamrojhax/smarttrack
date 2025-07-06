
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
      return existingQuestion;
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

    return data;
  } catch (error) {
    console.error('Error saving question response:', error);
    throw error;
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
