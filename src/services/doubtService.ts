
import { supabase } from '@/integrations/supabase/client';

export interface Doubt {
  id: string;
  title: string;
  description: string;
  subject_id?: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DoubtResponse {
  id: string;
  doubt_id: string;
  user_id: string;
  response_text: string;
  is_ai_response: boolean;
  created_at: string;
}

export const saveDoubtToDatabase = async (title: string, description: string, subjectId?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('doubts')
      .insert({
        title,
        description,
        subject_id: subjectId,
        user_id: user.id,
        status: 'open'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving doubt:', error);
    throw error;
  }
};

export const saveDoubtResponseToDatabase = async (doubtId: string, responseText: string, isAiResponse: boolean = true) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('doubt_responses')
      .insert({
        doubt_id: doubtId,
        user_id: user.id,
        response_text: responseText,
        is_ai_response: isAiResponse
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving doubt response:', error);
    throw error;
  }
};

export const getUserDoubts = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('doubts')
      .select(`
        *,
        doubt_responses (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user doubts:', error);
    return [];
  }
};

export const getDoubtHistory = async (doubtId: string) => {
  try {
    const { data, error } = await supabase
      .from('doubt_responses')
      .select('*')
      .eq('doubt_id', doubtId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching doubt history:', error);
    return [];
  }
};
