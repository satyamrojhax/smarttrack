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
    return await createProfileFromUser(userId);
  }
};

export const createProfileFromUser = async (userId: string) => {
  try {
    console.log('Creating profile for user:', userId);
    
    // Get the current session instead of just the user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error('No authenticated session found for profile creation');
      return null;
    }

    const user = session.user;
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
      // Return a default profile object instead of throwing
      return {
        id: userId,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        class: 'class-10' as const,
        board: 'cbse' as const,
        role: 'student' as const
      };
    }

    console.log('Profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating profile from user:', error);
    // Return a fallback profile to prevent app from being stuck
    return {
      id: userId,
      name: 'User',
      email: '',
      class: 'class-10' as const,
      board: 'cbse' as const,
      role: 'student' as const
    };
  }
};

export const updateProfileInDB = async (userId: string, updatedProfile: { name: string; class: string; board: string }) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: updatedProfile.name,
        class: updatedProfile.class as 'class-10',
        board: updatedProfile.board as 'cbse',
      })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }

    console.log('Profile updated successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error updating profile:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

// Helper function to ensure user data is properly tracked
export const ensureUserDataTracking = async (userId: string) => {
  try {
    // Check if user has any progress data
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    console.log('User progress data check:', { userId, hasProgress: !!progressData?.length });

    // Check if user has profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    console.log('User profile data check:', { userId, hasProfile: !!profileData });

    return {
      hasProfile: !!profileData,
      hasProgress: !!progressData?.length
    };
  } catch (error) {
    console.error('Error checking user data:', error);
    return { hasProfile: false, hasProgress: false };
  }
};
