import { useState, useCallback, useEffect } from 'react';
import { getStoredStudentId, setStoredStudentId, clearStoredStudentId } from '../utils/studentId';

interface UseStudentIdReturn {
  studentId: string | null;
  isLoggedIn: boolean;
  login: (id: string) => void;
  logout: () => void;
  refresh: () => void;
}

/**
 * Hook for managing student ID state and localStorage
 */
export function useStudentId(): UseStudentIdReturn {
  const [studentId, setStudentId] = useState<string | null>(() => getStoredStudentId());

  const refresh = useCallback(() => {
    setStudentId(getStoredStudentId());
  }, []);

  const login = useCallback((id: string) => {
    setStoredStudentId(id);
    setStudentId(id.trim().toUpperCase());
  }, []);

  const logout = useCallback(() => {
    clearStoredStudentId();
    setStudentId(null);
  }, []);

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'student_id') {
        setStudentId(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    studentId,
    isLoggedIn: !!studentId,
    login,
    logout,
    refresh,
  };
}
