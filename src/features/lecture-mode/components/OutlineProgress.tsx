/**
 * OutlineProgress Component
 * 
 * Displays progress through the lecture outline.
 * Shows completed sections count and estimated time.
 */

import { CheckCircle2, Clock, Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { OutlineProgressProps } from '../types';
import { formatMinutes } from '../constants';

export function OutlineProgress({
  totalSections,
  completedCount,
  currentIndex,
  totalMinutes,
  elapsedMinutes,
}: OutlineProgressProps) {
  const progressPercent = totalSections > 0 
    ? Math.round((completedCount / totalSections) * 100) 
    : 0;

  const remainingMinutes = totalMinutes && elapsedMinutes 
    ? Math.max(0, totalMinutes - elapsedMinutes)
    : undefined;

  return (
    <div className="space-y-2 p-3 rounded-lg bg-muted/30 border">
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Lecture Progress</span>
          <span className="text-muted-foreground">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span>{completedCount} / {totalSections} sections</span>
        </div>
        
        {totalMinutes !== undefined && (
          <div className="flex items-center gap-3">
            {elapsedMinutes !== undefined && (
              <div className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                <span>{formatMinutes(elapsedMinutes)} elapsed</span>
              </div>
            )}
            {remainingMinutes !== undefined && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>~{formatMinutes(remainingMinutes)} left</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current Section Indicator */}
      <div className="flex items-center gap-1 text-xs">
        <span className="text-muted-foreground">Currently on:</span>
        <span className="font-medium">Section {currentIndex + 1}</span>
      </div>
    </div>
  );
}
