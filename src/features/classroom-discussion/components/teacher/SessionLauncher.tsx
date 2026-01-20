/**
 * Session launcher for teachers - start session and select task
 */

import { useState } from 'react';
import { Play, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Hour3Task } from '@/features/classroom-discussion/types';

interface SessionLauncherProps {
  tasks: Hour3Task[];
  onStartSession: (taskId?: string) => Promise<boolean>;
  isLoading: boolean;
}

export function SessionLauncher({ tasks, onStartSession, isLoading }: SessionLauncherProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const handleStart = async () => {
    await onStartSession(selectedTaskId || undefined);
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Start Live Discussion
        </CardTitle>
        <CardDescription>
          Launch a live session for students to join. You can change the task during the session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Starting Task (optional)</label>
          <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a task to start with..." />
            </SelectTrigger>
            <SelectContent>
              {tasks.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  <div className="flex items-center gap-2">
                    <span>{task.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {task.skillFocus[0]?.replace(/-/g, ' ')}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleStart} 
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          <Play className="h-4 w-4 mr-2" />
          {isLoading ? 'Starting...' : 'Start Live Session'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Students will see an invitation banner when you start
        </p>
      </CardContent>
    </Card>
  );
}
