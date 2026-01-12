import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

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
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to="/auth" className="gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/auth" className="gap-1.5">
              <UserPlus className="h-3.5 w-3.5" />
              Register
            </Link>
          </Button>
        </div>
      </div>
    </Alert>
  );
}
