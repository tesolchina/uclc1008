import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AUTH_ERROR_MESSAGES } from '../constants';

interface RegistrationStep2Props {
  firstInitial: string;
  lastInitial: string;
  onChangeFirst: (value: string) => void;
  onChangeLast: (value: string) => void;
  onNext: () => void;
  onError: (error: string) => void;
}

export function RegistrationStep2({ 
  firstInitial, 
  lastInitial, 
  onChangeFirst, 
  onChangeLast, 
  onNext, 
  onError 
}: RegistrationStep2Props) {
  const handleNext = () => {
    if (!/^[A-Za-z]$/.test(firstInitial) || !/^[A-Za-z]$/.test(lastInitial)) {
      onError(AUTH_ERROR_MESSAGES.invalid_initials);
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="font-medium">Enter your initials</h3>
        <p className="text-sm text-muted-foreground">
          First letter of your first and last name
        </p>
      </div>
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <Label className="text-xs text-muted-foreground">First</Label>
          <Input
            type="text"
            maxLength={1}
            value={firstInitial}
            onChange={(e) => onChangeFirst(e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase())}
            className="text-center text-3xl font-mono w-16 h-16 uppercase"
            placeholder="J"
            autoFocus
          />
        </div>
        <div className="text-center">
          <Label className="text-xs text-muted-foreground">Last</Label>
          <Input
            type="text"
            maxLength={1}
            value={lastInitial}
            onChange={(e) => onChangeLast(e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase())}
            className="text-center text-3xl font-mono w-16 h-16 uppercase"
            placeholder="D"
          />
        </div>
      </div>
      <Button 
        className="w-full" 
        onClick={handleNext}
        disabled={!firstInitial || !lastInitial}
      >
        Continue
      </Button>
    </div>
  );
}
