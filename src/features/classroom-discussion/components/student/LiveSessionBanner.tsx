/**
 * Live session banner for students - shows when teacher has an active session
 */

import { useState } from 'react';
import { Users, X, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ActiveSessionInfo } from '../../types';

interface LiveSessionBannerProps {
  session: ActiveSessionInfo;
  onJoin: () => void;
  onDismiss: () => void;
  isDismissed: boolean;
  onRestore: () => void;
}

export function LiveSessionBanner({ 
  session, 
  onJoin, 
  onDismiss, 
  isDismissed,
  onRestore,
}: LiveSessionBannerProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Minimized indicator
  if (isDismissed) {
    return (
      <button
        onClick={onRestore}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-sm font-medium">Live: {session.participantCount}</span>
        {isHovered && <ChevronUp className="h-4 w-4" />}
      </button>
    );
  }

  // Full banner
  return (
    <Card className="border-primary/50 bg-primary/5 p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <div>
            <p className="font-semibold text-primary">
              {session.teacherName} started a live discussion
            </p>
            {session.currentTaskTitle && (
              <p className="text-sm text-muted-foreground">
                Current task: {session.currentTaskTitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {session.participantCount} joined
          </Badge>

          <Button onClick={onJoin} size="sm">
            Join Session
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
