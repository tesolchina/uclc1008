import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export function AdminLoginNotice() {
  return (
    <Alert className="border-amber-500 bg-amber-50">
      <ShieldAlert className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-700">
        Admin access requires role assignment by an existing administrator.
      </AlertDescription>
    </Alert>
  );
}
