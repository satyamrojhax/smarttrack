
import { supabase } from '@/integrations/supabase/client';
import { LoginData, SignupData } from '@/types/auth';

export const loginUser = async (userData: LoginData) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      let friendlyMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        friendlyMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('Email not confirmed')) {
        friendlyMessage = 'Please check your email and click the confirmation link before signing in.';
      }
      return { success: false, error: friendlyMessage };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error. Please check your connection and try again.' };
  }
};

export const signupUser = async (userData: SignupData) => {
  try {
    // Remove email verification redirect to go directly to dashboard
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          class: 'class-10', // Default to class 10
          board: 'cbse',     // Default to CBSE
        }
      }
    });

    if (error) {
      let friendlyMessage = error.message;
      if (error.message.includes('User already registered')) {
        friendlyMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.message.includes('Password should be at least')) {
        friendlyMessage = 'Password must be at least 6 characters long.';
      } else if (error.message.includes('Invalid email')) {
        friendlyMessage = 'Please enter a valid email address.';
      }
      return { success: false, error: friendlyMessage };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Network error. Please check your connection and try again.' };
  }
};

export const logoutUser = async () => {
  await supabase.auth.signOut();
};
