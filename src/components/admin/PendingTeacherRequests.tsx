import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, UserPlus, UserX, Mail, Calendar, Clock, 
  CheckCircle2, XCircle, ChevronDown, ChevronUp 
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface PendingRequest {
  id: string;
  email: string;
  display_name: string;
  sections: string[];
  status: string;
  created_at: string;
  admin_notes: string | null;
}

export function PendingTeacherRequests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(true);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pending_teacher_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (request: PendingRequest) => {
    const password = tempPassword[request.id];
    if (!password || password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Please enter a temporary password (at least 6 characters)',
      });
      return;
    }

    setProcessingId(request.id);
    try {
      // 1. Create the user account with Supabase Auth
      // Note: We'll use admin functions or edge function for this
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: request.email,
        password: password,
        options: {
          data: {
            display_name: request.display_name,
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create profile for the user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            hkbu_user_id: request.email.split('@')[0],
            email: request.email,
            display_name: request.display_name,
            role: 'teacher',
          });

        if (profileError && profileError.code !== '23505') {
          throw profileError;
        }

        // 3. Assign teacher role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            profile_id: authData.user.id,
            role: 'teacher',
          });

        if (roleError && roleError.code !== '23505') {
          throw roleError;
        }

        // 4. Assign sections
        if (request.sections.length > 0) {
          const sectionInserts = request.sections.map(section => ({
            teacher_id: authData.user!.id,
            section_number: section,
          }));

          const { error: sectionsError } = await supabase
            .from('teacher_sections')
            .insert(sectionInserts);

          if (sectionsError) {
            console.error('Error adding sections:', sectionsError);
          }
        }

        // 5. Update request status
        const { error: updateError } = await supabase
          .from('pending_teacher_requests')
          .update({
            status: 'approved',
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', request.id);

        if (updateError) throw updateError;

        toast({
          title: 'Teacher account created!',
          description: `Account for ${request.display_name} has been approved. Please share the password with them securely.`,
        });

        // Copy password to clipboard
        await navigator.clipboard.writeText(password);
        toast({
          title: 'Password copied to clipboard',
          description: 'Share this securely with the teacher.',
        });

        loadRequests();
      }
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to approve request',
        description: error.message || 'Please try again',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (request: PendingRequest) => {
    const confirmed = window.confirm(`Reject request from ${request.display_name}?`);
    if (!confirmed) return;

    setProcessingId(request.id);
    try {
      const { error } = await supabase
        .from('pending_teacher_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (error) throw error;

      toast({ title: 'Request rejected' });
      loadRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to reject request',
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending Teacher Requests ({requests.length})
                </CardTitle>
                <CardDescription>
                  Review and approve teacher access requests
                </CardDescription>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map(request => (
                  <div 
                    key={request.id} 
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium">{request.display_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {request.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Requested {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                        Pending
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-muted-foreground">Sections:</span>
                      {request.sections.map(section => (
                        <Badge key={section} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Input
                        type="text"
                        placeholder="Temporary password..."
                        className="flex-1 h-8 text-sm"
                        value={tempPassword[request.id] || ''}
                        onChange={(e) => setTempPassword(prev => ({
                          ...prev,
                          [request.id]: e.target.value
                        }))}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request)}
                        disabled={processingId === request.id || !tempPassword[request.id]}
                        className="gap-1"
                      >
                        {processingId === request.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <UserPlus className="h-3 w-3" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request)}
                        disabled={processingId === request.id}
                        className="gap-1 text-destructive hover:text-destructive"
                      >
                        <XCircle className="h-3 w-3" />
                        Reject
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Enter a temporary password. It will be copied to clipboard for you to share securely.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
