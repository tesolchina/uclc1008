import { useState } from 'react';
import { StudentModeSelector } from './StudentModeSelector';
import { StudentLoginForm } from './StudentLoginForm';
import { StudentRegistrationWizard } from './StudentRegistrationWizard';
import type { StudentMode } from '../types';

interface StudentAuthPageProps {
  onBack: () => void;
}

export function StudentAuthPage({ onBack }: StudentAuthPageProps) {
  const [mode, setMode] = useState<StudentMode>('choose');

  const handleBackFromMode = () => {
    if (mode === 'choose') {
      onBack();
    } else {
      setMode('choose');
    }
  };

  if (mode === 'choose') {
    return <StudentModeSelector onSelect={setMode} onBack={onBack} />;
  }

  if (mode === 'login') {
    return <StudentLoginForm onBack={handleBackFromMode} onSwitchToRegister={() => setMode('register')} />;
  }

  return <StudentRegistrationWizard onBack={handleBackFromMode} />;
}
