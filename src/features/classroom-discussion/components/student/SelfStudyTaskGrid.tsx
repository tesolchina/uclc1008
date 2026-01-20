/**
 * Task grid for self-study mode - students can browse and select tasks
 */

import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Hour3Task, StudentTaskProgress } from '@/features/classroom-discussion/types';

interface SelfStudyTaskGridProps {
  tasks: Hour3Task[];
  getProgress: (taskId: string) => StudentTaskProgress;
  onSelectTask: (taskId: string) => void;
  selectedTaskId: string | null;
}

export function SelfStudyTaskGrid({ 
  tasks, 
  getProgress, 
  onSelectTask,
  selectedTaskId,
}: SelfStudyTaskGridProps) {
  if (tasks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            No practice tasks available for this week yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Practice Tasks</h3>
        <Badge variant="outline">
          {tasks.filter(t => getProgress(t.id).status === 'completed').length}/{tasks.length} completed
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => {
          const progress = getProgress(task.id);
          const isSelected = selectedTaskId === task.id;
          
          return (
            <Card 
              key={task.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              } ${progress.status === 'completed' ? 'bg-muted/30' : ''}`}
              onClick={() => onSelectTask(task.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {progress.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : progress.status === 'in-progress' ? (
                      <Clock className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <CardTitle className="text-base">{task.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="line-clamp-2 text-xs">
                  {task.prompt.slice(0, 80)}...
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {task.skillFocus.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
                {task.wordLimit && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {task.wordLimit} words max
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
