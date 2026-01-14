import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ArrowLeft, KeyRound, LogIn } from 'lucide-react';
import { setStoredStudentId, validateStudentIdFormat } from '../utils/studentId';
import { AUTH_ERROR_MESSAGES } from '../constants';

interface StudentLoginFormProps {
  onBack: () => void;
  onSwitchToRegister: () => void;
}

export function StudentLoginForm({ onBack, onSwitchToRegister }: StudentLoginFormProps) {
  const navigate = useNavigate();
  const [studentLoginId, setStudentLoginId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    
    if (!validateStudentIdFormat(studentLoginId)) {
      setError(AUTH_ERROR_MESSAGES.invalid_id_format);
      return;
    }
    
    setStoredStudentId(studentLoginId.toUpperCase());
    setSuccess('Welcome back! Logging you in...');
    
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit -ml-2 mb-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-green-100">
              <KeyRound className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome Back!</CardTitle>
          <CardDescription className="text-center">
            Enter your unique ID to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-700">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Your unique ID looks like: <span className="font-mono font-medium">1234-JD-7X</span>
              </p>
            </div>
            <Input
              type="text"
              value={studentLoginId}
              onChange={(e) => setStudentLoginId(e.target.value.toUpperCase())}
              className="text-center text-2xl tracking-wider font-mono h-14"
              placeholder="1234-JD-XX"
              autoFocus
            />
            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={!studentLoginId}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Continue
            </Button>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            variant="ghost" 
            className="w-full"
            onClick={onSwitchToRegister}
          >
            I don't have an ID yet — Register now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
