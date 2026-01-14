import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';

export function HkbuSsoButton() {
  const { loginWithHkbu } = useAuth();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={loginWithHkbu}
      disabled
    >
      <GraduationCap className="h-4 w-4 mr-2" />
      Sign in with HKBU (Coming Soon)
    </Button>
  );
}
