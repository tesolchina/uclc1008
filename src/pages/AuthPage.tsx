import { useState, useEffect } from 'react';
import { useAuth, useAuthRedirect, RoleSelector, AuthLoading } from '@/features/auth';
import { TeacherAuthPage } from '@/features/auth/teacher';
import { StudentAuthPage } from '@/features/auth/student';
import type { UserType, StudentMode } from '@/features/auth';

interface AuthPageProps {
  initialMode?: 'student-login' | 'student-register';
}

export default function AuthPage({ initialMode }: AuthPageProps) {
  const { isLoading } = useAuth();
  useAuthRedirect({ redirectTo: '/', whenAuthenticated: true });
  
  const [userType, setUserType] = useState<UserType>('select');
  const [studentMode, setStudentMode] = useState<StudentMode>('choose');

  // Handle initial mode from route
  useEffect(() => {
    if (initialMode === 'student-login') {
      setUserType('student');
      setStudentMode('login');
    } else if (initialMode === 'student-register') {
      setUserType('student');
      setStudentMode('register');
    }
  }, [initialMode]);

  if (isLoading) {
    return <AuthLoading />;
  }

  if (userType === 'select') {
    return <RoleSelector onSelect={setUserType} />;
  }

  if (userType === 'teacher') {
    return <TeacherAuthPage onBack={() => setUserType('select')} />;
  }

  return <StudentAuthPage onBack={() => setUserType('select')} initialMode={studentMode} />;
}
