import { useState, useEffect } from 'react';
import { StudentModeSelector } from './StudentModeSelector';
import { StudentLoginForm } from './StudentLoginForm';
import { StudentRegistrationWizard } from './StudentRegistrationWizard';
import type { StudentMode } from '../types';

interface StudentAuthPageProps {
  onBack: () => void;
  initialMode?: StudentMode;
}

export function StudentAuthPage({ onBack, initialMode = 'choose' }: StudentAuthPageProps) {
  const [mode, setMode] = useState<StudentMode>(initialMode);

  // Update mode if initialMode prop changes
  useEffect(() => {
    if (initialMode !== 'choose') {
      setMode(initialMode);
    }
  }, [initialMode]);

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
