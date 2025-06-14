
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextProps, Profile, LoginData, SignupData, ProfileUpdateData } from '@/types/auth';
import { fetchProfile } from '@/services/profileService';
import { loginUser, signupUser, logoutUser } from '@/services/authService';
import { updateProfileInDB } from '@/services/profileService';

const AuthContext = createContext<AuthContextProps>({
  user: null,
  profile: null,
  session: null,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  updateProfile: async () => ({ success: false }),
  isLoading: true,
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to fetch profile safely
  const fetchUserProfile = async (userId: string) => {
    try {
      const profileData = await fetchProfile(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state change listener FIRST - NO async operations inside!
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        
        // Only synchronous state updates here
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetching to avoid deadlocks
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        // Always ensure loading is set to false
        setIsLoading(false);
      }
    );

    // THEN get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile after setting user
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const login = async (userData: LoginData) => {
    return await loginUser(userData);
  };

  const signup = async (userData: SignupData) => {
    return await signupUser(userData);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const updateProfile = async (updatedProfile: ProfileUpdateData) => {
    if (!user) return { success: false, error: 'No user logged in' };

    const result = await updateProfileInDB(user.id, updatedProfile);
    
    if (result.success && result.data) {
      setProfile(result.data);
    }
    
    return result;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      login, 
      signup, 
      logout, 
      updateProfile, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
