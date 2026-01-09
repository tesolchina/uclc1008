import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Users, Loader2 } from 'lucide-react';
import { useStudentSession, LiveSession } from '@/hooks/useLiveSession';
import { SessionCanvas } from './SessionCanvas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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

  const {
    session,
    participant,
    participants,
    latestPrompt,
    isJoining,
    isReconnecting,
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

  // Show reconnecting state
  if (isReconnecting) {
    return (
      <Card className="flex items-center justify-center px-4 py-3 bg-muted/50 border-dashed">
        <Loader2 className="h-4 w-4 animate-spin mr-2 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Reconnecting to session...</span>
      </Card>
    );
  }

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
                placeholder="How should you appear?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your name is only visible to you. Others see you as an anonymous animal.
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

  // In a locked session - show the full canvas experience
  const isLockedSession = session && !session.allow_ahead && session.status !== 'ended';
  
  if (isLockedSession && content) {
    return (
      <SessionCanvas
        session={session}
        participant={participant}
        participants={participants}
        myDisplayName={participant?.display_name || displayName || undefined}
        mcQuestions={content.mcQuestions}
        openEndedQuestions={content.openEndedQuestions}
        notes={content.notes}
        keyConcepts={content.keyConcepts}
        onSubmitResponse={(questionType, questionIndex, response, isCorrect) => {
          submitResponse(questionType, questionIndex, response, isCorrect);
        }}
        existingResponses={responses}
        latestPrompt={latestPrompt}
        onDismissPrompt={dismissPrompt}
        onLeave={handleLeave}
      />
    );
  }

  // Free pace mode - just show a simple bar (content is accessible below)
  return (
    <Card className="px-4 py-3 bg-primary/5 border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">Connected to Live Session</span>
          </div>
          <span className="text-xs text-muted-foreground">Free pace mode - work at your own speed</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLeave} className="text-muted-foreground">
          Leave
        </Button>
      </div>
    </Card>
  );
}
