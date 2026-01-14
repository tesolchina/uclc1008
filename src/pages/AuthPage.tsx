import { useState } from 'react';
import { useAuth, useAuthRedirect, RoleSelector, AuthLoading } from '@/features/auth';
import { TeacherAuthPage } from '@/features/auth/teacher';
import { StudentAuthPage } from '@/features/auth/student';
import type { UserType } from '@/features/auth';

export default function AuthPage() {
  const { isLoading } = useAuth();
  useAuthRedirect({ redirectTo: '/', whenAuthenticated: true });
  
  const [userType, setUserType] = useState<UserType>('select');

  if (isLoading) {
    return <AuthLoading />;
  }

  if (userType === 'select') {
    return <RoleSelector onSelect={setUserType} />;
  }

  if (userType === 'teacher') {
    return <TeacherAuthPage onBack={() => setUserType('select')} />;
  }

  return <StudentAuthPage onBack={() => setUserType('select')} />;
}
