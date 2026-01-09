import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, Pause, Square, Users, Send, Copy, 
  CheckCircle, XCircle, Clock, Eye, SkipForward,
  MessageSquare, Loader2, Target, ChevronLeft, ChevronRight,
  BarChart2
} from 'lucide-react';
import { useTeacherSession, SessionParticipant, SessionResponse } from '@/hooks/useLiveSession';
import { useToast } from '@/hooks/use-toast';
import { SessionQRCode } from './SessionQRCode';
import { Progress } from '@/components/ui/progress';

interface TeacherSessionPanelProps {
  lessonId: string;
  sections: string[];
  questionCounts: { mc: number; writing: number };
}

export function TeacherSessionPanel({ lessonId, sections, questionCounts }: TeacherSessionPanelProps) {
  const {
    session,
    participants,
    responses,
    isLoading,
    createSession,
    startSession,
    togglePause,
    endSession,
    updatePosition,
    sendPrompt,
    toggleAllowAhead,
  } = useTeacherSession(lessonId);

  const [promptMessage, setPromptMessage] = useState('');
  const { toast } = useToast();

  const copyCode = () => {
    if (session?.session_code) {
      navigator.clipboard.writeText(session.session_code);
      toast({ title: 'Copied!', description: 'Session code copied to clipboard' });
    }
  };

  const handleSendPrompt = async () => {
    if (!promptMessage.trim()) return;
    await sendPrompt('message', promptMessage);
    setPromptMessage('');
    toast({ title: 'Sent!', description: 'Message sent to all students' });
  };

  const onlineCount = participants.filter(p => p.is_online).length;

  // Parse current position from session
  const currentQuestionType = session?.current_section || 'notes';
  const currentQuestionIndex = session?.current_question_index || 0;

  // Get response stats for current question
  const getResponseStats = useCallback((type: string, index: number) => {
    const questionResponses = responses.filter(
      r => r.question_type === type && r.question_index === index
    );
    const correct = questionResponses.filter(r => r.is_correct === true).length;
    const incorrect = questionResponses.filter(r => r.is_correct === false).length;
    const pending = Math.max(0, participants.length - questionResponses.length);
    return { total: questionResponses.length, correct, incorrect, pending, responses: questionResponses };
  }, [responses, participants.length]);

  // Navigate to next/previous question
  const navigateQuestion = async (direction: 'prev' | 'next') => {
    let newType = currentQuestionType;
    let newIndex = currentQuestionIndex;

    if (direction === 'next') {
      if (currentQuestionType === 'notes') {
        newType = 'mc';
        newIndex = 0;
      } else if (currentQuestionType === 'mc' && currentQuestionIndex < questionCounts.mc - 1) {
        newIndex = currentQuestionIndex + 1;
      } else if (currentQuestionType === 'mc') {
        newType = 'writing';
        newIndex = 0;
      } else if (currentQuestionType === 'writing' && currentQuestionIndex < questionCounts.writing - 1) {
        newIndex = currentQuestionIndex + 1;
      }
    } else {
      if (currentQuestionType === 'writing' && currentQuestionIndex > 0) {
        newIndex = currentQuestionIndex - 1;
      } else if (currentQuestionType === 'writing' && currentQuestionIndex === 0) {
        newType = 'mc';
        newIndex = questionCounts.mc - 1;
      } else if (currentQuestionType === 'mc' && currentQuestionIndex > 0) {
        newIndex = currentQuestionIndex - 1;
      } else if (currentQuestionType === 'mc' && currentQuestionIndex === 0) {
        newType = 'notes';
        newIndex = 0;
      }
    }

    await updatePosition(newType, newIndex);
    
    // Send focus prompt to students
    const questionLabel = newType === 'notes' 
      ? 'Lead-in Notes' 
      : newType === 'mc' 
        ? `MC Question ${newIndex + 1}` 
        : `Writing Task ${newIndex + 1}`;
    await sendPrompt('focus', `Now working on: ${questionLabel}`);
  };

  // Get current stats
  const currentStats = useMemo(() => {
    if (currentQuestionType === 'notes') return null;
    return getResponseStats(currentQuestionType === 'mc' ? 'mc' : 'open_ended', currentQuestionIndex);
  }, [currentQuestionType, currentQuestionIndex, getResponseStats]);

  if (!session) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Live Session
          </CardTitle>
          <CardDescription>
            Create a live session for students to join and follow along in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => createSession()} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Create Live Session
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Live Session
              <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                {session.status}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-widest">{session.session_code}</span>
              <Button variant="ghost" size="sm" className="h-6" onClick={copyCode}>
                <Copy className="h-3 w-3" />
              </Button>
              <SessionQRCode sessionCode={session.session_code} />
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {onlineCount} online
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Question Control */}
        {session.status === 'active' && (
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Current Focus
              </span>
              <Badge variant="default">
                {currentQuestionType === 'notes' 
                  ? 'Lead-in Notes' 
                  : currentQuestionType === 'mc'
                    ? `MC Q${currentQuestionIndex + 1}/${questionCounts.mc}`
                    : `Writing T${currentQuestionIndex + 1}/${questionCounts.writing}`}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateQuestion('prev')}
                disabled={currentQuestionType === 'notes'}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 flex gap-1 justify-center">
                {/* Question navigation dots */}
                <Button
                  variant={currentQuestionType === 'notes' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-6 w-6 p-0 text-xs"
                  onClick={() => updatePosition('notes', 0)}
                >
                  📖
                </Button>
                {Array.from({ length: questionCounts.mc }).map((_, i) => {
                  const stats = getResponseStats('mc', i);
                  const isActive = currentQuestionType === 'mc' && currentQuestionIndex === i;
                  return (
                    <Button
                      key={`mc-${i}`}
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={`h-6 w-6 p-0 text-xs ${
                        stats.total === participants.length && participants.length > 0
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : ''
                      }`}
                      onClick={() => updatePosition('mc', i)}
                    >
                      {i + 1}
                    </Button>
                  );
                })}
                <span className="text-muted-foreground px-1">|</span>
                {Array.from({ length: questionCounts.writing }).map((_, i) => {
                  const stats = getResponseStats('open_ended', i);
                  const isActive = currentQuestionType === 'writing' && currentQuestionIndex === i;
                  return (
                    <Button
                      key={`w-${i}`}
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={`h-6 w-6 p-0 text-xs ${
                        stats.total === participants.length && participants.length > 0
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : ''
                      }`}
                      onClick={() => updatePosition('writing', i)}
                    >
                      W{i + 1}
                    </Button>
                  );
                })}
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateQuestion('next')}
                disabled={currentQuestionType === 'writing' && currentQuestionIndex === questionCounts.writing - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Current question response stats */}
            {currentStats && participants.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Responses: {currentStats.total}/{participants.length}</span>
                  {currentQuestionType === 'mc' && (
                    <span className="flex gap-2">
                      <span className="text-green-600">✓ {currentStats.correct}</span>
                      <span className="text-red-600">✗ {currentStats.incorrect}</span>
                    </span>
                  )}
                </div>
                <Progress 
                  value={(currentStats.total / participants.length) * 100} 
                  className="h-2"
                />
              </div>
            )}
          </div>
        )}

        {/* Session Controls */}
        <div className="flex gap-2 flex-wrap">
          {session.status === 'waiting' && (
            <Button size="sm" onClick={startSession}>
              <Play className="h-4 w-4 mr-1" /> Start
            </Button>
          )}
          {session.status === 'active' && (
            <Button size="sm" variant="secondary" onClick={togglePause}>
              <Pause className="h-4 w-4 mr-1" /> Pause
            </Button>
          )}
          {session.status === 'paused' && (
            <Button size="sm" onClick={togglePause}>
              <Play className="h-4 w-4 mr-1" /> Resume
            </Button>
          )}
          {session.status !== 'ended' && (
            <Button size="sm" variant="destructive" onClick={endSession}>
              <Square className="h-4 w-4 mr-1" /> End
            </Button>
          )}
          <Button 
            size="sm" 
            variant={session.allow_ahead ? 'default' : 'outline'} 
            onClick={toggleAllowAhead}
          >
            <SkipForward className="h-4 w-4 mr-1" />
            {session.allow_ahead ? 'Free Pace' : 'Locked Pace'}
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="dashboard" className="flex-1">
              <BarChart2 className="h-3 w-3 mr-1" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex-1">
              <Users className="h-3 w-3 mr-1" /> Students
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex-1">
              <MessageSquare className="h-3 w-3 mr-1" /> Prompt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-2">
            <ResponseDashboard 
              responses={responses}
              participants={participants}
              questionCounts={questionCounts}
              currentType={currentQuestionType}
              currentIndex={currentQuestionIndex}
            />
          </TabsContent>

          <TabsContent value="participants" className="mt-2">
            <ScrollArea className="h-48">
              {participants.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Waiting for students to join...
                </p>
              ) : (
                <div className="space-y-1">
                  {participants.map((p) => (
                    <ParticipantRow 
                      key={p.id} 
                      participant={p}
                      responses={responses.filter(r => r.participant_id === p.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="prompt" className="mt-2">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Send a message to all students..."
                  value={promptMessage}
                  onChange={(e) => setPromptMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                />
                <Button size="icon" onClick={handleSendPrompt}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => sendPrompt('focus', 'Please pay attention!')}>
                  Focus
                </Button>
                <Button size="sm" variant="outline" onClick={() => sendPrompt('timer', '2 minutes remaining')}>
                  2 min
                </Button>
                <Button size="sm" variant="outline" onClick={() => sendPrompt('timer', 'Time is up!')}>
                  Time up
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Response Dashboard Component
function ResponseDashboard({ 
  responses, 
  participants, 
  questionCounts,
  currentType,
  currentIndex
}: { 
  responses: SessionResponse[]; 
  participants: SessionParticipant[];
  questionCounts: { mc: number; writing: number };
  currentType: string;
  currentIndex: number;
}) {
  // Current question responses
  const currentResponses = responses.filter(
    r => r.question_type === (currentType === 'writing' ? 'open_ended' : currentType) && 
         r.question_index === currentIndex
  );

  if (currentType === 'notes') {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Students are viewing Lead-in Notes</p>
        <p className="text-xs mt-1">Navigate to a question to see responses</p>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Waiting for students to join...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {currentType === 'mc' ? `MC Question ${currentIndex + 1}` : `Writing Task ${currentIndex + 1}`}
        </span>
        <Badge variant="outline">
          {currentResponses.length}/{participants.length} responded
        </Badge>
      </div>

      <ScrollArea className="h-48">
        <div className="space-y-2">
          {currentResponses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No responses yet...
            </p>
          ) : (
            currentResponses.map((r) => {
              const participant = participants.find(p => p.id === r.participant_id);
              const responseValue = typeof r.response === 'object' && r.response !== null
                ? (r.response as Record<string, unknown>).answer || (r.response as Record<string, unknown>).text || JSON.stringify(r.response)
                : String(r.response);
              
              return (
                <div 
                  key={r.id} 
                  className={`p-2 rounded-lg border ${
                    currentType === 'mc' 
                      ? r.is_correct 
                        ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800'
                        : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">
                      {participant?.display_name || participant?.student_identifier?.slice(0, 8) || 'Unknown'}
                    </span>
                    {currentType === 'mc' && (
                      r.is_correct 
                        ? <CheckCircle className="h-3 w-3 text-green-600" />
                        : <XCircle className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {String(responseValue)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function ParticipantRow({ participant, responses }: { participant: SessionParticipant; responses: SessionResponse[] }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${participant.is_online ? 'bg-green-500' : 'bg-gray-300'}`} />
        <span className="text-sm font-mono">
          {participant.display_name || participant.student_identifier?.slice(0, 12)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {responses.length} answers
        </Badge>
        {participant.current_section && (
          <Badge variant="secondary" className="text-xs">
            {participant.current_section}
          </Badge>
        )}
      </div>
    </div>
  );
}
