import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Key, Users, RefreshCw, Sparkles, Server } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StudentApiInfo {
  student_id: string;
  display_name: string | null;
  has_own_key: boolean;
  requests_today: number;
  total_requests: number;
  tokens_today: number;
  total_tokens: number;
  last_active: string | null;
}

export function StudentApiUsageTable() {
  const [students, setStudents] = useState<StudentApiInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch all students with their API key status
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('student_id, display_name, hkbu_api_key')
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (studentsError) throw studentsError;

      // Fetch all API usage data
      const { data: usageData, error: usageError } = await supabase
        .from('student_api_usage')
        .select('student_id, request_count, total_tokens, usage_date');

      if (usageError) throw usageError;

      // Build usage maps
      const todayUsageMap = new Map<string, { requests: number; tokens: number }>();
      const totalUsageMap = new Map<string, { requests: number; tokens: number }>();
      const lastActiveMap = new Map<string, string>();

      usageData?.forEach(row => {
        // Total usage
        const existing = totalUsageMap.get(row.student_id) || { requests: 0, tokens: 0 };
        totalUsageMap.set(row.student_id, {
          requests: existing.requests + (row.request_count || 0),
          tokens: existing.tokens + (row.total_tokens || 0),
        });
        
        // Today's usage
        if (row.usage_date === today) {
          todayUsageMap.set(row.student_id, {
            requests: row.request_count || 0,
            tokens: row.total_tokens || 0,
          });
        }

        // Last active
        const existingDate = lastActiveMap.get(row.student_id);
        if (!existingDate || row.usage_date > existingDate) {
          lastActiveMap.set(row.student_id, row.usage_date);
        }
      });

      // Combine data
      const combined: StudentApiInfo[] = (studentsData || []).map(student => {
        const todayStats = todayUsageMap.get(student.student_id) || { requests: 0, tokens: 0 };
        const totalStats = totalUsageMap.get(student.student_id) || { requests: 0, tokens: 0 };
        
        return {
          student_id: student.student_id,
          display_name: student.display_name,
          has_own_key: !!student.hkbu_api_key,
          requests_today: todayStats.requests,
          total_requests: totalStats.requests,
          tokens_today: todayStats.tokens,
          total_tokens: totalStats.tokens,
          last_active: lastActiveMap.get(student.student_id) || null,
        };
      });

      // Sort: own key users first, then by total tokens
      combined.sort((a, b) => {
        if (a.has_own_key !== b.has_own_key) return a.has_own_key ? -1 : 1;
        return b.total_tokens - a.total_tokens;
      });

      setStudents(combined);
    } catch (error) {
      console.error('Error fetching student API data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const ownKeyCount = students.filter(s => s.has_own_key).length;
  const sharedApiCount = students.filter(s => !s.has_own_key).length;
  const totalTodayTokens = students.reduce((sum, s) => sum + s.tokens_today, 0);
  const totalAllTimeTokens = students.reduce((sum, s) => sum + s.total_tokens, 0);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4" />
              Student API Usage
            </CardTitle>
            <CardDescription>
              Track which students use their own HKBU API key vs shared platform API
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Own Key</span>
            </div>
            <p className="text-2xl font-bold mt-1">{ownKeyCount}</p>
            <p className="text-xs text-muted-foreground">students</p>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <Server className="h-4 w-4" />
              <span className="text-sm font-medium">Shared API</span>
            </div>
            <p className="text-2xl font-bold mt-1">{sharedApiCount}</p>
            <p className="text-xs text-muted-foreground">students</p>
          </div>
          <div className="p-3 bg-muted/50 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Today's Tokens</span>
            </div>
            <p className="text-2xl font-bold mt-1">{totalTodayTokens.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">all students</p>
          </div>
          <div className="p-3 bg-muted/50 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Key className="h-4 w-4" />
              <span className="text-sm font-medium">Total Tokens</span>
            </div>
            <p className="text-2xl font-bold mt-1">{totalAllTimeTokens.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">all time</p>
          </div>
        </div>

        {/* Table */}
        {students.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No students registered yet
          </p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>API Source</TableHead>
                  <TableHead className="text-right">Today Tokens</TableHead>
                  <TableHead className="text-right">Total Tokens</TableHead>
                  <TableHead className="text-right">Requests</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.slice(0, 50).map(student => (
                  <TableRow key={student.student_id}>
                    <TableCell className="font-mono text-xs">
                      {student.student_id.length > 12 
                        ? `${student.student_id.slice(0, 12)}...` 
                        : student.student_id}
                    </TableCell>
                    <TableCell>
                      {student.display_name || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      {student.has_own_key ? (
                        <Badge variant="default" className="gap-1 bg-green-600">
                          <Sparkles className="h-3 w-3" />
                          Own Key
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Server className="h-3 w-3" />
                          Shared
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {student.tokens_today.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {student.total_tokens.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {student.total_requests}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {student.last_active 
                        ? new Date(student.last_active).toLocaleDateString()
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {students.length > 50 && (
              <div className="p-2 text-center text-xs text-muted-foreground border-t">
                Showing first 50 of {students.length} students
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
