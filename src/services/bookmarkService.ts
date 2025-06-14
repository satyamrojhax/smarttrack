
import { supabase } from '@/integrations/supabase/client';

export const saveBookmarkToDatabase = async (questionId: string) => {
  try {
    console.log('Starting bookmark save process for question:', questionId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      throw new Error('User not authenticated');
    }

    console.log('User authenticated:', user.id);

    // First check if bookmark already exists
    const { data: existing, error: checkError } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', questionId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing bookmark:', checkError);
      throw checkError;
    }

    if (existing) {
      console.log('Bookmark already exists:', existing);
      return { success: true, message: 'Already bookmarked', data: existing };
    }

    // Insert new bookmark
    console.log('Inserting new bookmark...');
    const { data, error } = await supabase
      .from('user_bookmarks')
      .insert({
        user_id: user.id,
        question_id: questionId
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    console.log('Bookmark saved successfully:', data);
    return { success: true, data, message: 'Bookmark saved' };
  } catch (error) {
    console.error('Error in saveBookmarkToDatabase:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const removeBookmarkFromDatabase = async (questionId: string) => {
  try {
    console.log('Removing bookmark for question:', questionId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      throw new Error('User not authenticated');
    }

    console.log('User authenticated for removal:', user.id);

    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('question_id', questionId);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    
    console.log('Bookmark removed successfully');
    return { success: true, message: 'Bookmark removed' };
  } catch (error) {
    console.error('Error in removeBookmarkFromDatabase:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const getUserBookmarks = async () => {
  try {
    console.log('Fetching user bookmarks...');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      throw new Error('User not authenticated');
    }

    console.log('Fetching bookmarks for user:', user.id);

    const { data, error } = await supabase
      .from('user_bookmarks')
      .select(`
        id,
        question_id,
        created_at,
        questions (
          id,
          question_text,
          question_type,
          difficulty_level,
          chapter_id
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      throw error;
    }
    
    console.log('Bookmarks fetched successfully:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getUserBookmarks:', error);
    return [];
  }
};

export const checkIfBookmarked = async (questionId: string) => {
  try {
    console.log('Checking bookmark status for question:', questionId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user authenticated, returning false');
      return false;
    }

    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('question_id', questionId)
      .maybeSingle();

    if (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }

    const isBookmarked = !!data;
    console.log('Bookmark status:', isBookmarked);
    return isBookmarked;
  } catch (error) {
    console.error('Error in checkIfBookmarked:', error);
    return false;
  }
};
