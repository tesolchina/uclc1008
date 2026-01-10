import { LearningUnit } from "@/data/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UnitCardProps {
  unit: LearningUnit;
  weekId: number;
  hourNumber: number;
  unitIndex: number;
  isCompleted?: boolean;
}

export function UnitCard({ unit, weekId, hourNumber, unitIndex, isCompleted = false }: UnitCardProps) {
  const unitNumber = `${hourNumber}.${unitIndex + 1}`;
  
  return (
    <Link to={`/week/${weekId}/unit/${unit.id}`}>
      <Card className={cn(
        "h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group",
        isCompleted && "border-green-500/50 bg-green-50/50 dark:bg-green-950/20"
      )}>
        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              Unit {unitNumber}
            </Badge>
            {isCompleted && (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            )}
          </div>
          
          <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
            {unit.title}
          </h4>
          
          {unit.subtitle && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {unit.subtitle}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {unit.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {unit.slides.length} slides
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
