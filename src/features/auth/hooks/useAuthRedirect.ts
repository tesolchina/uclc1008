import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UseAuthRedirectOptions {
  redirectTo?: string;
  whenAuthenticated?: boolean;
}

/**
 * Hook for handling auth-based redirects
 */
export function useAuthRedirect({
  redirectTo = '/',
  whenAuthenticated = true,
}: UseAuthRedirectOptions = {}): { isLoading: boolean } {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (whenAuthenticated && isAuthenticated) {
        navigate(redirectTo);
      } else if (!whenAuthenticated && !isAuthenticated) {
        navigate(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, whenAuthenticated]);

  return { isLoading };
}
