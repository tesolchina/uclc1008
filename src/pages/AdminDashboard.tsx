import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Settings, Users, Key, RefreshCw, Shield } from 'lucide-react';

interface SystemSetting {
  key: string;
  value: Record<string, unknown>;
}

interface UsageStats {
  totalRequests: number;
  uniqueStudents: number;
  todayRequests: number;
}

function AdminDashboardContent() {
  const { toast } = useToast();
  const { profile } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Settings state
  const [sharedApiEnabled, setSharedApiEnabled] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(50);
  
  // Usage stats
  const [usageStats, setUsageStats] = useState<UsageStats>({
    totalRequests: 0,
    uniqueStudents: 0,
    todayRequests: 0,
  });

  // API status
  const [apiStatus, setApiStatus] = useState<{ hasKey: boolean; provider: string | null }>({
    hasKey: false,
    provider: null,
  });

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // Load system settings
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

      // Load usage stats
      const today = new Date().toISOString().split('T')[0];
      const { data: usageData } = await supabase
        .from('student_api_usage')
        .select('student_id, request_count, usage_date');

      if (usageData) {
        const totalRequests = usageData.reduce((sum, row) => sum + row.request_count, 0);
        const uniqueStudents = new Set(usageData.map(row => row.student_id)).size;
        const todayRequests = usageData
          .filter(row => row.usage_date === today)
          .reduce((sum, row) => sum + row.request_count, 0);
        
        setUsageStats({ totalRequests, uniqueStudents, todayRequests });
      }

      // Check API status
      const { data: apiData } = await supabase.functions.invoke('check-api-status');
      if (apiData?.statuses) {
        const hkbuStatus = apiData.statuses.find((s: any) => s.provider === 'hkbu');
        setApiStatus({
          hasKey: hkbuStatus?.available ?? false,
          provider: hkbuStatus?.available ? 'hkbu' : null,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load settings',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Update shared_api_enabled
      await supabase
        .from('system_settings')
        .update({ value: { enabled: sharedApiEnabled } })
        .eq('key', 'shared_api_enabled');

      // Update shared_api_daily_limit
      await supabase
        .from('system_settings')
        .update({ value: { limit: dailyLimit } })
        .eq('key', 'shared_api_daily_limit');

      toast({ title: 'Settings saved successfully' });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save settings',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetUsage = async () => {
    const confirmed = window.confirm('Reset all student API usage for today? This cannot be undone.');
    if (!confirmed) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await supabase
        .from('student_api_usage')
        .delete()
        .eq('usage_date', today);

      toast({ title: 'Usage reset successfully' });
      loadSettings();
    } catch (error) {
      console.error('Error resetting usage:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to reset usage',
      });
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
          <Shield className="h-5 w-5 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Admin Dashboard
          </p>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">System Administration</h1>
        <p className="text-sm text-muted-foreground">
          Manage API settings, view usage statistics, and configure system-wide options.
        </p>
      </header>

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            API Management
          </TabsTrigger>
          <TabsTrigger value="usage" className="gap-2">
            <Users className="h-4 w-4" />
            Usage Stats
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shared API Configuration</CardTitle>
              <CardDescription>
                Configure the fallback POE API for students without their own keys.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Shared API</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow students to use the shared POE API key
                  </p>
                </div>
                <Switch
                  checked={sharedApiEnabled}
                  onCheckedChange={setSharedApiEnabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dailyLimit">Daily Request Limit per Student</Label>
                <Input
                  id="dailyLimit"
                  type="number"
                  min={1}
                  max={500}
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(parseInt(e.target.value) || 50)}
                  className="w-32"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum AI requests per student per day when using shared API
                </p>
              </div>

              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">System API Status</CardTitle>
              <CardDescription>
                Current status of configured API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">HKBU API (Admin)</span>
                <Badge variant={apiStatus.hasKey ? 'default' : 'secondary'}>
                  {apiStatus.hasKey ? 'Configured' : 'Not configured'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">POE API (Shared Fallback)</span>
                <Badge variant="default">Available</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={loadSettings}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Today's Requests</CardDescription>
                <CardTitle className="text-3xl">{usageStats.todayRequests}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Requests (All Time)</CardDescription>
                <CardTitle className="text-3xl">{usageStats.totalRequests}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Unique Students</CardDescription>
                <CardTitle className="text-3xl">{usageStats.uniqueStudents}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Usage Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={handleResetUsage}>
                Reset Today's Usage
              </Button>
              <p className="text-xs text-muted-foreground">
                This will reset the daily request count for all students, allowing them to use the shared API again.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Logged in as</span>
                <span>{profile?.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Role</span>
                <Badge>{profile?.role}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <RoleGuard allowedRoles={['admin', 'teacher']}>
      <AdminDashboardContent />
    </RoleGuard>
  );
}
