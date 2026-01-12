import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, AlertCircle, Loader2, GraduationCap, ShieldCheck, UserPlus, ArrowLeft, BookOpen, KeyRound } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type UserType = 'select' | 'teacher' | 'student';
type StudentMode = 'choose' | 'register' | 'login';

export default function AuthPage() {
  const { signIn, signUp, loginWithHkbu, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // User type selection
  const [userType, setUserType] = useState<UserType>('select');
  
  // Teacher auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  // Student state
  const [studentMode, setStudentMode] = useState<StudentMode>('choose');
  const [studentStep, setStudentStep] = useState(1);
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [firstInitial, setFirstInitial] = useState('');
  const [lastInitial, setLastInitial] = useState('');
  const [sectionNumber, setSectionNumber] = useState('');
  const [studentLoginId, setStudentLoginId] = useState('');

  const urlError = searchParams.get('error');

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setIsSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setIsSubmitting(false);

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(signInError.message);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (!displayName.trim()) {
        setError('Please enter your name');
        return;
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        return;
      }
    }

    setIsSubmitting(true);
    const { error: signUpError } = await signUp(email, password, displayName.trim());
    setIsSubmitting(false);

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(signUpError.message);
      }
    } else {
      setSuccess('Account created! You can now sign in.');
      setActiveTab('signin');
    }
  };

  // Student step navigation
  const handleStudentNext = () => {
    setError(null);
    
    if (studentStep === 1) {
      if (!/^\d{4}$/.test(lastFourDigits)) {
        setError('Please enter exactly 4 digits');
        return;
      }
      setStudentStep(2);
    } else if (studentStep === 2) {
      if (!/^[A-Za-z]$/.test(firstInitial) || !/^[A-Za-z]$/.test(lastInitial)) {
        setError('Please enter single letters for initials');
        return;
      }
      setStudentStep(3);
    }
  };

  const handleStudentComplete = () => {
    // Generate unique ID preview
    const uniqueId = `${lastFourDigits}-${firstInitial.toUpperCase()}${lastInitial.toUpperCase()}-XX`;
    setSuccess(`Your student ID will be: ${uniqueId}`);
    // TODO: Save to database and redirect to dashboard
  };

  const handleStudentLogin = () => {
    setError(null);
    // Validate format: 1234-JD-XX
    const idPattern = /^\d{4}-[A-Z]{2}-[A-Z0-9]{2}$/i;
    if (!idPattern.test(studentLoginId.toUpperCase())) {
      setError('Please enter a valid ID (format: 1234-JD-XX)');
      return;
    }
    // TODO: Verify ID exists in database and redirect
    setSuccess(`Welcome back! Logging you in...`);
  };

  const handleBack = () => {
    setError(null);
    setSuccess(null);
    
    if (userType === 'student') {
      if (studentMode !== 'choose') {
        if (studentMode === 'register' && studentStep > 1) {
          setStudentStep(studentStep - 1);
          return;
        }
        setStudentMode('choose');
        setStudentStep(1);
        return;
      }
    }
    setUserType('select');
    setStudentMode('choose');
    setStudentStep(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Role selection screen
  if (userType === 'select') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to UE1</CardTitle>
            <CardDescription>
              Select how you want to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Teacher/Staff option */}
            <button
              onClick={() => setUserType('teacher')}
              className="w-full p-6 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Teacher / Staff</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sign in or create an account to access teaching tools, student management, and course administration.
                  </p>
                </div>
              </div>
            </button>

            {/* Student option */}
            <button
              onClick={() => setUserType('student')}
              className="w-full p-6 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Student</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quick registration with your student ID. No email or password needed.
                  </p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Student flow - choose between register or login
  if (userType === 'student' && studentMode === 'choose') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-fit -ml-2 mb-2"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Student Access</CardTitle>
            <CardDescription className="text-center">
              Are you new or returning?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Returning student */}
            <button
              onClick={() => setStudentMode('login')}
              className="w-full p-5 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <KeyRound className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Welcome back!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    I already have my unique ID (e.g., 1234-JD-7X)
                  </p>
                </div>
              </div>
            </button>

            {/* New student */}
            <button
              onClick={() => setStudentMode('register')}
              className="w-full p-5 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">I'm new here</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Register with my student ID to get started
                  </p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Student login (returning)
  if (userType === 'student' && studentMode === 'login') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-fit -ml-2 mb-2"
              onClick={handleBack}
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
                onClick={handleStudentLogin}
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
              onClick={() => setStudentMode('register')}
            >
              I don't have an ID yet — Register now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Student registration flow
  if (userType === 'student' && studentMode === 'register') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-fit -ml-2 mb-2"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex justify-center mb-2">
              <div className="p-3 rounded-full bg-blue-100">
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Student Registration</CardTitle>
            <CardDescription className="text-center">
              Step {studentStep} of 3
            </CardDescription>
            {/* Progress bar */}
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    step <= studentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
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

            {/* Step 1: Last 4 digits */}
            {studentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Enter the last 4 digits of your Student ID</h3>
                  <p className="text-sm text-muted-foreground">
                    For example, if your ID is 21012345, enter "2345"
                  </p>
                </div>
                <div className="flex justify-center">
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={lastFourDigits}
                    onChange={(e) => setLastFourDigits(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-3xl tracking-[0.5em] font-mono w-48 h-16"
                    placeholder="0000"
                    autoFocus
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleStudentNext}
                  disabled={lastFourDigits.length !== 4}
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2: Initials */}
            {studentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Enter your initials</h3>
                  <p className="text-sm text-muted-foreground">
                    First letter of your first and last name
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <Label className="text-xs text-muted-foreground">First</Label>
                    <Input
                      type="text"
                      maxLength={1}
                      value={firstInitial}
                      onChange={(e) => setFirstInitial(e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase())}
                      className="text-center text-3xl font-mono w-16 h-16 uppercase"
                      placeholder="J"
                      autoFocus
                    />
                  </div>
                  <div className="text-center">
                    <Label className="text-xs text-muted-foreground">Last</Label>
                    <Input
                      type="text"
                      maxLength={1}
                      value={lastInitial}
                      onChange={(e) => setLastInitial(e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase())}
                      className="text-center text-3xl font-mono w-16 h-16 uppercase"
                      placeholder="D"
                    />
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleStudentNext}
                  disabled={!firstInitial || !lastInitial}
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 3: Section (optional) */}
            {studentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Which section are you in? (Optional)</h3>
                  <p className="text-sm text-muted-foreground">
                    e.g., A01, B02, C03
                  </p>
                </div>
                <div className="flex justify-center">
                  <Input
                    type="text"
                    maxLength={4}
                    value={sectionNumber}
                    onChange={(e) => setSectionNumber(e.target.value.toUpperCase())}
                    className="text-center text-2xl font-mono w-32 h-14 uppercase"
                    placeholder="A01"
                    autoFocus
                  />
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Your unique ID will be:</p>
                  <p className="text-2xl font-mono font-bold text-primary">
                    {lastFourDigits}-{firstInitial}{lastInitial}-XX
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    (XX will be generated randomly)
                  </p>
                </div>
                <Button className="w-full" onClick={handleStudentComplete}>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Complete Registration
                </Button>
                <Button variant="ghost" className="w-full" onClick={handleStudentComplete}>
                  Skip section, complete anyway
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Teacher auth flow
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit -ml-2 mb-2"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Teacher & Staff Portal</CardTitle>
          <CardDescription className="text-center">
            Sign in to access teaching tools and student management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {urlError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{getErrorMessage(urlError)}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-700">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="teacher@hkbu.edu.hk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4 mr-2" />
                  )}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Dr. Simon Wang"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="simonwang@hkbu.edu.hk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Create Account
                </Button>
              </form>
              <p className="text-xs text-muted-foreground text-center">
                New accounts start with basic access. Admin will assign teacher/admin roles.
              </p>
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={loginWithHkbu}
            disabled
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Sign in with HKBU (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
