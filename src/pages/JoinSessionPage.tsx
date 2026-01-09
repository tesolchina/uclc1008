import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Users, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function JoinSessionPage() {
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [sessionCode, setSessionCode] = useState(code?.toUpperCase() || '');
  const [displayName, setDisplayName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{ title: string; lesson_id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(!!code);

  // If code is provided in URL, fetch session info
  useEffect(() => {
    if (code) {
      fetchSessionInfo(code.toUpperCase());
    }
  }, [code]);

  const fetchSessionInfo = async (codeToCheck: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('title, lesson_id, status')
        .eq('session_code', codeToCheck)
        .neq('status', 'ended')
        .single();

      if (error || !data) {
        toast({ title: 'Session not found', description: 'This session code is invalid or has ended.', variant: 'destructive' });
        setSessionInfo(null);
      } else {
        setSessionInfo({ title: data.title || 'Live Session', lesson_id: data.lesson_id });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    if (sessionCode.length !== 6) {
      toast({ title: 'Invalid code', description: 'Please enter a 6-character session code.', variant: 'destructive' });
      return;
    }

    setIsJoining(true);
    try {
      // First verify the session exists
      const { data: sessionData, error: sessionError } = await supabase
        .from('live_sessions')
        .select('lesson_id, status')
        .eq('session_code', sessionCode)
        .neq('status', 'ended')
        .single();

      if (sessionError || !sessionData) {
        toast({ title: 'Session not found', description: 'Check the code and try again.', variant: 'destructive' });
        return;
      }

      // Get or create student identifier
      let studentId = localStorage.getItem('studentIdentifier');
      if (!studentId) {
        studentId = `anon_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem('studentIdentifier', studentId);
      }

      // Store session code and display name for the lesson page to pick up
      sessionStorage.setItem('pendingSessionCode', sessionCode);
      if (displayName.trim()) {
        sessionStorage.setItem('pendingDisplayName', displayName.trim());
      }

      // Parse lesson ID to get week and lesson numbers
      const lessonId = sessionData.lesson_id;
      // Assuming lesson IDs like "lesson-1-1" or similar format
      const parts = lessonId.split('-');
      let weekId = '1';
      let lessonNum = lessonId;
      
      if (parts.length >= 3) {
        weekId = parts[1];
        lessonNum = `${parts[1]}-${parts[2]}`;
      }

      // Navigate to the lesson page
      navigate(`/week/${weekId}/lesson/${lessonNum}`, { 
        state: { 
          joinSession: true, 
          sessionCode, 
          displayName: displayName.trim() 
        } 
      });
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to join session.', variant: 'destructive' });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Join Live Session</CardTitle>
          <CardDescription>
            {sessionInfo 
              ? `You're joining: ${sessionInfo.title}`
              : 'Enter the session code provided by your teacher'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Code</label>
                <Input
                  placeholder="e.g. ABC123"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  className="font-mono text-2xl tracking-[0.5em] text-center h-14"
                  maxLength={6}
                  disabled={!!code && !!sessionInfo}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name (optional)</label>
                <Input
                  placeholder="How should you appear to the teacher?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  If left blank, your unique ID will be shown.
                </p>
              </div>

              <Button 
                onClick={handleJoin} 
                disabled={sessionCode.length !== 6 || isJoining}
                className="w-full h-12 text-lg"
              >
                {isJoining ? (
                  <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Joining...</>
                ) : (
                  <>Join Session <ArrowRight className="h-5 w-5 ml-2" /></>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground pt-2">
                By joining, you agree to share your progress with your teacher during this session.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
