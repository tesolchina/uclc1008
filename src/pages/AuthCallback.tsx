import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Handle legacy HKBU OAuth callback
    const token = searchParams.get('token');
    
    if (token) {
      // Store the session token for legacy HKBU OAuth
      localStorage.setItem('hkbu_session', token);
      navigate('/course_info');
    } else {
      // Normal Supabase auth callback - just redirect
      navigate('/course_info');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Completing sign in...</p>
    </div>
  );
}
