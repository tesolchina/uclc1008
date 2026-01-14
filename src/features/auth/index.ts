// Context & Provider
export { AuthProvider, useAuth } from './context/AuthContext';

// Hooks
export { useStudentId } from './hooks/useStudentId';
export { useAuthRedirect } from './hooks/useAuthRedirect';

// Components
export { RoleGuard } from './components/RoleGuard';
export { UserMenu } from './components/UserMenu';
export { RoleSelector } from './components/RoleSelector';
export { AuthLoading } from './components/AuthLoading';

// Teacher
export { TeacherAuthPage } from './teacher/TeacherAuthPage';

// Student
export { StudentAuthPage } from './student/StudentAuthPage';

// Admin
export { AdminAuthGuard } from './admin/AdminAuthGuard';

// Types
export type { Profile, AuthContextType, UserType, StudentMode } from './types';
