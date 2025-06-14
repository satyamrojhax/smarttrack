
import { supabase } from '@/integrations/supabase/client';
import { LoginData, SignupData } from '@/types/auth';

export const loginUser = async (userData: LoginData) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const signupUser = async (userData: SignupData) => {
  try {
    // Use the current origin as the redirect URL
    const redirectUrl = window.location.origin;
    
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: userData.name,
          class: 'class-10' as const,
          board: 'cbse' as const,
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const logoutUser = async () => {
  await supabase.auth.signOut();
};
