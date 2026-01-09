import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Radio, LogOut, Loader2 } from 'lucide-react';

// Anonymous animal names with emoji icons
const ANONYMOUS_ANIMALS = [
  { name: 'Fox', emoji: '🦊' },
  { name: 'Owl', emoji: '🦉' },
  { name: 'Panda', emoji: '🐼' },
  { name: 'Koala', emoji: '🐨' },
  { name: 'Bunny', emoji: '🐰' },
  { name: 'Cat', emoji: '🐱' },
  { name: 'Dog', emoji: '🐶' },
  { name: 'Bear', emoji: '🐻' },
  { name: 'Lion', emoji: '🦁' },
  { name: 'Tiger', emoji: '🐯' },
  { name: 'Penguin', emoji: '🐧' },
  { name: 'Dolphin', emoji: '🐬' },
  { name: 'Whale', emoji: '🐳' },
  { name: 'Butterfly', emoji: '🦋' },
  { name: 'Bee', emoji: '🐝' },
  { name: 'Hedgehog', emoji: '🦔' },
  { name: 'Squirrel', emoji: '🐿️' },
  { name: 'Hamster', emoji: '🐹' },
  { name: 'Sloth', emoji: '🦥' },
  { name: 'Otter', emoji: '🦦' },
];

// Generate a consistent animal for a participant based on their ID
export function getAnonymousAnimal(participantId: string): { name: string; emoji: string } {
  // Simple hash function to get consistent index
  let hash = 0;
  for (let i = 0; i < participantId.length; i++) {
    const char = participantId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % ANONYMOUS_ANIMALS.length;
  return ANONYMOUS_ANIMALS[index];
}

interface SessionWaitingRoomProps {
  sessionCode: string;
  sessionStatus: 'waiting' | 'active' | 'paused' | 'ended';
  participantCount: number;
  myDisplayName?: string;
  otherParticipantIds: string[];
  onLeave: () => void;
}

export function SessionWaitingRoom({
  sessionCode,
  sessionStatus,
  participantCount,
  myDisplayName,
  otherParticipantIds,
  onLeave,
}: SessionWaitingRoomProps) {
  const isWaiting = sessionStatus === 'waiting';

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="py-12">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          {/* Session Info */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Radio className={`h-4 w-4 text-primary ${isWaiting ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium">Live Session</span>
              <Badge variant="outline" className="font-mono text-lg">{sessionCode}</Badge>
            </div>
          </div>

          {/* Waiting Animation */}
          {isWaiting && (
            <div className="space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Waiting for teacher to start...</h2>
                <p className="text-sm text-muted-foreground">The session will begin shortly</p>
              </div>
            </div>
          )}

          {/* Paused State */}
          {sessionStatus === 'paused' && (
            <div className="space-y-4">
              <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <span className="text-4xl">⏸️</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Session Paused</h2>
                <p className="text-sm text-muted-foreground">The teacher has paused the session</p>
              </div>
            </div>
          )}

          {/* Your Identity */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">You joined as</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-lg border shadow-sm">
              <span className="text-2xl">👤</span>
              <span className="font-medium">{myDisplayName || 'Anonymous'}</span>
            </div>
          </div>

          {/* Participant Count */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">{participantCount} student{participantCount !== 1 ? 's' : ''} joined</span>
            </div>
            
            {/* Show other participants as anonymous animals */}
            {otherParticipantIds.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {otherParticipantIds.slice(0, 12).map((id) => {
                  const animal = getAnonymousAnimal(id);
                  return (
                    <div
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-full text-xs"
                      title={`Anonymous ${animal.name}`}
                    >
                      <span>{animal.emoji}</span>
                      <span className="text-muted-foreground">{animal.name}</span>
                    </div>
                  );
                })}
                {otherParticipantIds.length > 12 && (
                  <div className="inline-flex items-center px-2 py-1 bg-muted/50 rounded-full text-xs text-muted-foreground">
                    +{otherParticipantIds.length - 12} more
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Leave Button */}
          <Button variant="ghost" size="sm" onClick={onLeave} className="text-muted-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Leave Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
