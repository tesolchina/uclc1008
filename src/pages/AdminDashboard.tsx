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
import { StudentApiUsageTable } from '@/components/admin/StudentApiUsageTable';
import { 
  Loader2, Settings, Users, Key, RefreshCw, Shield, 
  UserCheck, UserX, Mail, Calendar, ChevronRight 
} from 'lucide-react';

interface SystemSetting {
  key: string;
  value: Record<string, unknown>;
}

interface UsageStats {
  totalRequests: number;
  uniqueStudents: number;
  todayRequests: number;
}

interface TeacherProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  roles: string[];
}

function AdminDashboardContent() {
  const { toast } = useToast();
  const { profile, isAdmin } = useAuth();
  
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

  // Teachers list
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [pendingUsers, setPendingUsers] = useState<TeacherProfile[]>([]);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

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

      // Load all profiles with their roles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, display_name, created_at')
        .order('created_at', { ascending: false });

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('profile_id, role');

      if (profiles) {
        const roleMap = new Map<string, string[]>();
        userRoles?.forEach(ur => {
          const existing = roleMap.get(ur.profile_id) || [];
          existing.push(ur.role);
          roleMap.set(ur.profile_id, existing);
        });

        const allUsers: TeacherProfile[] = profiles.map(p => ({
          id: p.id,
          email: p.email,
          display_name: p.display_name,
          created_at: p.created_at,
          roles: roleMap.get(p.id) || ['student']
        }));

        // Separate teachers/admins from pending users
        const teachersList = allUsers.filter(u => 
          u.roles.includes('teacher') || u.roles.includes('admin')
        );
        const pendingList = allUsers.filter(u => 
          !u.roles.includes('teacher') && !u.roles.includes('admin')
        );

        setTeachers(teachersList);
        setPendingUsers(pendingList);
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

  const handleGrantTeacherRole = async (userId: string) => {
    if (!isAdmin) {
      toast({ variant: 'destructive', title: 'Only admins can assign roles' });
      return;
    }

    setUpdatingRole(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ profile_id: userId, role: 'teacher' });

      if (error) throw error;

      toast({ title: 'Teacher role granted successfully' });
      loadSettings();
    } catch (error: any) {
      console.error('Error granting role:', error);
      toast({
        variant: 'destructive',
        title: error.code === '23505' ? 'User already has this role' : 'Failed to grant role',
      });
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleRevokeTeacherRole = async (userId: string) => {
    if (!isAdmin) {
      toast({ variant: 'destructive', title: 'Only admins can revoke roles' });
      return;
    }

    const confirmed = window.confirm('Remove teacher role from this user?');
    if (!confirmed) return;

    setUpdatingRole(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('profile_id', userId)
        .eq('role', 'teacher');

      if (error) throw error;

      toast({ title: 'Teacher role revoked' });
      loadSettings();
    } catch (error) {
      console.error('Error revoking role:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to revoke role',
      });
    } finally {
      setUpdatingRole(null);
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
          Manage teachers, API settings, and system configuration.
        </p>
      </header>

      <Tabs defaultValue="teachers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teachers" className="gap-2">
            <Users className="h-4 w-4" />
            Teachers ({teachers.length})
          </TabsTrigger>
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

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Registered Teachers ({teachers.length})
              </CardTitle>
              <CardDescription>
                Users with teacher or admin access to the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teachers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No teachers registered yet</p>
              ) : (
                <div className="space-y-2">
                  {teachers.map(teacher => (
                    <div 
                      key={teacher.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{teacher.display_name || 'Unnamed'}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {teacher.email || 'No email'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Joined {new Date(teacher.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {teacher.roles.map(role => (
                          <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'}>
                            {role}
                          </Badge>
                        ))}
                        {isAdmin && !teacher.roles.includes('admin') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeTeacherRole(teacher.id)}
                            disabled={updatingRole === teacher.id}
                          >
                            {updatingRole === teacher.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <UserX className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Users (who signed up but don't have teacher role yet) */}
          {isAdmin && pendingUsers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Pending Users ({pendingUsers.length})
                </CardTitle>
                <CardDescription>
                  Users who have registered but don't have teacher access yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pendingUsers.slice(0, 20).map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{user.display_name || 'Unnamed'}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email || 'No email'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Registered {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">student</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGrantTeacherRole(user.id)}
                          disabled={updatingRole === user.id}
                        >
                          {updatingRole === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Grant Teacher
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingUsers.length > 20 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      Showing first 20 of {pendingUsers.length} pending users
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

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

          {/* Student API Usage Table */}
          <StudentApiUsageTable />

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
