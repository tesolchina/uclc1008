import { ReactNode } from 'react';
import { RoleGuard } from '../components/RoleGuard';
import { AdminLoginNotice } from './AdminLoginNotice';

interface AdminAuthGuardProps {
  children: ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  return (
    <RoleGuard allowedRoles={['admin']} fallbackPath="/">
      {children}
    </RoleGuard>
  );
}
