import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  hkbu_user_id: string;
  email: string | null;
  display_name: string | null;
  role: 'teacher' | 'student';
  created_at: string;
}

interface AuthContextType {
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isTeacher: boolean;
  login: () => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HKBU_AUTH_URL = 'https://auth.hkbu.tech/auth-provider/login';
const CLIENT_ID = import.meta.env.VITE_HKBU_CLIENT_ID || '';
const REDIRECT_URI = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oauth-callback`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const sessionData = localStorage.getItem('hkbu_session');
    if (!sessionData) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const session = JSON.parse(atob(sessionData));
      
      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        localStorage.removeItem('hkbu_session');
        setProfile(null);
        setIsLoading(false);
        return;
      }

      // Fetch profile from database
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.profileId)
        .single();

      if (error || !data) {
        localStorage.removeItem('hkbu_session');
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }
    } catch {
      localStorage.removeItem('hkbu_session');
      setProfile(null);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = useCallback(() => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('oauth_state', state);
    
    const authUrl = `${HKBU_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
    window.location.href = authUrl;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hkbu_session');
    localStorage.removeItem('oauth_state');
    setProfile(null);
  }, []);

  const value: AuthContextType = {
    profile,
    isLoading,
    isAuthenticated: !!profile,
    isTeacher: profile?.role === 'teacher',
    login,
    logout,
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