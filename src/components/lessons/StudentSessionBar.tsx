import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Users, LogOut, Radio, Loader2, X, AlertCircle, 
  Clock, MessageSquare, Bell
} from 'lucide-react';
import { useStudentSession, LiveSession } from '@/hooks/useLiveSession';
import { LiveTaskView } from './LiveTaskView';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

interface MCQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface OpenEndedQuestion {
  id: string;
  question: string;
  hints?: string[];
}

interface StudentSessionBarProps {
  studentIdentifier: string;
  currentSection: string;
  onSessionChange?: (session: LiveSession | null) => void;
  pendingJoin?: { code: string; name?: string } | null;
  onPendingJoinHandled?: () => void;
  content?: {
    notes: string[];
    keyConcepts: string[];
    mcQuestions: MCQuestion[];
    openEndedQuestions: OpenEndedQuestion[];
  };
}

export function StudentSessionBar({ 
  studentIdentifier, 
  currentSection,
  onSessionChange,
  pendingJoin,
  onPendingJoinHandled,
  content
}: StudentSessionBarProps) {
  const [sessionCode, setSessionCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPromptAlert, setShowPromptAlert] = useState(false);

  const {
    session,
    participant,
    latestPrompt,
    isJoining,
    joinSession,
    leaveSession,
    updateSection,
    dismissPrompt,
    submitResponse,
    responses,
  } = useStudentSession(studentIdentifier);

  // Update section when it changes
  useEffect(() => {
    if (session && participant) {
      updateSection(currentSection);
    }
  }, [currentSection, session, participant, updateSection]);

  // Notify parent of session changes
  useEffect(() => {
    onSessionChange?.(session);
  }, [session, onSessionChange]);

  // Show prompt alert when new prompt arrives
  useEffect(() => {
    if (latestPrompt) {
      setShowPromptAlert(true);
      // Auto-dismiss after 10 seconds for non-focus prompts
      if (latestPrompt.prompt_type !== 'focus') {
        const timer = setTimeout(() => {
          setShowPromptAlert(false);
          dismissPrompt();
        }, 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [latestPrompt, dismissPrompt]);

  // Handle pending join from /join page
  useEffect(() => {
    if (pendingJoin && !session) {
      joinSession(pendingJoin.code, pendingJoin.name).then(() => {
        onPendingJoinHandled?.();
      });
    }
  }, [pendingJoin, session, joinSession, onPendingJoinHandled]);

  const handleJoin = async () => {
    const success = await joinSession(sessionCode, displayName || undefined);
    if (success) {
      setIsDialogOpen(false);
      setSessionCode('');
    }
  };

  const handleLeave = async () => {
    await leaveSession();
  };

  const dismissPromptAlert = () => {
    setShowPromptAlert(false);
    dismissPrompt();
  };

  // Not in a session - show join button
  if (!session) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Join Live Session
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join Live Session</DialogTitle>
            <DialogDescription>
              Enter the 6-character code provided by your teacher to join the live session.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Code</label>
              <Input
                placeholder="e.g. ABC123"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                className="font-mono text-lg tracking-widest text-center"
                maxLength={6}
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
              className="w-full"
            >
              {isJoining ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Joining...</>
              ) : (
                <>Join Session</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // In a locked session - show session bar + LiveTaskView
  const isLockedSession = session && !session.allow_ahead && session.status !== 'ended';
  
  return (
    <>
      {/* Prompt Alert */}
      {showPromptAlert && latestPrompt && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none">
          <Alert 
            className={`max-w-md pointer-events-auto shadow-lg ${
              latestPrompt.prompt_type === 'focus' 
                ? 'border-destructive bg-destructive/10' 
                : latestPrompt.prompt_type === 'timer'
                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                : 'border-primary bg-primary/10'
            }`}
          >
            <div className="flex items-start gap-3">
              {latestPrompt.prompt_type === 'focus' && <AlertCircle className="h-5 w-5 text-destructive" />}
              {latestPrompt.prompt_type === 'timer' && <Clock className="h-5 w-5 text-yellow-600" />}
              {latestPrompt.prompt_type === 'message' && <MessageSquare className="h-5 w-5 text-primary" />}
              <div className="flex-1">
                <AlertTitle className="mb-1">
                  {latestPrompt.prompt_type === 'focus' && 'Attention!'}
                  {latestPrompt.prompt_type === 'timer' && 'Time Update'}
                  {latestPrompt.prompt_type === 'message' && 'From Teacher'}
                </AlertTitle>
                <AlertDescription>{latestPrompt.content}</AlertDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={dismissPromptAlert}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        </div>
      )}

      {/* Session Bar */}
      <Card className="flex items-center justify-between px-4 py-2 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Live Session</span>
          </div>
          <Badge variant="outline" className="font-mono">{session.session_code}</Badge>
          {session.status === 'paused' && (
            <Badge variant="secondary">Paused</Badge>
          )}
          {!session.allow_ahead && (
            <Badge variant="default" className="gap-1 bg-primary">
              <Bell className="h-3 w-3" />
              Teacher Controlled
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleLeave} className="text-muted-foreground">
          <LogOut className="h-4 w-4 mr-1" />
          Leave
        </Button>
      </Card>
      
      {/* Live Task View - shows only when in locked session with content */}
      {isLockedSession && content && (
        <LiveTaskView
          session={session}
          mcQuestions={content.mcQuestions}
          openEndedQuestions={content.openEndedQuestions}
          notes={content.notes}
          keyConcepts={content.keyConcepts}
          onSubmitResponse={(questionType, questionIndex, response, isCorrect) => {
            submitResponse(questionType, questionIndex, response, isCorrect);
          }}
          existingResponses={responses}
        />
      )}
    </>
  );
}
