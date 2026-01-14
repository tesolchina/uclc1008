import { Loader2 } from 'lucide-react';

interface AuthLoadingProps {
  message?: string;
}

export function AuthLoading({ message }: AuthLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}
