import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const error = searchParams.get('error');

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'no_code':
        return 'Authorization code not received. Please try again.';
      case 'config_error':
        return 'OAuth configuration error. Please contact support.';
      case 'token_exchange_failed':
        return 'Failed to complete authentication. Please try again.';
      case 'invalid_token':
        return 'Invalid authentication token received.';
      case 'profile_error':
        return 'Error creating user profile. Please try again.';
      case 'session_error':
        return 'Error creating session. Please try again.';
      case 'server_error':
        return 'Server error occurred. Please try again later.';
      default:
        return errorCode ? `Authentication error: ${errorCode}` : null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to AI-Assisted Learning Hub</CardTitle>
          <CardDescription>
            Sign in with your HKBU account to access course materials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getErrorMessage(error)}
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={login} 
            className="w-full" 
            size="lg"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with HKBU
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to access your course materials and submit assignments through this platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}