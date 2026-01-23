import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, Play, Pause, StopCircle, Send, Eye, EyeOff, 
  Loader2, QrCode, Copy, CheckCircle2, Clock, 
  MessageSquare, PenLine, Radio, Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTeacherSession, useStudentSession } from '@/features/live-session';

// Types
interface LabTask {
  id: string;
  type: 'writing' | 'mcq' | 'poll';
  prompt: string;
  options?: string[]; // For MCQ/Poll
  timeLimit?: number; // seconds
  createdAt: string;
}

interface SpotlightResponse {
  participantId: string;
  displayName: string;
  response: string;
}

// ============ TEACHER VIEW ============
function TeacherLabView() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [sessionTitle, setSessionTitle] = useState('Lab Session');
  const [taskType, setTaskType] = useState<'writing' | 'mcq' | 'poll'>('writing');
  const [taskPrompt, setTaskPrompt] = useState('');
  const [taskOptions, setTaskOptions] = useState(['', '', '', '']);
  const [timeLimit, setTimeLimit] = useState(300); // 5 minutes default
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightResponse | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  
  // Previous sessions state
  const [previousSessions, setPreviousSessions] = useState<Array<{
    id: string;
    session_code: string;
    title: string | null;
    status: string;
    created_at: string;
    started_at: string | null;
  }>>([]);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(true);

  const {
    session,
    participants,
    responses,
    isLoading,
    isReconnecting,
    createSession,
    startSession,
    togglePause,
    endSession,
    sendPrompt,
    refreshResponses,
  } = useTeacherSession('lab-space');

  // Fetch previous/existing sessions for this teacher
  useEffect(() => {
    const fetchPreviousSessions = async () => {
      if (!user) return;
      
      setIsLoadingPrevious(true);
      try {
        const { data, error } = await supabase
          .from('live_sessions')
          .select('id, session_code, title, status, created_at, started_at')
          .eq('teacher_id', user.id)
          .eq('lesson_id', 'lab-space')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        setPreviousSessions(data || []);
      } catch (error) {
        console.error('Error fetching previous sessions:', error);
      } finally {
        setIsLoadingPrevious(false);
      }
    };

    fetchPreviousSessions();
  }, [user]);

  // Function to rejoin an existing session
  const handleRejoinSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      
      // The useTeacherSession hook will pick this up via realtime
      // We need to save to localStorage so the hook can reconnect
      if (data) {
        localStorage.setItem('live_session_state', JSON.stringify({
          sessionId: data.id,
          sessionCode: data.session_code,
          lessonId: 'lab-space',
          role: 'teacher',
          joinedAt: new Date().toISOString(),
        }));
        
        // Reload the page to trigger reconnection
        window.location.reload();
      }
    } catch (error) {
      console.error('Error rejoining session:', error);
      toast({ title: 'Error', description: 'Failed to rejoin session', variant: 'destructive' });
    }
  };

  const onlineParticipants = participants.filter(p => p.is_online);
  
  // Get responses for current task
  const currentResponses = responses.filter(
    r => r.question_type === 'lab_task' && r.question_index === currentTaskIndex
  );

  const handleCreateSession = async () => {
    await createSession(sessionTitle);
  };

  const handleSendTask = async () => {
    if (!taskPrompt.trim()) {
      toast({ title: 'Enter a task prompt', variant: 'destructive' });
      return;
    }

    const metadata: Record<string, unknown> = {
      taskIndex: currentTaskIndex,
      taskType,
      timeLimit,
    };

    if (taskType !== 'writing') {
      metadata.options = taskOptions.filter(o => o.trim());
    }

    await sendPrompt('focus', JSON.stringify({
      type: taskType,
      prompt: taskPrompt,
      options: taskType !== 'writing' ? taskOptions.filter(o => o.trim()) : undefined,
      timeLimit,
      taskIndex: currentTaskIndex,
    }), metadata);

    toast({ title: 'Task sent!', description: `Sent to ${onlineParticipants.length} students` });
    setCurrentTaskIndex(prev => prev + 1);
    setTaskPrompt('');
  };

  const handleSpotlight = (participantId: string) => {
    const response = currentResponses.find(r => r.participant_id === participantId);
    const participant = participants.find(p => p.id === participantId);
    
    if (response && participant) {
      const responseData = response.response as { text?: string; answer?: string };
      setSpotlight({
        participantId,
        displayName: participant.display_name || `Student ${participants.indexOf(participant) + 1}`,
        response: responseData.text || responseData.answer || JSON.stringify(responseData),
      });

      // Broadcast spotlight to all students
      sendPrompt('message', JSON.stringify({
        type: 'spotlight',
        displayName: participant.display_name || `Student ${participants.indexOf(participant) + 1}`,
        response: responseData.text || responseData.answer || '',
      }), { spotlight: true });
    }
  };

  const clearSpotlight = () => {
    setSpotlight(null);
    sendPrompt('message', JSON.stringify({ type: 'clear_spotlight' }), { spotlight: false });
  };

  const copyJoinLink = () => {
    if (session) {
      navigator.clipboard.writeText(`${window.location.origin}/lab?code=${session.session_code}`);
      toast({ title: 'Link copied!' });
    }
  };

  if (isReconnecting) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Reconnecting to session...</p>
        </div>
      </div>
    );
  }

  // Filter sessions: active ones and recent ended ones
  const activeSessions = previousSessions.filter(s => s.status !== 'ended');
  const recentSessions = previousSessions.filter(s => s.status === 'ended').slice(0, 5);

  // No session yet - show create screen with previous sessions
  if (!session) {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6">
        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Radio className="h-5 w-5 text-primary animate-pulse" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                You have sessions still in progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {activeSessions.map((s) => (
                <div 
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={s.status === 'active' ? 'default' : s.status === 'paused' ? 'secondary' : 'outline'}>
                      {s.status}
                    </Badge>
                    <div>
                      <p className="font-medium">{s.title || 'Lab Session'}</p>
                      <p className="text-xs text-muted-foreground">
                        Code: <span className="font-mono">{s.session_code}</span>
                        {' · '}
                        {new Date(s.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => handleRejoinSession(s.id)}>
                    <Play className="h-4 w-4 mr-2" /> Rejoin
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Create New Session */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <Radio className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Start a Lab Session</CardTitle>
            <CardDescription>
              Create a live session for students to join and work on tasks together
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Title</label>
              <Input
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="e.g., Paraphrasing Practice"
              />
            </div>
            <Button 
              onClick={handleCreateSession} 
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...</>
              ) : (
                <>Create New Session</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Past Sessions */}
        {recentSessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Sessions</CardTitle>
              <CardDescription>Your past lab sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentSessions.map((s) => (
                  <div 
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{s.title || 'Lab Session'}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-mono">{s.session_code}</span>
                        {' · '}
                        {new Date(s.created_at).toLocaleDateString()}
                        {s.started_at && ` · Started ${new Date(s.started_at).toLocaleTimeString()}`}
                      </p>
                    </div>
                    <Badge variant="outline">Ended</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {isLoadingPrevious && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    );
  }

  // Session exists - show control panel
  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card border rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-semibold text-lg">{session.title || 'Lab Session'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={session.status === 'active' ? 'default' : session.status === 'paused' ? 'secondary' : 'outline'}>
                {session.status}
              </Badge>
              <span className="font-mono text-lg tracking-wider">{session.session_code}</span>
              <Button variant="ghost" size="icon" onClick={copyJoinLink}>
                <Copy className="h-4 w-4" />
              </Button>
              <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join Session</DialogTitle>
                    <DialogDescription>
                      Scan to join or go to {window.location.origin}/lab
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center gap-4 py-4">
                    <QRCodeSVG 
                      value={`${window.location.origin}/lab?code=${session.session_code}`}
                      size={200}
                    />
                    <p className="font-mono text-3xl tracking-[0.5em]">{session.session_code}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
            <Users className="h-4 w-4" />
            <span className="font-medium">{onlineParticipants.length}</span>
            <span className="text-muted-foreground text-sm">online</span>
          </div>
          
          {session.status === 'waiting' && (
            <Button onClick={startSession}>
              <Play className="h-4 w-4 mr-2" /> Start
            </Button>
          )}
          {session.status === 'active' && (
            <Button onClick={togglePause} variant="secondary">
              <Pause className="h-4 w-4 mr-2" /> Pause
            </Button>
          )}
          {session.status === 'paused' && (
            <Button onClick={togglePause}>
              <Play className="h-4 w-4 mr-2" /> Resume
            </Button>
          )}
          <Button onClick={endSession} variant="destructive">
            <StopCircle className="h-4 w-4 mr-2" /> End
          </Button>
        </div>
      </div>

      {/* Spotlight Display */}
      {spotlight && (
        <Card className="border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Spotlight: {spotlight.displayName}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={clearSpotlight}>
                <EyeOff className="h-4 w-4 mr-1" /> Hide
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg whitespace-pre-wrap">{spotlight.response}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task Creator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={taskType} onValueChange={(v) => setTaskType(v as typeof taskType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="writing">
                  <PenLine className="h-4 w-4 mr-1" /> Writing
                </TabsTrigger>
                <TabsTrigger value="mcq">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> MCQ
                </TabsTrigger>
                <TabsTrigger value="poll">
                  <MessageSquare className="h-4 w-4 mr-1" /> Poll
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2">
              <label className="text-sm font-medium">Task Prompt</label>
              <Textarea
                value={taskPrompt}
                onChange={(e) => setTaskPrompt(e.target.value)}
                placeholder={
                  taskType === 'writing' 
                    ? "Paraphrase the following sentence: ..." 
                    : taskType === 'mcq'
                    ? "Which of the following is correct?"
                    : "What do you think about...?"
                }
                rows={3}
              />
            </div>

            {(taskType === 'mcq' || taskType === 'poll') && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Options</label>
                {taskOptions.map((opt, i) => (
                  <Input
                    key={i}
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...taskOptions];
                      newOptions[i] = e.target.value;
                      setTaskOptions(newOptions);
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 300)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">seconds</span>
              </div>
              <Button onClick={handleSendTask} className="ml-auto">
                <Send className="h-4 w-4 mr-2" /> Send Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Response Dashboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Responses ({currentResponses.length}/{onlineParticipants.length})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={refreshResponses}>
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {currentResponses.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No responses yet. Send a task to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {currentResponses.map((response) => {
                    const participant = participants.find(p => p.id === response.participant_id);
                    const responseData = response.response as { text?: string; answer?: string };
                    const displayText = responseData.text || responseData.answer || JSON.stringify(responseData);
                    
                    return (
                      <div 
                        key={response.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer group"
                        onClick={() => handleSpotlight(response.participant_id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {participant?.display_name || `Student ${participants.indexOf(participant!) + 1}`}
                          </span>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                            <Eye className="h-3 w-3 mr-1" /> Spotlight
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {displayText}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Participants Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {participants.map((p, i) => (
              <div 
                key={p.id}
                className={`p-2 rounded-lg text-center text-sm ${
                  p.is_online ? 'bg-green-500/10 text-green-700' : 'bg-muted text-muted-foreground'
                }`}
              >
                <div className="font-medium truncate">
                  {p.display_name || `Student ${i + 1}`}
                </div>
                <div className="text-xs">
                  {p.is_online ? '● Online' : '○ Offline'}
                </div>
              </div>
            ))}
            {participants.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-4">
                Waiting for students to join...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ STUDENT VIEW ============
function StudentLabView() {
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [currentTask, setCurrentTask] = useState<LabTask | null>(null);
  const [response, setResponse] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [spotlight, setSpotlight] = useState<SpotlightResponse | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [liveSessions, setLiveSessions] = useState<Array<{
    id: string;
    session_code: string;
    title: string | null;
    status: string;
    created_at: string;
  }>>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [joiningSessionId, setJoiningSessionId] = useState<string | null>(null);

  // Get student identifier
  const studentId = localStorage.getItem('studentIdentifier') || 
    (() => {
      const id = `anon_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem('studentIdentifier', id);
      return id;
    })();

  const {
    session,
    participant,
    latestPrompt,
    isJoining,
    isReconnecting,
    joinSession,
    leaveSession,
    submitResponse,
    dismissPrompt,
  } = useStudentSession(studentId);

  // Fetch live sessions
  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoadingSessions(true);
      const { data, error } = await supabase
        .from('live_sessions')
        .select('id, session_code, title, status, created_at')
        .in('status', ['waiting', 'active', 'paused'])
        .eq('session_type', 'lab-space')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setLiveSessions(data);
      }
      setIsLoadingSessions(false);
    };

    if (!session) {
      fetchSessions();
      // Refresh every 5 seconds
      const interval = setInterval(fetchSessions, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // Process incoming prompts
  useEffect(() => {
    if (latestPrompt) {
      try {
        const data = JSON.parse(latestPrompt.content);
        
        if (data.type === 'spotlight') {
          setSpotlight({
            participantId: '',
            displayName: data.displayName,
            response: data.response,
          });
        } else if (data.type === 'clear_spotlight') {
          setSpotlight(null);
        } else if (data.type) {
          // It's a task
          setCurrentTask({
            id: latestPrompt.id,
            type: data.type,
            prompt: data.prompt,
            options: data.options,
            timeLimit: data.timeLimit,
            createdAt: latestPrompt.created_at,
          });
          setResponse('');
          setSelectedOption(null);
          setTimeRemaining(data.timeLimit || null);
        }
        
        dismissPrompt();
      } catch (e) {
        console.error('Error parsing prompt:', e);
      }
    }
  }, [latestPrompt, dismissPrompt]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => (prev !== null && prev > 0) ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleJoinSession = async (sessionToJoin: typeof liveSessions[0]) => {
    setJoiningSessionId(sessionToJoin.id);
    await joinSession(sessionToJoin.session_code, displayName || undefined);
    setJoiningSessionId(null);
  };

  const handleSubmit = async () => {
    if (!currentTask || !participant) return;
    
    setIsSubmitting(true);
    try {
      const responseData = currentTask.type === 'writing' 
        ? { text: response }
        : { answer: selectedOption !== null ? currentTask.options?.[selectedOption] : '' };
      
      await submitResponse(
        'lab_task',
        parseInt(currentTask.id.split('-').pop() || '0'),
        responseData
      );
      
      toast({ title: 'Response submitted!' });
      setResponse('');
      setSelectedOption(null);
    } catch (e) {
      toast({ title: 'Error submitting', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isReconnecting) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Reconnecting to session...</p>
        </div>
      </div>
    );
  }

  // Not joined yet - show list of live sessions
  if (!session) {
    return (
      <div className="max-w-xl mx-auto py-8 space-y-6">
        {/* Display name input */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium">Your Display Name</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How should you appear? (optional)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live sessions list */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-primary animate-pulse" />
                  Live Sessions
                </CardTitle>
                <CardDescription>
                  Join an active session from your teacher
                </CardDescription>
              </div>
              {isLoadingSessions && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingSessions && liveSessions.length === 0 ? (
              <div className="py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-3" />
                <p className="text-muted-foreground">Looking for live sessions...</p>
              </div>
            ) : liveSessions.length === 0 ? (
              <div className="py-8 text-center">
                <Radio className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-medium mb-1">No Live Sessions</h3>
                <p className="text-muted-foreground text-sm">
                  Ask your teacher to start a session.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {liveSessions.map((s) => (
                  <div 
                    key={s.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold">{s.title || 'Lab Session'}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge 
                          variant={s.status === 'active' ? 'default' : s.status === 'waiting' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {s.status === 'waiting' ? 'Starting soon' : s.status}
                        </Badge>
                        <span className="text-muted-foreground">
                          Started {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleJoinSession(s)}
                      disabled={isJoining || joiningSessionId === s.id}
                    >
                      {joiningSessionId === s.id ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Joining...</>
                      ) : (
                        'Join'
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // In session - show task view
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Session Header */}
      <div className="flex items-center justify-between bg-card border rounded-lg p-4">
        <div>
          <h2 className="font-semibold">{session.title || 'Lab Session'}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
              {session.status}
            </Badge>
            <span>Code: {session.session_code}</span>
          </div>
        </div>
        <Button variant="outline" onClick={leaveSession}>
          Leave
        </Button>
      </div>

      {/* Spotlight Display */}
      {spotlight && (
        <Card className="border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Featured Response: {spotlight.displayName}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg whitespace-pre-wrap">{spotlight.response}</p>
          </CardContent>
        </Card>
      )}

      {/* Current Task */}
      {currentTask ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {currentTask.type === 'writing' && <PenLine className="h-5 w-5" />}
                {currentTask.type === 'mcq' && <CheckCircle2 className="h-5 w-5" />}
                {currentTask.type === 'poll' && <MessageSquare className="h-5 w-5" />}
                Task
              </CardTitle>
              {timeRemaining !== null && timeRemaining > 0 && (
                <Badge variant="outline" className="text-lg">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{currentTask.prompt}</p>

            {currentTask.type === 'writing' ? (
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={5}
                className="text-base"
              />
            ) : (
              <div className="space-y-2">
                {currentTask.options?.map((option, i) => (
                  <Button
                    key={i}
                    variant={selectedOption === i ? 'default' : 'outline'}
                    className="w-full justify-start h-auto py-3 px-4"
                    onClick={() => setSelectedOption(i)}
                  >
                    <span className="font-mono mr-3">{String.fromCharCode(65 + i)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            )}

            <Button 
              onClick={handleSubmit}
              disabled={
                isSubmitting || 
                (currentTask.type === 'writing' && !response.trim()) ||
                (currentTask.type !== 'writing' && selectedOption === null)
              }
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...</>
              ) : (
                'Submit Response'
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Radio className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Waiting for Task</h3>
            <p className="text-muted-foreground">
              Your teacher will send a task shortly. Stay tuned!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============ MAIN PAGE ============
export default function LabSpacePage() {
  const { isTeacher, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Radio className="h-8 w-8 text-primary" />
          Lab Space
        </h1>
        <p className="text-muted-foreground mt-1">
          {isTeacher || isAdmin 
            ? 'Create live sessions and send tasks to students in real-time'
            : 'Join live sessions and work on tasks with your classmates'
          }
        </p>
      </div>

      {isTeacher || isAdmin ? <TeacherLabView /> : <StudentLabView />}
    </div>
  );
}
