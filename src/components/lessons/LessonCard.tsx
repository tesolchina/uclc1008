import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

interface LessonCardProps {
  weekId: number;
  lessonId: string;
  lessonNumber: number;
  title: string;
  description: string;
  objectives: string[];
  progress?: number;
  isCompleted?: boolean;
}

export function LessonCard({
  weekId,
  lessonId,
  lessonNumber,
  title,
  description,
  objectives,
  progress = 0,
  isCompleted = false,
}: LessonCardProps) {
  // Use weekId-lessonNumber format for cleaner URLs
  const lessonPath = `/week/${weekId}/lesson/${weekId}-${lessonNumber}`;
  
  return (
    <Link to={lessonPath}>
      <Card className="transition-all hover:border-primary/50 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                {lessonNumber}
              </div>
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
              </div>
            </div>
            {isCompleted ? (
              <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Done
              </Badge>
            ) : progress > 0 ? (
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                In Progress
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="space-y-1.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Learning Objectives
            </p>
            <ul className="space-y-1">
              {objectives.slice(0, 2).map((obj, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="line-clamp-1">{obj}</span>
                </li>
              ))}
              {objectives.length > 2 && (
                <li className="text-xs text-muted-foreground/60">
                  +{objectives.length - 2} more objectives
                </li>
              )}
            </ul>
          </div>
          
          {progress > 0 && !isCompleted && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}