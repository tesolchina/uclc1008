import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store the session token
      localStorage.setItem('hkbu_session', token);
      
      // Refresh profile and redirect
      refreshProfile().then(() => {
        navigate('/');
      });
    } else {
      navigate('/auth?error=no_token');
    }
  }, [searchParams, navigate, refreshProfile]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Completing sign in...</p>
    </div>
  );
}