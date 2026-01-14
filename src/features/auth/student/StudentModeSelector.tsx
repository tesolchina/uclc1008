import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, KeyRound, UserPlus } from 'lucide-react';
import type { StudentMode } from '../types';

interface StudentModeSelectorProps {
  onSelect: (mode: StudentMode) => void;
  onBack: () => void;
}

export function StudentModeSelector({ onSelect, onBack }: StudentModeSelectorProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit -ml-2 mb-2"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Student Access</CardTitle>
          <CardDescription className="text-center">
            Are you new or returning?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Returning student */}
          <button
            onClick={() => onSelect('login')}
            className="w-full p-5 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                <KeyRound className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Welcome back!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  I already have my unique ID (e.g., 1234-JD-7X)
                </p>
              </div>
            </div>
          </button>

          {/* New student */}
          <button
            onClick={() => onSelect('register')}
            className="w-full p-5 rounded-lg border-2 border-muted hover:border-primary hover:bg-primary/5 transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">I'm new here</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Register with my student ID to get started
                </p>
              </div>
            </div>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
