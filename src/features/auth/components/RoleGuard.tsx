import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLoading } from './AuthLoading';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: ('admin' | 'teacher' | 'student')[];
  fallbackPath?: string;
}

export function RoleGuard({ children, allowedRoles, fallbackPath = '/course_info' }: RoleGuardProps) {
  const { isLoading, isAuthenticated, isAdmin, isTeacher } = useAuth();

  if (isLoading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has any of the allowed roles
  const hasAccess = allowedRoles.some(role => {
    if (role === 'admin') return isAdmin;
    if (role === 'teacher') return isTeacher;
    if (role === 'student') return true; // All authenticated users are at least students
    return false;
  });

  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
