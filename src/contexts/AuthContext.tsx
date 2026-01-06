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

interface Session {
  profileId: string;
  sessionId?: string;
  accessToken?: string;
  expiresAt: string;
}

interface AuthContextType {
  profile: Profile | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isTeacher: boolean;
  login: () => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const storedToken = localStorage.getItem('hkbu_session');
    if (!storedToken) {
      setProfile(null);
      setAccessToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const rawSession = JSON.parse(atob(storedToken)) as Session;

      // Check if session is expired (based on the session token payload)
      if (new Date(rawSession.expiresAt) < new Date()) {
        localStorage.removeItem('hkbu_session');
        setProfile(null);
        setAccessToken(null);
        setIsLoading(false);
        return;
      }

      // Ensure we have an HKBU access token.
      // Older sessions may not include it; if missing, recover it from the backend using sessionId+profileId.
      let token: string | null = rawSession.accessToken ?? null;

      if (!token && rawSession.sessionId) {
        const { data } = await supabase.functions.invoke('get-session-access-token', {
          body: {
            sessionId: rawSession.sessionId,
            profileId: rawSession.profileId,
          },
        });

        if (data?.accessToken) {
          token = data.accessToken as string;

          // Persist the recovered token so subsequent requests can sync keys.
          const updated = { ...rawSession, accessToken: token };
          localStorage.setItem('hkbu_session', btoa(JSON.stringify(updated)));
        }
      }

      setAccessToken(token);

      // Fetch profile from database
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', rawSession.profileId)
        .single();

      if (error || !profileData) {
        localStorage.removeItem('hkbu_session');
        setProfile(null);
        setAccessToken(null);
      } else {
        setProfile(profileData as Profile);
      }
    } catch {
      localStorage.removeItem('hkbu_session');
      setProfile(null);
      setAccessToken(null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = useCallback(() => {
    const returnUrl = window.location.href;
    window.location.href = `${SUPABASE_URL}/functions/v1/oauth-init?return_url=${encodeURIComponent(returnUrl)}`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hkbu_session');
    localStorage.removeItem('oauth_state');
    setProfile(null);
    setAccessToken(null);
  }, []);

  const value: AuthContextType = {
    profile,
    accessToken,
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