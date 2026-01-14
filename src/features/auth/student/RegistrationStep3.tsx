import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GraduationCap, Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface RegistrationStep3Props {
  lastFourDigits: string;
  firstInitial: string;
  lastInitial: string;
  sectionNumber: string;
  onChangeSectionNumber: (value: string) => void;
  onComplete: () => void;
  isSubmitting: boolean;
}

export function RegistrationStep3({ 
  lastFourDigits, 
  firstInitial, 
  lastInitial, 
  sectionNumber, 
  onChangeSectionNumber, 
  onComplete,
  isSubmitting
}: RegistrationStep3Props) {
  const previewId = `${lastFourDigits}-${firstInitial}${lastInitial}-XX`;

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(previewId);
    toast.success('ID format copied! (Note: XX will be replaced with random characters)');
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="font-medium">Which section are you in? (Optional)</h3>
        <p className="text-sm text-muted-foreground">
          e.g., A01, B02, C03
        </p>
      </div>
      <div className="flex justify-center">
        <Input
          type="text"
          maxLength={4}
          value={sectionNumber}
          onChange={(e) => onChangeSectionNumber(e.target.value.toUpperCase())}
          className="text-center text-2xl font-mono w-32 h-14 uppercase"
          placeholder="A01"
          autoFocus
        />
      </div>
      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">Your unique ID will be:</p>
        <p className="text-2xl font-mono font-bold text-primary mb-2">
          {previewId}
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopyPreview}
          className="mb-2"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy ID Format
        </Button>
        <p className="text-xs text-muted-foreground">
          (XX will be generated randomly after registration)
        </p>
      </div>
      
      {/* Important reminder to save ID */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="font-semibold text-green-700 mb-1">📸 Remember Your ID!</p>
        <p className="text-xs text-green-600">
          <strong>Take a screenshot or write down your unique ID.</strong> You will need it to retrieve your records. 
          If you lose it, you may not be able to access your previous work.
        </p>
      </div>
      
      {/* Beta warning and privacy statement */}
      <div className="space-y-3 text-xs text-muted-foreground">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="font-semibold text-amber-700 mb-1">⚠️ Beta Mode</p>
          <p className="text-amber-600">
            This system is in beta and may crash or malfunction. <strong>Always save a copy of your work</strong> externally. 
            Do not rely solely on this website to save your work.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="font-semibold text-blue-700 mb-1">🔒 Privacy Notice</p>
          <p className="text-blue-600">
            Please do not share any personal information or sensitive data on this platform. 
            Only use the last 4 digits of your student ID and initials as instructed.
          </p>
        </div>
      </div>
      
      <Button className="w-full" onClick={onComplete} disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <GraduationCap className="h-4 w-4 mr-2" />
        )}
        Complete Registration
      </Button>
      <Button variant="ghost" className="w-full" onClick={onComplete} disabled={isSubmitting}>
        Skip section, complete anyway
      </Button>
    </div>
  );
}
