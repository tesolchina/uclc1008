/**
 * Dropdown-based task selector for self-study mode
 * Replaces the grid view for a cleaner, more focused experience
 */

import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Hour3Task, StudentTaskProgress } from '@/features/classroom-discussion/types';

interface TaskSelectDropdownProps {
  tasks: Hour3Task[];
  getProgress: (taskId: string) => StudentTaskProgress;
  onSelectTask: (taskId: string) => void;
  selectedTaskId: string | null;
}

export function TaskSelectDropdown({
  tasks,
  getProgress,
  onSelectTask,
  selectedTaskId,
}: TaskSelectDropdownProps) {
  const completedCount = tasks.filter(t => getProgress(t.id).status === 'completed').length;

  // Find a recommended task (first incomplete one)
  const recommendedTask = tasks.find(t => getProgress(t.id).status !== 'completed');

  const getStatusIcon = (status: StudentTaskProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-amber-500 shrink-0" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground shrink-0" />;
    }
  };

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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Select a Task</CardTitle>
            <CardDescription className="text-sm">
              Choose a practice task to work on
            </CardDescription>
          </div>
          <Badge variant="outline">
            {completedCount}/{tasks.length} completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedTaskId || ""}
          onValueChange={(value) => {
            if (value) onSelectTask(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a task to begin..." />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {tasks.map((task) => {
              const progress = getProgress(task.id);
              const skillHint = task.skillFocus.slice(0, 2).map(s => s.replace(/-/g, ' ')).join(', ');
              
              return (
                <SelectItem key={task.id} value={task.id} className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    {getStatusIcon(progress.status)}
                    <div className="flex flex-col items-start min-w-0">
                      <span className="font-medium truncate">{task.title}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {skillHint}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Recommendation hint */}
        {recommendedTask && completedCount < tasks.length && (
          <p className="text-xs text-muted-foreground">
            💡 Suggested next: <button 
              onClick={() => onSelectTask(recommendedTask.id)}
              className="text-primary hover:underline font-medium"
            >
              {recommendedTask.title}
            </button>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
