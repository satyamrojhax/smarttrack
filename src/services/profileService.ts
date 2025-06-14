
import { supabase } from '@/integrations/supabase/client';

export const fetchProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      // If profile doesn't exist, create one from user metadata
      return await createProfileFromUser(userId);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return await createProfileFromUser(userId);
  }
};

export const createProfileFromUser = async (userId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const profileData = {
      id: userId,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      class: 'class-10' as const,
      board: 'cbse' as const,
      role: 'student' as const
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return profileData; // Return the data even if insert fails
    }

    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
};

export const updateProfileInDB = async (userId: string, updatedProfile: { name: string; class: string; board: string }) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: updatedProfile.name,
        class: 'class-10' as const,
        board: 'cbse' as const,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
};
