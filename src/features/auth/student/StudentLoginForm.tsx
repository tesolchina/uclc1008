import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ArrowLeft, KeyRound, LogIn } from 'lucide-react';
import { validateStudentIdFormat } from '../utils/studentId';
import { AUTH_ERROR_MESSAGES } from '../constants';
import { useAuth } from '../context/AuthContext';

interface StudentLoginFormProps {
  onBack: () => void;
  onSwitchToRegister: () => void;
}

export function StudentLoginForm({ onBack, onSwitchToRegister }: StudentLoginFormProps) {
  const navigate = useNavigate();
  const { loginAsStudent } = useAuth();
  const [digits, setDigits] = useState('');
  const [initials, setInitials] = useState('');
  const [suffix, setSuffix] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const initialsRef = useRef<HTMLInputElement>(null);
  const suffixRef = useRef<HTMLInputElement>(null);

  const handleDigitsChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setDigits(cleaned);
    if (cleaned.length === 4) {
      initialsRef.current?.focus();
    }
  };

  const handleInitialsChange = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 2);
    setInitials(cleaned);
    if (cleaned.length === 2) {
      suffixRef.current?.focus();
    }
  };

  const handleSuffixChange = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 2);
    setSuffix(cleaned);
  };

  const getFullId = () => {
    if (digits && initials && suffix) {
      return `${digits}-${initials}-${suffix}`;
    }
    return '';
  };

  const handleLogin = () => {
    setError(null);
    const fullId = getFullId();
    
    if (!validateStudentIdFormat(fullId)) {
      setError(AUTH_ERROR_MESSAGES.invalid_id_format);
      return;
    }
    
    loginAsStudent(fullId.toUpperCase());
    setSuccess('Welcome back! Logging you in...');
    
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const isComplete = digits.length === 4 && initials.length === 2 && suffix.length === 2;

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
                Enter your unique ID in the boxes below
              </p>
              <p className="text-xs text-amber-600">
                ⚠️ The last 2 characters are random — don't enter "XX"
              </p>
            </div>
            
            {/* Segmented input boxes */}
            <div className="flex items-center justify-center gap-2">
              {/* 4 digits */}
              <Input
                type="text"
                inputMode="numeric"
                value={digits}
                onChange={(e) => handleDigitsChange(e.target.value)}
                className="text-center text-2xl tracking-wider font-mono h-14 w-24"
                placeholder="1234"
                maxLength={4}
                autoFocus
              />
              <span className="text-2xl font-bold text-muted-foreground">-</span>
              {/* 2 initials */}
              <Input
                ref={initialsRef}
                type="text"
                value={initials}
                onChange={(e) => handleInitialsChange(e.target.value)}
                className="text-center text-2xl tracking-wider font-mono h-14 w-16 uppercase"
                placeholder="JD"
                maxLength={2}
              />
              <span className="text-2xl font-bold text-muted-foreground">-</span>
              {/* 2 character suffix */}
              <Input
                ref={suffixRef}
                type="text"
                value={suffix}
                onChange={(e) => handleSuffixChange(e.target.value)}
                className="text-center text-2xl tracking-wider font-mono h-14 w-16 uppercase"
                placeholder="7X"
                maxLength={2}
              />
            </div>

            {/* Show assembled ID */}
            {isComplete && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Your ID:</p>
                <p className="text-xl font-mono font-bold text-primary">{getFullId()}</p>
              </div>
            )}

            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={!isComplete}
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
