import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';
import { RegistrationStep1 } from './RegistrationStep1';
import { RegistrationStep2 } from './RegistrationStep2';
import { RegistrationStep3 } from './RegistrationStep3';
import { setStoredStudentId, buildStudentId, generateRandomSuffix } from '../utils/studentId';
import { STUDENT_ID_MAX_ATTEMPTS, AUTH_ERROR_MESSAGES } from '../constants';

interface StudentRegistrationWizardProps {
  onBack: () => void;
}

export function StudentRegistrationWizard({ onBack }: StudentRegistrationWizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [firstInitial, setFirstInitial] = useState('');
  const [lastInitial, setLastInitial] = useState('');
  const [sectionNumber, setSectionNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleComplete = async () => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      const { data: existingWithSameDigits } = await supabase
        .from('students')
        .select('student_id')
        .like('student_id', `${lastFourDigits}-%`);
      
      let uniqueId = '';
      let isUnique = false;
      
      if (!existingWithSameDigits || existingWithSameDigits.length === 0) {
        uniqueId = buildStudentId(lastFourDigits, firstInitial, lastInitial);
        isUnique = true;
      } else {
        const existingIds = new Set(existingWithSameDigits.map(s => s.student_id));
        
        for (let attempt = 0; attempt < STUDENT_ID_MAX_ATTEMPTS && !isUnique; attempt++) {
          uniqueId = buildStudentId(lastFourDigits, firstInitial, lastInitial, generateRandomSuffix());
          if (!existingIds.has(uniqueId)) isUnique = true;
        }
      }
      
      if (!isUnique) {
        setError(AUTH_ERROR_MESSAGES.unique_id_failed);
        setIsSubmitting(false);
        return;
      }
      
      const { error: insertError } = await supabase.from('students').insert({ student_id: uniqueId });
      
      if (insertError?.code === '23505') {
        setError(AUTH_ERROR_MESSAGES.id_taken);
        setIsSubmitting(false);
        return;
      }
      
      setStoredStudentId(uniqueId);
      setSuccess(`Your ID is: ${uniqueId}`);
      setTimeout(() => navigate('/'), 1500);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button variant="ghost" size="sm" className="w-fit -ml-2 mb-2" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />Back
          </Button>
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-blue-100"><UserPlus className="h-8 w-8 text-blue-600" /></div>
          </div>
          <CardTitle className="text-2xl text-center">Student Registration</CardTitle>
          <CardDescription className="text-center">Step {step} of 3</CardDescription>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
          {success && <Alert className="border-green-500 bg-green-50 text-green-700"><AlertDescription>{success}</AlertDescription></Alert>}
          
          {step === 1 && <RegistrationStep1 value={lastFourDigits} onChange={setLastFourDigits} onNext={() => setStep(2)} onError={setError} />}
          {step === 2 && <RegistrationStep2 firstInitial={firstInitial} lastInitial={lastInitial} onChangeFirst={setFirstInitial} onChangeLast={setLastInitial} onNext={() => setStep(3)} onError={setError} />}
          {step === 3 && <RegistrationStep3 lastFourDigits={lastFourDigits} firstInitial={firstInitial} lastInitial={lastInitial} sectionNumber={sectionNumber} onChangeSectionNumber={setSectionNumber} onComplete={handleComplete} isSubmitting={isSubmitting} />}
        </CardContent>
      </Card>
    </div>
  );
}
