import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AUTH_ERROR_MESSAGES } from '../constants';

interface RegistrationStep1Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onError: (error: string) => void;
}

export function RegistrationStep1({ value, onChange, onNext, onError }: RegistrationStep1Props) {
  const handleNext = () => {
    if (!/^\d{4}$/.test(value)) {
      onError(AUTH_ERROR_MESSAGES.invalid_digits);
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="font-medium">Enter the last 4 digits of your Student ID</h3>
        <p className="text-sm text-muted-foreground">
          For example, if your ID is 21012345, enter "2345"
        </p>
        <p className="text-xs text-amber-600 font-medium">
          ⚠️ Only enter the last 4 digits — do NOT enter your full student ID
        </p>
      </div>
      <div className="flex justify-center">
        <Input
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
          className="text-center text-3xl tracking-[0.5em] font-mono w-48 h-16"
          placeholder="0000"
          autoFocus
        />
      </div>
      <Button 
        className="w-full" 
        onClick={handleNext}
        disabled={value.length !== 4}
      >
        Continue
      </Button>
    </div>
  );
}
