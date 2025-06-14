
import { supabase } from '@/integrations/supabase/client';

export const saveBookmarkToDatabase = async (questionId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Saving bookmark for question:', questionId, 'user:', user.id);

    // Check if bookmark already exists
    const { data: existing } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', questionId)
      .single();

    if (existing) {
      console.log('Bookmark already exists');
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

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Bookmark saved successfully:', data);
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

    console.log('Removing bookmark for question:', questionId, 'user:', user.id);

    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('question_id', questionId);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Bookmark removed successfully');
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

    console.log('Fetching bookmarks for user:', user.id);

    const { data, error } = await supabase
      .from('user_bookmarks')
      .select(`
        *,
        questions (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Bookmarks fetched:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
};

export const checkIfBookmarked = async (questionId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', questionId)
      .single();

    return !!data;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};
