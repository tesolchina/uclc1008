import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { SharedApiUsageIndicator } from '@/components/api/SharedApiUsageIndicator';
import { Loader2, Settings, CheckCircle2, XCircle, ExternalLink, User, Key, AlertCircle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Get or create browser session ID for anonymous tracking
function getBrowserSessionId(): string {
  let id = localStorage.getItem('browser_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('browser_session_id', id);
  }
  return id;
}

// Get/set student ID from localStorage
function getStoredStudentId(): string {
  return localStorage.getItem('student_id') || '';
}

function setStoredStudentId(id: string): void {
  if (id.trim()) {
    localStorage.setItem('student_id', id.trim());
  } else {
    localStorage.removeItem('student_id');
  }
}

export default function SettingsPage() {
  const { toast } = useToast();
  const { isAuthenticated, profile, accessToken, loginWithHkbu } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [isSavingId, setIsSavingId] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  
  // Student ID
  const [studentId, setStudentId] = useState('');
  const [savedStudentId, setSavedStudentId] = useState('');
  
  // API status
  const [hasHkbuKey, setHasHkbuKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [keySource, setKeySource] = useState<string | null>(null);
  
  // Form
  const [apiKey, setApiKey] = useState('');
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Shared API status
  const [sharedApiEnabled, setSharedApiEnabled] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(50);
  const [usedToday, setUsedToday] = useState(0);
  
  // Token usage for own key
  const [tokenUsage, setTokenUsage] = useState<{
    todayTokens: number;
    totalTokens: number;
    todayRequests: number;
    totalRequests: number;
  }>({ todayTokens: 0, totalTokens: 0, todayRequests: 0, totalRequests: 0 });

  const loadStatus = async () => {
    setIsLoading(true);
    try {
      // Load stored student ID (sync, no await needed)
      const storedId = getStoredStudentId();
      setStudentId(storedId);
      setSavedStudentId(storedId);
      
      const effectiveStudentId = storedId || profile?.hkbu_user_id || getBrowserSessionId();
      const today = new Date().toISOString().split('T')[0];

      // Run all async operations in parallel
      const [apiResponse, settingsResponse, todayUsageResponse, allUsageResponse] = await Promise.all([
        supabase.functions.invoke('check-api-status', { body: { accessToken, studentId: effectiveStudentId } }),
        supabase.from('system_settings').select('key, value'),
        supabase
          .from('student_api_usage')
          .select('request_count, total_tokens')
          .eq('student_id', effectiveStudentId)
          .eq('usage_date', today)
          .maybeSingle(),
        supabase
          .from('student_api_usage')
          .select('request_count, total_tokens')
          .eq('student_id', effectiveStudentId),
      ]);

      // Process API status
      if (apiResponse.data?.statuses) {
        const hkbuStatus = apiResponse.data.statuses.find((s: any) => s.provider === 'hkbu');
        setHasHkbuKey(hkbuStatus?.available ?? false);
        setMaskedKey(hkbuStatus?.maskedKey ?? null);
        setKeySource(hkbuStatus?.source ?? null);
      }

      // Process settings
      if (settingsResponse.data) {
        for (const setting of settingsResponse.data) {
          if (setting.key === 'shared_api_enabled') {
            setSharedApiEnabled((setting.value as { enabled: boolean }).enabled ?? true);
          }
          if (setting.key === 'shared_api_daily_limit') {
            setDailyLimit((setting.value as { limit: number }).limit ?? 50);
          }
        }
      }

      // Process usage for shared API
      setUsedToday(todayUsageResponse.data?.request_count ?? 0);
      
      // Process token usage for own key
      const todayTokens = todayUsageResponse.data?.total_tokens ?? 0;
      const todayRequests = todayUsageResponse.data?.request_count ?? 0;
      const totalTokens = allUsageResponse.data?.reduce((sum: number, row: any) => sum + (row.total_tokens || 0), 0) ?? 0;
      const totalRequests = allUsageResponse.data?.reduce((sum: number, row: any) => sum + (row.request_count || 0), 0) ?? 0;
      
      setTokenUsage({ todayTokens, totalTokens, todayRequests, totalRequests });
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [profile]);

  const handleSaveStudentId = () => {
    setIsSavingId(true);
    try {
      setStoredStudentId(studentId);
      setSavedStudentId(studentId);
      toast({ title: 'Student ID saved' });
      // Reload status to check if student has saved API key
      loadStatus();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to save Student ID' });
    } finally {
      setIsSavingId(false);
    }
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        variant: 'destructive',
        title: 'Please enter your HKBU API key',
      });
      return;
    }

    const effectiveStudentId = savedStudentId || profile?.hkbu_user_id;

    if (!effectiveStudentId) {
      toast({
        variant: 'destructive',
        title: 'Please set your Unique ID first',
        description: 'Your API key will be saved to your profile so you don\'t need to enter it again.',
      });
      return;
    }

    setIsSavingKey(true);
    setValidationStatus('validating');
    setValidationError(null);

    try {
      const { data, error } = await supabase.functions.invoke('save-api-key', {
        body: {
          provider: 'hkbu',
          apiKey: apiKey.trim(),
          studentId: effectiveStudentId,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to save API key');
      }

      if (data?.success && data?.validated) {
        setValidationStatus('success');
        toast({ 
          title: '✓ API key validated and saved!',
          description: 'Your key has been saved to your profile. You won\'t need to enter it again.',
        });
        setApiKey('');
        loadStatus();
      } else if (data?.error) {
        setValidationStatus('error');
        setValidationError(data.error);
        toast({
          variant: 'destructive',
          title: 'Invalid API Key',
          description: data.error,
        });
      }
    } catch (error: any) {
      console.error('Error saving key:', error);
      setValidationStatus('error');
      setValidationError(error.message || 'Failed to save API key');
      toast({
        variant: 'destructive',
        title: 'Failed to save API key',
        description: error.message,
      });
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleRevokeKey = async () => {
    const confirmed = window.confirm('Remove your HKBU API key? You will fall back to the shared API.');
    if (!confirmed) return;

    setIsRevoking(true);
    try {
      const { error } = await supabase.functions.invoke('revoke-api-key', {
        body: {
          provider: 'hkbu',
          studentId: savedStudentId,
        },
      });

      if (error) throw error;

      toast({ title: 'API key removed' });
      loadStatus();
    } catch (error) {
      console.error('Error revoking key:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to remove API key',
      });
    } finally {
      setIsRevoking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const studentIdChanged = studentId !== savedStudentId;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Settings
          </p>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Your Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure your student profile and AI tutor access.
        </p>
      </header>

      {/* Unique ID Section - Only show for anonymous users */}
      {!isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Your Unique ID
            </CardTitle>
            <CardDescription>
              This is <strong>not</strong> your student ID. Enter the unique anonymized ID assigned to you by your instructor, or create your own memorable code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Unique ID</Label>
              <div className="flex gap-2">
                <Input
                  id="studentId"
                  placeholder="e.g. bluefox42 or your assigned code"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="max-w-xs"
                />
                <Button 
                  onClick={handleSaveStudentId} 
                  disabled={isSavingId || !studentIdChanged}
                  variant={studentIdChanged ? "default" : "outline"}
                >
                  {isSavingId ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your progress and AI usage will be tracked under this ID. Keep it private and memorable.
              </p>
              {savedStudentId ? (
                <p className="text-xs text-muted-foreground">
                  Current ID: <span className="font-mono font-medium">{savedStudentId}</span>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Don't have an ID yet?{' '}
                  <a href="/auth" className="text-primary hover:underline font-medium">
                    Sign up here
                  </a>{' '}
                  to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Status Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" />
            AI Tutor Status
          </CardTitle>
          <CardDescription>
            {hasHkbuKey 
              ? keySource === 'student'
                ? 'You have your own HKBU API key saved to your profile.'
                : 'Using system HKBU API key.'
              : sharedApiEnabled
                ? 'Using shared API with daily limits. Add your own key for unlimited access.'
                : 'No API access available. Please add your HKBU key below.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {hasHkbuKey ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">HKBU API Key Active</p>
                  {maskedKey && (
                    <p className="text-xs text-muted-foreground font-mono">{maskedKey}</p>
                  )}
                  {keySource === 'student' && (
                    <Badge variant="secondary" className="mt-1 text-xs">Saved to your profile</Badge>
                  )}
                </div>
                {keySource === 'student' && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleRevokeKey}
                    disabled={isRevoking}
                  >
                    {isRevoking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Revoke Key'}
                  </Button>
                )}
              </>
            ) : sharedApiEnabled ? (
              <>
                <Badge variant="secondary" className="gap-1">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  Shared API
                </Badge>
                <span className="text-sm text-muted-foreground">Limited daily requests</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="text-sm">No API access - please add your HKBU key below</span>
              </>
            )}
          </div>

          {/* Token Usage for own key users */}
          {hasHkbuKey && keySource === 'student' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Today's Usage</p>
                <p className="text-lg font-bold">{tokenUsage.todayTokens.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">tokens ({tokenUsage.todayRequests} requests)</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Usage</p>
                <p className="text-lg font-bold">{tokenUsage.totalTokens.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">tokens ({tokenUsage.totalRequests} requests)</p>
              </div>
            </div>
          )}

          {!hasHkbuKey && sharedApiEnabled && (
            <SharedApiUsageIndicator used={usedToday} limit={dailyLimit} />
          )}

          {/* Reminder to set up HKBU API key */}
          {!hasHkbuKey && (
            <Alert className="border-blue-500/50 bg-blue-500/10">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                <strong>Tip:</strong> Add your HKBU API key below for unlimited AI tutor access.
                Your usage will be tracked here so you can monitor your token consumption.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Add HKBU Key */}
      {!hasHkbuKey && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Your HKBU API Key</CardTitle>
            <CardDescription>
              Get unlimited AI tutor access by adding your personal HKBU GenAI API key. 
              Your key will be validated and saved to your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!savedStudentId && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please set your Student ID above first. Your API key will be saved to your profile so you don't need to enter it again.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="apiKey">HKBU API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your HKBU GenAI API key"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setValidationStatus('idle');
                  setValidationError(null);
                }}
                disabled={!savedStudentId}
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from the{' '}
                <a 
                  href="https://genai.hkbu.edu.hk/settings/api-docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  HKBU GenAI Platform
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>

            {validationStatus === 'error' && validationError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {validationStatus === 'success' && (
              <Alert className="border-green-500 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  API key validated and saved successfully!
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleSaveKey} 
              disabled={isSavingKey || !apiKey.trim() || !savedStudentId}
            >
              {isSavingKey ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {validationStatus === 'validating' ? 'Validating...' : 'Saving...'}
                </>
              ) : (
                'Validate & Save API Key'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sign in prompt */}
      {!isAuthenticated && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Sign in with your HKBU account to sync settings across devices.
              </p>
              <Button variant="outline" onClick={loginWithHkbu}>
                Sign in with HKBU
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
