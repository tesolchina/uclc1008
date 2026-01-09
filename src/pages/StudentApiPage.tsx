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
import { Loader2, Key, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

export default function StudentApiPage() {
  const { toast } = useToast();
  const { isAuthenticated, profile, accessToken, loginWithHkbu } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  
  // API status
  const [hasHkbuKey, setHasHkbuKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  
  // Form
  const [apiKey, setApiKey] = useState('');
  
  // Shared API status
  const [sharedApiEnabled, setSharedApiEnabled] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(50);
  const [usedToday, setUsedToday] = useState(0);

  const loadStatus = async () => {
    setIsLoading(true);
    try {
      // Check API status
      const { data: apiData } = await supabase.functions.invoke('check-api-status', {
        body: { accessToken },
      });
      
      if (apiData?.statuses) {
        const hkbuStatus = apiData.statuses.find((s: any) => s.provider === 'hkbu');
        setHasHkbuKey(hkbuStatus?.available ?? false);
        setMaskedKey(hkbuStatus?.maskedKey ?? null);
      }

      // Load shared API settings
      const { data: settings } = await supabase
        .from('system_settings')
        .select('key, value');

      if (settings) {
        for (const setting of settings) {
          if (setting.key === 'shared_api_enabled') {
            setSharedApiEnabled((setting.value as { enabled: boolean }).enabled ?? true);
          }
          if (setting.key === 'shared_api_daily_limit') {
            setDailyLimit((setting.value as { limit: number }).limit ?? 50);
          }
        }
      }

      // Load user's usage today (use browser session or student ID)
      const studentId = profile?.hkbu_user_id || localStorage.getItem('browser_session_id') || 'anonymous';
      const today = new Date().toISOString().split('T')[0];
      
      const { data: usageData } = await supabase
        .from('student_api_usage')
        .select('request_count')
        .eq('student_id', studentId)
        .eq('usage_date', today)
        .maybeSingle();

      setUsedToday(usageData?.request_count ?? 0);
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [accessToken, profile]);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        variant: 'destructive',
        title: 'Please enter your HKBU API key',
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke('save-api-key', {
        body: {
          provider: 'hkbu',
          apiKey: apiKey.trim(),
          accessToken,
        },
      });

      if (error) throw error;

      toast({ title: 'API key saved successfully' });
      setApiKey('');
      loadStatus();
    } catch (error) {
      console.error('Error saving key:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save API key',
      });
    } finally {
      setIsSaving(false);
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
          accessToken,
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

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            API Settings
          </p>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Tutor Configuration</h1>
        <p className="text-sm text-muted-foreground">
          Configure your HKBU API key to use the AI tutor in lessons.
        </p>
      </header>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your AI Status</CardTitle>
          <CardDescription>
            {hasHkbuKey 
              ? 'You have your own HKBU API key configured for unlimited access.'
              : sharedApiEnabled
                ? 'Using shared API with daily limits.'
                : 'No API access available.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {hasHkbuKey ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">HKBU API Key Active</p>
                  {maskedKey && (
                    <p className="text-xs text-muted-foreground font-mono">{maskedKey}</p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-auto"
                  onClick={handleRevokeKey}
                  disabled={isRevoking}
                >
                  {isRevoking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Remove'}
                </Button>
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

          {!hasHkbuKey && sharedApiEnabled && (
            <SharedApiUsageIndicator used={usedToday} limit={dailyLimit} />
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
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">HKBU API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your HKBU GenAI API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from the{' '}
                <a 
                  href="https://genai.hkbu.edu.hk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  HKBU GenAI Platform
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>

            <Button onClick={handleSaveKey} disabled={isSaving || !apiKey.trim()}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save API Key
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sign in prompt for additional features */}
      {!isAuthenticated && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Sign in with your HKBU account to sync your API key across devices.
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
