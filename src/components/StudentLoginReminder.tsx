import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface StudentLoginReminderProps {
  className?: string;
}

export function StudentLoginReminder({ className = '' }: StudentLoginReminderProps) {
  return (
    <Alert className={`border-primary/30 bg-primary/5 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <AlertDescription className="flex-1">
          <span className="font-medium">Welcome to UE1!</span> Sign in with your student ID to track progress and access the AI tutor.
        </AlertDescription>
        <Button size="sm" asChild>
          <Link to="/settings" className="gap-1.5">
            <Settings className="h-3.5 w-3.5" />
            Go to Settings
          </Link>
        </Button>
      </div>
    </Alert>
  );
}
