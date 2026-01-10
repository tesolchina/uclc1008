import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useTeacherSession } from "@/hooks/useLiveSession";
import { SessionQRCode } from "@/components/lessons/SessionQRCode";
import { 
  QrCode, 
  Users, 
  Play, 
  Pause, 
  StopCircle, 
  Radio,
  Loader2,
  CheckCircle
} from "lucide-react";

interface Hour1LiveSessionProps {
  lessonId: string;
}

export function Hour1LiveSession({ lessonId }: Hour1LiveSessionProps) {
  const { user, isAuthenticated } = useAuth();
  const {
    session,
    participants,
    isLoading,
    isReconnecting,
    createSession,
    startSession,
    togglePause,
    endSession,
  } = useTeacherSession(lessonId);

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      await createSession("Week 1 - Hour 1: Reading the Pre-course Article");
    } finally {
      setIsCreating(false);
    }
  };

  const onlineCount = participants.filter(p => p.is_online).length;

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Reconnecting state
  if (isReconnecting) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary" />
          <span className="text-sm text-muted-foreground">Reconnecting to session...</span>
        </CardContent>
      </Card>
    );
  }

  // No session - show create button
  if (!session) {
    return (
      <Card className="border-dashed border-primary/30 hover:border-primary/50 transition-colors">
        <CardContent className="py-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Radio className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground">Start a Live Session</h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                Create a live session for students to join. They can scan a QR code or enter a session code.
              </p>
            </div>
            <Button 
              onClick={handleCreateSession} 
              disabled={isCreating}
              className="gap-2"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4" />
                  Create Live Session
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active session - show controls
  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              session.status === 'active' ? 'bg-green-500 animate-pulse' : 
              session.status === 'paused' ? 'bg-amber-500' : 'bg-muted-foreground'
            }`} />
            <CardTitle className="text-base">
              Live Session Active
            </CardTitle>
          </div>
          <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
            {session.status === 'waiting' && 'Waiting'}
            {session.status === 'active' && 'Live'}
            {session.status === 'paused' && 'Paused'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Session Code & QR */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-card border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Session Code</p>
            <p className="font-mono text-2xl font-bold tracking-widest text-primary">
              {session.session_code}
            </p>
          </div>
          <SessionQRCode sessionCode={session.session_code} />
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-semibold text-foreground">{onlineCount}</span>
              <span className="text-muted-foreground"> students online</span>
            </span>
          </div>
          {participants.length > 0 && (
            <div className="flex -space-x-2">
              {participants.slice(0, 5).map((p, idx) => (
                <div
                  key={p.id}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 border-background ${
                    p.is_online ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                  title={p.display_name || p.student_identifier}
                >
                  {(p.display_name || p.student_identifier).charAt(0).toUpperCase()}
                </div>
              ))}
              {participants.length > 5 && (
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                  +{participants.length - 5}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {session.status === 'waiting' && (
            <Button onClick={() => startSession()} className="flex-1 gap-2">
              <Play className="h-4 w-4" />
              Start Session
            </Button>
          )}
          
          {session.status === 'active' && (
            <Button onClick={() => togglePause()} variant="outline" className="flex-1 gap-2">
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}
          
          {session.status === 'paused' && (
            <Button onClick={() => togglePause()} className="flex-1 gap-2">
              <Play className="h-4 w-4" />
              Resume
            </Button>
          )}
          
          {session.status !== 'ended' && (
            <Button onClick={() => endSession()} variant="destructive" size="icon">
              <StopCircle className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Students scan QR or visit <code className="bg-muted px-1 rounded">ue1.hkbu.tech/join</code>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
