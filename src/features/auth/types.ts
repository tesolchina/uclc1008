import { User, Session } from '@supabase/supabase-js';

// Database Profile type
export interface Profile {
  id: string;
  hkbu_user_id: string;
  email: string | null;
  display_name: string | null;
  role: 'teacher' | 'student' | 'admin';
  created_at: string;
}

// Auth Context type
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  login: () => void;
  logout: () => Promise<void>;
  loginWithHkbu: () => void;
  refreshProfile: () => Promise<void>;
}

// UI State types
export type UserType = 'select' | 'teacher' | 'student';
export type StudentMode = 'choose' | 'register' | 'login';

// Student registration form data
export interface StudentRegistrationData {
  lastFourDigits: string;
  firstInitial: string;
  lastInitial: string;
  sectionNumber: string;
}

// Teacher form data
export interface TeacherFormData {
  email: string;
  password: string;
  displayName?: string;
}
