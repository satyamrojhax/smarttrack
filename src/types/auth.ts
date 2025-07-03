
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  name: string;
  email: string;
  class: string;
  board: string;
  role: string;
}

export interface AuthContextProps {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (userData: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: { name: string; email: string; password: string; class?: string; board?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updatedProfile: { name: string; class: string; board: string }) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  class: string;
  board: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileUpdateData {
  name: string;
  class: string;
  board: string;
}
