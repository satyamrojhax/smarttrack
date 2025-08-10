
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextProps, Profile, LoginData, SignupData, ProfileUpdateData } from '@/types/auth';
import { fetchProfile, ensureUserDataTracking } from '@/services/profileService';
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

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const profileData = await fetchProfile(userId);
      if (profileData) {
        setProfile(profileData);
        // Ensure user data tracking is set up (non-blocking)
        ensureUserDataTracking(userId).catch(console.error);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Create a fallback profile to prevent app from being stuck
      setProfile({
        id: userId,
        name: 'User',
        email: '',
        class: 'class-10',
        board: 'cbse',
        role: 'student'
      });
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    let mounted = true;

    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!mounted) return;
        
        // Always update session and user state
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            // Fetch profile but don't block the UI
            fetchUserProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        // Only set loading to false after we've processed the auth state
        setIsLoading(false);
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session:', initialSession);
        
        if (mounted) {
          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            // Fetch profile immediately but don't block loading
            fetchUserProfile(initialSession.user.id);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (userData: LoginData) => {
    const result = await loginUser(userData);
    if (result.success) {
      // Profile will be fetched by auth state change listener
      console.log('Login successful, profile will be fetched automatically');
    }
    return result;
  };

  const signup = async (userData: SignupData) => {
    const result = await signupUser(userData);
    if (result.success) {
      console.log('Signup successful, profile will be created automatically');
    }
    return result;
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
