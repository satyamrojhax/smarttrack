
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

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session:', session);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      }
      
      setIsLoading(false);
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

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
