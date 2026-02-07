import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useApiKeyStatus } from '@/contexts/ApiKeyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { SharedApiUsageIndicator } from '@/components/api/SharedApiUsageIndicator';
import { Loader2, Settings, CheckCircle2, XCircle, ExternalLink, User, Key, AlertCircle, Sparkles, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, accessToken, loginWithHkbu } = useAuth();
  const { refreshStatus: refreshGlobalApiStatus } = useApiKeyStatus();
  
  // Check if user is fully authenticated (OAuth login), not just student-only mode
  const isFullyAuthenticated = !!user && !!profile;
  
  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/student/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  
  // Student ID (for display only now)
  const [savedStudentId, setSavedStudentId] = useState('');
  
  // API status
  const [hasHkbuKey, setHasHkbuKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [keySource, setKeySource] = useState<string | null>(null);
  
  // Form
  const [apiKey, setApiKey] = useState('');
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  
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
  
  // If not authenticated, show loading while redirecting
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const loadStatus = async () => {
    setIsLoading(true);
    try {
      // Load stored student ID (sync, no await needed)
      const storedId = getStoredStudentId();
      setSavedStudentId(storedId);
      
      // For authenticated users, prioritize profile ID; for student-only, use stored ID or browser session
      const effectiveStudentId = profile?.hkbu_user_id || storedId || getBrowserSessionId();
      const today = new Date().toISOString().split('T')[0];

      // Run all async operations in parallel
      const apiResponsePromise = fetch('/api/check-api-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, studentId: effectiveStudentId }),
      }).then(r => r.ok ? r.json() : null).then(data => ({ data })).catch(() => ({ data: null }));

      const [apiResponse, settingsResponse, todayUsageResponse, allUsageResponse] = await Promise.all([
        apiResponsePromise,
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

  const handleConnectAndSave = async () => {
    if (!apiKey.trim()) {
      toast({
        variant: 'destructive',
        title: 'Please enter your HKBU API key',
      });
      return;
    }

    // Allow both fully authenticated and student-only sessions
    const effectiveStudentId = profile?.hkbu_user_id || savedStudentId || getStoredStudentId();

    if (!effectiveStudentId) {
      toast({
        variant: 'destructive',
        title: 'Student ID required',
        description: 'Please sign in first to save your API key.',
      });
      return;
    }

    setIsSavingKey(true);
    setValidationStatus('validating');
    setValidationError(null);

    try {
      // This will test and save in one call
      const saveResponse = await fetch('/api/save-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'hkbu',
          apiKey: apiKey.trim(),
          studentId: effectiveStudentId,
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to connect');
      }

      const data = await saveResponse.json();

      if (data?.success && data?.validated) {
        setValidationStatus('success');
        toast({ 
          title: '✓ Connected!',
          description: 'Your API key is valid and saved.',
        });
        setApiKey('');
        loadStatus();
        // Refresh global API key status
        refreshGlobalApiStatus();
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
      setValidationError(error.message || 'Failed to connect');
      toast({
        variant: 'destructive',
        title: 'Connection failed',
        description: error.message,
      });
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleRevokeKey = async () => {
    const confirmed = window.confirm('Remove your HKBU API key? You will fall back to the shared API.');
    if (!confirmed) return;

    // IMPORTANT: when signed in with HKBU, always prefer the HKBU user id.
    // savedStudentId is for student-only sessions and may not match the HKBU-linked record.
    const effectiveStudentId = profile?.hkbu_user_id || savedStudentId || getStoredStudentId() || getBrowserSessionId();

    setIsRevoking(true);
    try {
      const revokeResponse = await fetch('/api/revoke-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'hkbu',
          studentId: effectiveStudentId,
          accessToken: accessToken || undefined,
        }),
      });

      if (!revokeResponse.ok) {
        const errorData = await revokeResponse.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to revoke key');
      }

      const data = await revokeResponse.json();

      if (data?.warning) {
        toast({ 
          title: 'API key removed locally',
          description: data.warning,
        });
      } else {
        toast({ title: 'API key removed successfully' });
      }
      
      loadStatus();
      // Refresh global API key status
      refreshGlobalApiStatus();
    } catch (error) {
      console.error('Error revoking key:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to remove API key',
        description: error instanceof Error ? error.message : 'Unknown error',
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

      {/* Show current student ID */}
      {savedStudentId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Your Unique ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Logged in as: <span className="font-mono font-medium">{savedStudentId}</span>
            </p>
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
                  {keySource === 'hkbu_platform' && (
                    <Badge variant="outline" className="mt-1 text-xs">Synced from HKBU Platform</Badge>
                  )}
                </div>
                {/* Allow removing a student-saved key (OAuth or student-only) */}
                {keySource === 'student' && (profile?.hkbu_user_id || savedStudentId || getStoredStudentId()) && (
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleRevokeKey}
                    disabled={isRevoking}
                  >
                    {isRevoking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Remove Key'}
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

      {/* Add HKBU Key - For any authenticated user (OAuth or student-only) */}
      {(isAuthenticated || savedStudentId) && !hasHkbuKey && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4" />
              Add Your HKBU API Key
            </CardTitle>
            <CardDescription>
              Get unlimited AI tutor access by adding your personal HKBU GenAI API key.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Collapsible walkthrough */}
            <Collapsible open={showWalkthrough} onOpenChange={setShowWalkthrough}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    How to get your API key
                  </span>
                  {showWalkthrough ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                  <p className="text-sm font-medium">Step-by-step guide:</p>
                  <div className="aspect-video w-full rounded-md overflow-hidden border">
                    <iframe 
                      src="https://scribehow.com/embed/Generate_an_API_Key_for_AI_Tutor__GPd3vfdkR6mghvEFGAHeog"
                      width="100%" 
                      height="100%" 
                      allowFullScreen
                      className="border-0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Or visit{' '}
                    <a 
                      href="https://genai.hkbu.edu.hk/settings/api-docs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      genai.hkbu.edu.hk/settings/api-docs
                    </a>{' '}
                    directly
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>

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
              />
              <p className="text-xs text-muted-foreground">
                Your key will be securely stored and used only for AI tutor requests.
              </p>
            </div>

            {validationStatus === 'error' && validationError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleConnectAndSave} 
              disabled={isSavingKey || !apiKey.trim()}
              className="w-full"
            >
              {isSavingKey ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Connect & Save
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Prompt for completely anonymous users to set up ID first */}
      {!isAuthenticated && !savedStudentId && !hasHkbuKey && (
        <Card className="border-dashed border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4" />
              HKBU API Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                <strong>Set up required:</strong> Please enter your Unique ID above first, 
                then you can add your HKBU API key for unlimited AI tutor access.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
