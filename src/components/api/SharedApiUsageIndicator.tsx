import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SharedApiUsageIndicatorProps {
  used: number;
  limit: number;
  className?: string;
}

export function SharedApiUsageIndicator({ used, limit, className = '' }: SharedApiUsageIndicatorProps) {
  const remaining = Math.max(0, limit - used);
  const percentage = Math.min(100, (used / limit) * 100);
  const isLow = remaining <= 10;
  const isEmpty = remaining === 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Daily AI requests</span>
        <Badge variant={isEmpty ? 'destructive' : isLow ? 'secondary' : 'outline'}>
          {remaining}/{limit} remaining
        </Badge>
      </div>
      <Progress value={percentage} className="h-2" />
      {isEmpty && (
        <p className="text-xs text-destructive">
          Daily limit reached. Add your own HKBU API key for unlimited access.
        </p>
      )}
    </div>
  );
}
