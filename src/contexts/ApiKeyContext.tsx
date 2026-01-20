import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ApiKeyStatus {
  hasPersonalKey: boolean;
  isLoading: boolean;
  studentId: string | null;
  sharedUsage: { used: number; limit: number } | null;
}

interface ApiKeyContextType extends ApiKeyStatus {
  refreshStatus: () => Promise<void>;
}

const ApiKeyContext = createContext<ApiKeyContextType | null>(null);

function getStoredStudentId(): string | null {
  try {
    return localStorage.getItem('ue1_student_id') || null;
  } catch {
    return null;
  }
}

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ApiKeyStatus>({
    hasPersonalKey: false,
    isLoading: true,
    studentId: null,
    sharedUsage: null,
  });

  const refreshStatus = useCallback(async () => {
    const studentId = getStoredStudentId();
    
    if (!studentId) {
      setStatus({
        hasPersonalKey: false,
        isLoading: false,
        studentId: null,
        sharedUsage: null,
      });
      return;
    }

    try {
      // Check if student has personal HKBU key
      const { data: studentRow } = await supabase
        .from('students')
        .select('hkbu_api_key')
        .eq('student_id', studentId)
        .maybeSingle();

      const hasPersonalKey = !!(studentRow?.hkbu_api_key);

      // Get shared API usage if no personal key
      let sharedUsage: { used: number; limit: number } | null = null;
      if (!hasPersonalKey) {
        const today = new Date().toISOString().split('T')[0];
        
        const [usageResult, settingsResult] = await Promise.all([
          supabase
            .from('student_api_usage')
            .select('request_count')
            .eq('student_id', studentId)
            .eq('usage_date', today)
            .maybeSingle(),
          supabase
            .from('system_settings')
            .select('key, value')
            .eq('key', 'shared_api_daily_limit')
            .maybeSingle(),
        ]);

        const used = usageResult.data?.request_count ?? 0;
        const limit = (settingsResult.data?.value as any)?.limit ?? 50;
        sharedUsage = { used, limit };
      }

      setStatus({
        hasPersonalKey,
        isLoading: false,
        studentId,
        sharedUsage,
      });
    } catch (error) {
      console.error('Error fetching API key status:', error);
      setStatus({
        hasPersonalKey: false,
        isLoading: false,
        studentId,
        sharedUsage: null,
      });
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  // Listen for storage changes (e.g., student ID changes)
  useEffect(() => {
    const handleStorageChange = () => {
      refreshStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also refresh on focus (in case settings changed in another tab)
    window.addEventListener('focus', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, [refreshStatus]);

  // Subscribe to real-time changes on the students table for this student
  useEffect(() => {
    const studentId = status.studentId;
    if (!studentId) return;

    const channel = supabase
      .channel(`api-key-status-${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students',
          filter: `student_id=eq.${studentId}`,
        },
        () => {
          refreshStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [status.studentId, refreshStatus]);

  return (
    <ApiKeyContext.Provider value={{ ...status, refreshStatus }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKeyStatus() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKeyStatus must be used within an ApiKeyProvider');
  }
  return context;
}
