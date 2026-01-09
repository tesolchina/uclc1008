import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  hkbu_user_id: string;
  email: string | null;
  display_name: string | null;
  role: 'teacher' | 'student' | 'admin';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  accessToken: string | null; // For backwards compatibility - uses Supabase access token
  isLoading: boolean;
  isAuthenticated: boolean;
  isTeacher: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  login: () => void; // Alias for backwards compat - navigates to auth page
  logout: () => Promise<void>; // Alias for signOut
  loginWithHkbu: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  }, []);

  const fetchUserRoles = useCallback(async (profileId: string): Promise<string[]> => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('profile_id', profileId);

    return data?.map(r => r.role) || ['student'];
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession?.user) {
      const profileData = await fetchProfile(currentSession.user.id);
      if (profileData) {
        const roles = await fetchUserRoles(profileData.id);
        setUserRoles(roles);
        const primaryRole = roles.includes('admin') ? 'admin' : roles.includes('teacher') ? 'teacher' : 'student';
        setProfile({ ...profileData, role: primaryRole });
      }
    }
  }, [fetchProfile, fetchUserRoles]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Defer profile fetch with setTimeout to avoid deadlock
        if (currentSession?.user) {
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id);
            if (profileData) {
              const roles = await fetchUserRoles(profileData.id);
              setUserRoles(roles);
              const primaryRole = roles.includes('admin') ? 'admin' : roles.includes('teacher') ? 'teacher' : 'student';
              setProfile({ ...profileData, role: primaryRole });
            }
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setUserRoles([]);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const profileData = await fetchProfile(currentSession.user.id);
        if (profileData) {
          const roles = await fetchUserRoles(profileData.id);
          setUserRoles(roles);
          const primaryRole = roles.includes('admin') ? 'admin' : roles.includes('teacher') ? 'teacher' : 'student';
          setProfile({ ...profileData, role: primaryRole });
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchUserRoles]);

  const signUp = async (email: string, password: string, displayName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
        },
      },
    });

    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    // Clean up legacy HKBU session if any
    localStorage.removeItem('hkbu_session');
    localStorage.removeItem('oauth_state');
  };

  const login = useCallback(() => {
    // Navigate to auth page - for backwards compatibility
    window.location.href = '/auth';
  }, []);

  const loginWithHkbu = useCallback(() => {
    const returnUrl = window.location.href;
    window.location.href = `${SUPABASE_URL}/functions/v1/oauth-init?return_url=${encodeURIComponent(returnUrl)}`;
  }, []);

  const value: AuthContextType = {
    user,
    session,
    profile,
    accessToken: session?.access_token ?? null,
    isLoading,
    isAuthenticated: !!user,
    isTeacher: userRoles.includes('teacher') || userRoles.includes('admin'),
    isAdmin: userRoles.includes('admin'),
    signUp,
    signIn,
    signOut,
    login,
    logout: signOut,
    loginWithHkbu,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
