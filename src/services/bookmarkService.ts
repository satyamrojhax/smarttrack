
import { supabase } from '@/integrations/supabase/client';

export const saveBookmarkToDatabase = async (questionId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if bookmark already exists
    const { data: existing } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', questionId)
      .single();

    if (existing) {
      return { success: true, message: 'Already bookmarked' };
    }

    const { data, error } = await supabase
      .from('user_bookmarks')
      .insert({
        user_id: user.id,
        question_id: questionId
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving bookmark:', error);
    return { success: false, error: error.message };
  }
};

export const removeBookmarkFromDatabase = async (questionId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('question_id', questionId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return { success: false, error: error.message };
  }
};

export const getUserBookmarks = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_bookmarks')
      .select(`
        *,
        questions (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
};
