import React from 'react';
import { Loader2, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProcessingStatusProps {
  totalImages: number;
  processedImages: number;
  currentImageIndex: number;
  isProcessing: boolean;
}

export function ProcessingStatus({ 
  totalImages, 
  processedImages, 
  currentImageIndex, 
  isProcessing 
}: ProcessingStatusProps) {
  if (!isProcessing || totalImages === 0) return null;

  const progress = Math.round((processedImages / totalImages) * 100);
  const currentImage = currentImageIndex + 1;

  return (
    <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="font-medium text-sm">Extracting Text...</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {processedImages}/{totalImages} complete
        </span>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2" />

      {/* Status Steps */}
      <div className="space-y-2">
      {Array.from({ length: totalImages }, (_, i) => {
          const imageNum = i + 1;
          const isDone = i < processedImages;
          const isCurrent = i === currentImageIndex;

          return (
            <div 
              key={i}
              className={cn(
                "flex items-center gap-2 text-sm py-1 px-2 rounded transition-colors",
                isCurrent && "bg-primary/10",
                isDone && "text-muted-foreground"
              )}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-accent-foreground flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <FileText className="h-3 w-3 flex-shrink-0" />
              <span className={cn(
                "flex-1",
                isDone && "line-through opacity-60"
              )}>
                Image {imageNum}
              </span>
              <span className="text-xs text-muted-foreground">
                {isDone ? 'Done' : isCurrent ? 'Processing...' : 'Waiting'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Estimated time hint */}
      {totalImages - processedImages > 0 && (
        <p className="text-xs text-muted-foreground text-center pt-1">
          ~{(totalImages - processedImages) * 3}-{(totalImages - processedImages) * 5} seconds remaining
        </p>
      )}
    </div>
  );
}
