import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, Pause, Square, Users, Send, Copy, 
  CheckCircle, XCircle, Clock, Eye, SkipForward,
  MessageSquare, Loader2
} from 'lucide-react';
import { useTeacherSession, SessionParticipant, SessionResponse } from '@/hooks/useLiveSession';
import { useToast } from '@/hooks/use-toast';

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

  // Get response stats for current question
  const getResponseStats = (type: string, index: number) => {
    const questionResponses = responses.filter(
      r => r.question_type === type && r.question_index === index
    );
    const correct = questionResponses.filter(r => r.is_correct === true).length;
    const incorrect = questionResponses.filter(r => r.is_correct === false).length;
    const pending = participants.length - questionResponses.length;
    return { total: questionResponses.length, correct, incorrect, pending };
  };

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
            <CardDescription className="mt-1">
              <span className="font-mono text-lg font-bold tracking-widest">{session.session_code}</span>
              <Button variant="ghost" size="sm" className="h-6 ml-2" onClick={copyCode}>
                <Copy className="h-3 w-3" />
              </Button>
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

        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="participants" className="flex-1">
              <Users className="h-3 w-3 mr-1" /> Participants
            </TabsTrigger>
            <TabsTrigger value="responses" className="flex-1">
              <Eye className="h-3 w-3 mr-1" /> Responses
            </TabsTrigger>
            <TabsTrigger value="prompt" className="flex-1">
              <MessageSquare className="h-3 w-3 mr-1" /> Prompt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="mt-2">
            <ScrollArea className="h-48">
              {participants.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Waiting for students to join...
                </p>
              ) : (
                <div className="space-y-1">
                  {participants.map((p) => (
                    <ParticipantRow key={p.id} participant={p} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="responses" className="mt-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">MC Questions</div>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: questionCounts.mc }).map((_, i) => {
                  const stats = getResponseStats('mc', i);
                  return (
                    <Button
                      key={i}
                      size="sm"
                      variant="outline"
                      className="h-12 flex flex-col p-1"
                      onClick={() => updatePosition('mc', i)}
                    >
                      <span className="text-xs">Q{i + 1}</span>
                      <div className="flex gap-1 text-xs">
                        <span className="text-green-600">{stats.correct}</span>
                        <span className="text-red-600">{stats.incorrect}</span>
                        <span className="text-muted-foreground">{stats.pending}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
              <div className="text-sm font-medium mt-3">Writing Tasks</div>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: questionCounts.writing }).map((_, i) => {
                  const stats = getResponseStats('open_ended', i);
                  return (
                    <Button
                      key={i}
                      size="sm"
                      variant="outline"
                      className="h-12 flex flex-col p-1"
                      onClick={() => updatePosition('writing', i)}
                    >
                      <span className="text-xs">T{i + 1}</span>
                      <span className="text-xs text-muted-foreground">{stats.total}/{participants.length}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
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

function ParticipantRow({ participant }: { participant: SessionParticipant }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${participant.is_online ? 'bg-green-500' : 'bg-gray-300'}`} />
        <span className="text-sm font-mono">
          {participant.display_name || participant.student_identifier}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {participant.current_section && (
          <Badge variant="outline" className="text-xs">
            {participant.current_section}
          </Badge>
        )}
      </div>
    </div>
  );
}
