import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Users, Play, Pause, StopCircle, Send, Eye, EyeOff, 
  Loader2, QrCode, Copy, CheckCircle2, Clock, 
  MessageSquare, PenLine, Radio, Sparkles, Bot, ChevronDown, ChevronUp, X, ArrowUp, Hand
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTeacherSession, useStudentSession } from '@/features/live-session';
import { useAIConversation } from '@/features/ai-live-class/hooks/useAIConversation';
import { useMessageQueue } from '@/features/ai-live-class/hooks/useMessageQueue';
import { DEFAULT_PROMPTS } from '@/features/ai-live-class/constants';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

// Types
interface LabTask {
  id: string;
  type: 'writing' | 'mcq' | 'poll';
  prompt: string;
  options?: string[]; // For MCQ/Poll
  timeLimit?: number; // seconds
  createdAt: string;
  taskIndex: number; // The index used for matching responses
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
  
  // Lab mode: 'tasks' for sending tasks, 'ai-chat' for AI Tutor conversation
  const [labMode, setLabMode] = useState<'tasks' | 'ai-chat'>('ai-chat');
  
  // AI Chat state
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const hasGreeted = useRef(false);
  
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

  // AI Conversation hook for AI Tutor chat
  const {
    messages,
    sendMessage: sendAIMessage,
    isGenerating,
    promoteMessage,
  } = useAIConversation({
    sessionId: session?.id || '',
    systemPrompt: DEFAULT_PROMPTS.ACADEMIC_GENERAL,
    userId: user?.id,
    persistMessages: true,
  });

  // Student message queue
  const [isQueueOpen, setIsQueueOpen] = useState(true);
  const {
    queue,
    pendingCount,
    promote: promoteQueueStatus,
    dismiss: dismissQueueMessage,
    isLoading: isQueueLoading,
  } = useMessageQueue({
    sessionId: session?.id || '',
  });

  // Handler for promoting a student question
  const handlePromoteQuestion = async (message: typeof queue[0]) => {
    // Add to AI conversation
    await promoteMessage({
      id: message.id,
      content: message.content,
      student_name: message.student_name,
      student_id: message.student_id,
      status: message.status,
      session_id: message.session_id || '',
      submitted_at: message.submitted_at || '',
      is_highlighted: message.is_highlighted || false,
      reviewed_at: message.reviewed_at || null,
      promoted_message_id: message.promoted_message_id || null,
    });
    // Update queue status
    await promoteQueueStatus(message.id);
  };

  // Auto-greet AI when session becomes active
  useEffect(() => {
    if (session?.status === 'active' && messages.length === 0 && !isGenerating && !hasGreeted.current && labMode === 'ai-chat') {
      hasGreeted.current = true;
      const greetingMessage = session.title 
        ? `Hi! Let's start our session on "${session.title}". I'm ready to assist with today's discussion.`
        : `Hi! Let's start our live session. I'm ready to help with any questions.`;
      sendAIMessage(greetingMessage, 'teacher');
    }
  }, [session?.status, session?.title, messages.length, isGenerating, labMode, sendAIMessage]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending chat message
  const handleSendChatMessage = () => {
    if (!chatInput.trim() || isGenerating) return;
    sendAIMessage(chatInput.trim(), 'teacher');
    setChatInput('');
  };
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

      {/* Mode Toggle */}
      <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg w-fit">
        <Button
          variant={labMode === 'ai-chat' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLabMode('ai-chat')}
          className="gap-2"
        >
          <Bot className="h-4 w-4" />
          AI Tutor Chat
        </Button>
        <Button
          variant={labMode === 'tasks' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLabMode('tasks')}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          Send Tasks
        </Button>
      </div>

      {/* AI Chat Mode */}
      {labMode === 'ai-chat' && (
        <div className="space-y-4">
          {/* Main Chat Area */}
          <Card className="flex flex-col" style={{ height: 'calc(100vh - 420px)', minHeight: '300px' }}>
            <CardHeader className="pb-2 flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Tutor Conversation
              </CardTitle>
              <CardDescription>
                Chat with the AI Tutor. Students in this session will see this conversation.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-4 pt-0">
              {/* Chat Messages */}
              <div 
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2"
              >
                {messages.length === 0 && !isGenerating && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Bot className="h-12 w-12 mb-4 text-primary/30" />
                    <p className="text-lg font-medium">Start a conversation with AI Tutor</p>
                    <p className="text-sm">
                      {session.status === 'active' 
                        ? "The AI will greet you shortly, or type a message to begin." 
                        : "Click 'Start' above to begin the session."}
                    </p>
                  </div>
                )}
                
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.author === 'teacher' ? 'justify-end' : msg.author === 'student' ? 'justify-start' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        msg.author === 'teacher'
                          ? 'bg-primary text-primary-foreground'
                          : msg.author === 'ai'
                          ? 'bg-muted border'
                          : 'bg-blue-500/10 border border-blue-500/30'
                      }`}
                    >
                      {msg.author === 'ai' && (
                        <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          AI Tutor
                        </div>
                      )}
                      {msg.author === 'student' && (
                        <div className="flex items-center gap-1 mb-1 text-xs text-blue-600">
                          <Hand className="h-3 w-3" />
                          Student Question: {msg.student_name || 'Student'}
                        </div>
                      )}
                      {msg.author === 'ai' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-muted border rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI is thinking...
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <div className="flex gap-2 flex-shrink-0">
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message to AI Tutor..."
                  className="resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChatMessage();
                    }
                  }}
                  disabled={session.status !== 'active'}
                />
                <Button 
                  onClick={handleSendChatMessage}
                  disabled={!chatInput.trim() || isGenerating || session.status !== 'active'}
                  size="icon"
                  className="h-auto"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Student Questions Queue */}
          <Collapsible open={isQueueOpen} onOpenChange={setIsQueueOpen}>
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-2 cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Hand className="h-5 w-5 text-blue-500" />
                      Student Questions
                      {pendingCount > 0 && (
                        <Badge variant="default" className="bg-blue-500 text-white">
                          {pendingCount} pending
                        </Badge>
                      )}
                    </CardTitle>
                    {isQueueOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <CardDescription>
                    Review and promote student questions to the AI conversation
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {isQueueLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : queue.filter(m => m.status === 'pending').length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No pending questions from students</p>
                      <p className="text-xs mt-1">Students can submit questions that appear here for review</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {queue
                          .filter(m => m.status === 'pending')
                          .map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex items-start gap-3 p-3 rounded-lg border bg-card ${
                                msg.is_highlighted ? 'border-amber-500 bg-amber-500/5' : ''
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-blue-600">
                                  {msg.student_name}
                                </p>
                                <p className="text-sm mt-1 text-foreground">
                                  {msg.content}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {msg.submitted_at && new Date(msg.submitted_at).toLocaleTimeString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => dismissQueueMessage(msg.id)}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handlePromoteQuestion(msg)}
                                  className="h-8 gap-1 bg-blue-500 hover:bg-blue-600"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                  Ask AI
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      )}

      {/* Tasks Mode */}
      {labMode === 'tasks' && (
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
      )}

      {/* Participants Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Participants ({onlineParticipants.length} online)</CardTitle>
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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<string>('');
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
  
  // AI Chat state for students
  const [aiMessages, setAiMessages] = useState<Array<{
    id: string;
    author: string;
    content: string;
    created_at: string;
    student_name?: string | null;
  }>>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Student question submission
  const [questionInput, setQuestionInput] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [myQuestions, setMyQuestions] = useState<Array<{
    id: string;
    content: string;
    status: string;
    submitted_at: string;
  }>>([]);

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
        .eq('lesson_id', 'lab-space')
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

  // Subscribe to AI conversation messages when in session
  useEffect(() => {
    if (!session?.id) return;

    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('ai_conversation_messages')
        .select('id, author, content, created_at, student_name')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });
      
      if (!error && data) {
        setAiMessages(data);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`ai-chat-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_conversation_messages',
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          const newMsg = payload.new as typeof aiMessages[0];
          setAiMessages(prev => [...prev, newMsg]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ai_conversation_messages',
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          const updatedMsg = payload.new as typeof aiMessages[0];
          setAiMessages(prev => 
            prev.map(m => m.id === updatedMsg.id ? updatedMsg : m)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id]);

  // Subscribe to my own questions
  useEffect(() => {
    if (!session?.id) return;

    // Fetch my existing questions
    const fetchMyQuestions = async () => {
      const { data, error } = await supabase
        .from('ai_message_queue')
        .select('id, content, status, submitted_at')
        .eq('session_id', session.id)
        .eq('student_id', studentId)
        .order('submitted_at', { ascending: false });
      
      if (!error && data) {
        setMyQuestions(data);
      }
    };

    fetchMyQuestions();

    // Subscribe to updates on my questions
    const channel = supabase
      .channel(`my-questions-${session.id}-${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_message_queue',
          filter: `session_id=eq.${session.id}`,
        },
        (payload) => {
          const msg = payload.new as typeof myQuestions[0] & { student_id: string };
          if (msg.student_id === studentId) {
            if (payload.eventType === 'INSERT') {
              setMyQuestions(prev => [msg, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setMyQuestions(prev => prev.map(q => q.id === msg.id ? msg : q));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id, studentId]);

  // Submit question handler
  const handleSubmitQuestion = useCallback(async () => {
    if (!session?.id || !questionInput.trim()) return;

    setIsSubmittingQuestion(true);
    try {
      const studentName = displayName || participant?.display_name || 'Student';
      
      const { error } = await supabase
        .from('ai_message_queue')
        .insert({
          session_id: session.id,
          student_id: studentId,
          student_name: studentName,
          content: questionInput.trim(),
          status: 'pending',
          submitted_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error submitting question:', error);
        toast({ title: 'Failed to submit question', variant: 'destructive' });
        return;
      }

      toast({ title: 'Question submitted!', description: 'Your teacher will review it.' });
      setQuestionInput('');
    } catch (err) {
      console.error('Error:', err);
      toast({ title: 'Failed to submit question', variant: 'destructive' });
    } finally {
      setIsSubmittingQuestion(false);
    }
  }, [session?.id, questionInput, studentId, displayName, participant?.display_name, toast]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [aiMessages]);

  // Process incoming prompts (for tasks)
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
            taskIndex: data.taskIndex ?? 0,
          });
          setResponse('');
          setSelectedOption(null);
          setHasSubmitted(false);
          setSubmittedResponse('');
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
      const submittedText = currentTask.type === 'writing' 
        ? response
        : (selectedOption !== null ? currentTask.options?.[selectedOption] : '') || '';
      
      const responseData = currentTask.type === 'writing' 
        ? { text: response }
        : { answer: submittedText };
      
      await submitResponse(
        'lab_task',
        currentTask.taskIndex,
        responseData
      );
      
      toast({ title: 'Response submitted!' });
      setSubmittedResponse(submittedText);
      setHasSubmitted(true);
      // Don't clear response so student can see what they submitted
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

  // In session - show AI chat and tasks
  return (
    <div className="max-w-3xl mx-auto space-y-4">
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

      {/* AI Chat - Live from teacher */}
      <Card className="flex flex-col" style={{ height: 'calc(100vh - 480px)', minHeight: '250px' }}>
        <CardHeader className="pb-2 flex-shrink-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-primary" />
            Live AI Tutor Conversation
          </CardTitle>
          <CardDescription>
            Watch the teacher's discussion with the AI Tutor in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-4 pt-0">
          <div 
            ref={chatScrollRef}
            className="h-full overflow-y-auto space-y-4 pr-2"
          >
            {aiMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="h-12 w-12 mb-4 text-primary/30" />
                <p className="text-lg font-medium">Waiting for conversation to start</p>
                <p className="text-sm">
                  The teacher will begin chatting with the AI Tutor shortly.
                </p>
              </div>
            ) : (
              aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.author === 'teacher' ? 'justify-end' : msg.author === 'student' ? 'justify-start' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-3 ${
                      msg.author === 'teacher'
                        ? 'bg-primary/10 border border-primary/20'
                        : msg.author === 'ai'
                        ? 'bg-muted border'
                        : 'bg-blue-500/10 border border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                      {msg.author === 'ai' ? (
                        <>
                          <Sparkles className="h-3 w-3" />
                          AI Tutor
                        </>
                      ) : msg.author === 'student' ? (
                        <span className="text-blue-600">
                          <Hand className="h-3 w-3 inline mr-1" />
                          Student Question: {msg.student_name || 'Student'}
                        </span>
                      ) : (
                        <>
                          <Users className="h-3 w-3" />
                          Teacher
                        </>
                      )}
                    </div>
                    {msg.author === 'ai' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Submission */}
      <Card className="border-blue-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Hand className="h-5 w-5 text-blue-500" />
            Ask a Question
          </CardTitle>
          <CardDescription>
            Submit a question for the teacher to share with the AI Tutor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="Type your question here..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitQuestion();
                }
              }}
              disabled={session.status !== 'active' || isSubmittingQuestion}
            />
            <Button
              onClick={handleSubmitQuestion}
              disabled={!questionInput.trim() || session.status !== 'active' || isSubmittingQuestion}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isSubmittingQuestion ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* My submitted questions */}
          {myQuestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Your Questions:</p>
              {myQuestions.slice(0, 3).map((q) => (
                <div key={q.id} className="flex items-center gap-2 text-sm p-2 rounded bg-muted/50">
                  <Badge 
                    variant={q.status === 'promoted' ? 'default' : q.status === 'dismissed' ? 'secondary' : 'outline'}
                    className={q.status === 'promoted' ? 'bg-green-500' : q.status === 'dismissed' ? 'bg-muted' : ''}
                  >
                    {q.status === 'promoted' ? '✓ Asked' : q.status === 'dismissed' ? 'Skipped' : 'Pending'}
                  </Badge>
                  <span className="truncate flex-1">{q.content}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Task (if any) */}
      {currentTask && (
        <Card className={hasSubmitted ? "border-green-500/50 bg-green-500/5" : "border-amber-500/50 bg-amber-500/5"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {hasSubmitted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <>
                    {currentTask.type === 'writing' && <PenLine className="h-5 w-5" />}
                    {currentTask.type === 'mcq' && <CheckCircle2 className="h-5 w-5" />}
                    {currentTask.type === 'poll' && <MessageSquare className="h-5 w-5" />}
                  </>
                )}
                {hasSubmitted ? 'Response Submitted' : 'Task from Teacher'}
              </CardTitle>
              {!hasSubmitted && timeRemaining !== null && timeRemaining > 0 && (
                <Badge variant="outline" className="text-lg">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </Badge>
              )}
              {hasSubmitted && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Submitted
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{currentTask.prompt}</p>

            {hasSubmitted ? (
              <div className="bg-background border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Your response:</p>
                <p className="text-base whitespace-pre-wrap">{submittedResponse}</p>
              </div>
            ) : currentTask.type === 'writing' ? (
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={4}
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

            {!hasSubmitted && (
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
            )}
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
