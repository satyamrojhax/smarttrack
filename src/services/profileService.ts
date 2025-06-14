
import { supabase } from '@/integrations/supabase/client';

export const fetchProfile = async (userId: string) => {
  try {
    console.log('Fetching profile for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      // Try to create profile from user metadata
      return await createProfileFromUser(userId);
    }
    
    if (!data) {
      console.log('No profile found, creating one from user metadata');
      return await createProfileFromUser(userId);
    }
    
    console.log('Profile found:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchProfile:', error);
    // Try to create profile from user metadata as fallback
    return await createProfileFromUser(userId);
  }
};

export const createProfileFromUser = async (userId: string) => {
  try {
    console.log('Creating profile for user:', userId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found, returning null profile');
      return null;
    }

    const profileData = {
      id: userId,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      class: 'class-10' as const,
      board: 'cbse' as const,
      role: 'student' as const
    };

    console.log('Inserting profile data:', profileData);

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating profile:', error);
      // Return the profile data even if insert fails - this allows the app to continue loading
      console.log('Returning profile data despite insert error');
      return profileData;
    }

    console.log('Profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating profile from user:', error);
    // Return null instead of throwing - this allows the app to continue loading
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
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
};
