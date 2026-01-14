import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, BookOpen } from 'lucide-react';
import type { UserType } from '../types';

interface RoleSelectorProps {
  onSelect: (type: UserType) => void;
}

export function RoleSelector({ onSelect }: RoleSelectorProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to UE1</CardTitle>
          <CardDescription>
            Select how you want to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Teacher/Staff option */}
          <button
            onClick={() => onSelect('teacher')}
            className="w-full p-6 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Teacher / Staff</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign in or create an account to access teaching tools, student management, and course administration.
                </p>
              </div>
            </div>
          </button>

          {/* Student option */}
          <button
            onClick={() => onSelect('student')}
            className="w-full p-6 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Student</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Quick registration with your student ID. No email or password needed.
                </p>
              </div>
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
