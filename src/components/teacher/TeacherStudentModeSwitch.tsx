import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/features/auth';
import { UserCircle, GraduationCap, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const TEACHER_STUDENT_ID_KEY = 'ue1_teacher_student_id';

function generateTeacherStudentId(userId: string): string {
  // Create a deterministic but anonymous ID based on teacher's user ID
  const hash = userId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  const positiveHash = Math.abs(hash);
  return `TEACHER_${positiveHash.toString(36).toUpperCase().slice(0, 8)}`;
}

export function TeacherStudentModeSwitch() {
  const { user, loginAsStudent, logoutStudent, studentId, isTeacher, isAdmin } = useAuth();
  const [copied, setCopied] = useState(false);

  // Generate or retrieve the teacher's student ID
  const teacherStudentId = user?.id ? generateTeacherStudentId(user.id) : null;
  
  // Check if teacher is currently in student mode
  const isInStudentMode = !!studentId && studentId === teacherStudentId;

  const handleToggleStudentMode = () => {
    if (!teacherStudentId) return;
    
    if (isInStudentMode) {
      logoutStudent();
      toast.success('Switched back to teacher mode');
    } else {
      loginAsStudent(teacherStudentId);
      toast.success('Switched to student mode - your progress will be tracked separately');
    }
  };

  const handleCopyId = async () => {
    if (!teacherStudentId) return;
    try {
      await navigator.clipboard.writeText(teacherStudentId);
      setCopied(true);
      toast.success('Student ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (!isTeacher && !isAdmin) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Student Mode
            </CardTitle>
            <CardDescription>
              Try exercises as a student with a separate progress record
            </CardDescription>
          </div>
          <Switch
            checked={isInStudentMode}
            onCheckedChange={handleToggleStudentMode}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <Badge variant={isInStudentMode ? 'default' : 'secondary'} className="gap-1">
            <UserCircle className="h-3 w-3" />
            {teacherStudentId || 'Loading...'}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleCopyId}
            disabled={!teacherStudentId}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
        {isInStudentMode && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            You are currently in student mode. Your attempts are tracked under this ID.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Export the ID generator for use elsewhere
export { generateTeacherStudentId };
