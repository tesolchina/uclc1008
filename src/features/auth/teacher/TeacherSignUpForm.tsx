import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import { emailSchema, passwordSchema, displayNameSchema } from '../utils/validation';
import { mapSupabaseError } from '../utils/errorMessages';
import { z } from 'zod';

interface TeacherSignUpFormProps {
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export function TeacherSignUpForm({ onError, onSuccess }: TeacherSignUpFormProps) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onError('');

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      displayNameSchema.parse(displayName);
    } catch (err) {
      if (err instanceof z.ZodError) {
        onError(err.errors[0].message);
        return;
      }
    }

    setIsSubmitting(true);
    const { error: signUpError } = await signUp(email, password, displayName.trim());
    setIsSubmitting(false);

    if (signUpError) {
      const errorMessage = mapSupabaseError(signUpError);
      onError(errorMessage || signUpError.message);
    } else {
      onSuccess('Account created! You can now sign in.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <Input
          id="signup-name"
          type="text"
          placeholder="Dr. Simon Wang"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="simonwang@hkbu.edu.hk"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <UserPlus className="h-4 w-4 mr-2" />
        )}
        Create Account
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        New accounts start with basic access. Admin will assign teacher/admin roles.
      </p>
    </form>
  );
}
