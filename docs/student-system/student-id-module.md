# Student ID Module

## Purpose

Provides lightweight student identification without requiring email/password authentication. Students register with partial information and receive a memorable unique ID.

## File Structure

```
src/features/student-id/
├── README.md                     # This documentation
├── index.ts                      # Public exports
├── types.ts                      # TypeScript interfaces
├── constants.ts                  # Storage keys, validation rules
├── context/
│   └── StudentContext.tsx        # React context for global state
├── hooks/
│   ├── useStudentId.ts           # Main hook (accesses context)
│   ├── useStudentRegistration.ts # Registration logic
│   └── useStudentStorage.ts      # localStorage utilities
├── utils/
│   ├── generateUniqueId.ts       # ID generation algorithm
│   └── validation.ts             # Zod schemas
├── components/
│   ├── RegistrationWizard.tsx    # Multi-step form orchestrator
│   ├── StepDigits.tsx            # Step 1: Last 4 digits
│   ├── StepInitials.tsx          # Step 2: Name initials
│   ├── StepClassInfo.tsx         # Step 3: Section/teacher
│   ├── SuccessCard.tsx           # Shows generated ID
│   ├── LoginForm.tsx             # Returning user login
│   ├── StudentIdCard.tsx         # Display current ID
│   └── StudentStatusBar.tsx      # Header status indicator
└── pages/
    └── StudentIdPage.tsx         # Main registration page
```

## Code Examples with Comments

### types.ts
```typescript
/**
 * Student ID Module - Type Definitions
 * 
 * These types are used across the module to ensure type safety.
 * Export them from index.ts for use in other modules.
 */

/**
 * Represents a registered student in the system.
 * Maps directly to the student_registrations database table.
 */
export interface StudentRegistration {
  id: string;                    // UUID from database
  uniqueId: string;              // Memorable ID: "1234-JD-7X"
  lastFourDigits: string;        // Last 4 of student ID
  firstInitial: string;          // First name initial (uppercase)
  lastInitial: string;           // Last name initial (uppercase)
  sectionNumber?: string;        // Optional class section
  teacherName?: string;          // Optional teacher name
  browserSessionId: string;      // Links device to registration
  isActive: boolean;             // Soft delete flag
  lastActiveAt: Date;            // Activity tracking
  createdAt: Date;
}

/**
 * Form data collected during registration.
 * Validated by Zod schemas before submission.
 */
export interface RegistrationFormData {
  lastFourDigits: string;
  firstInitial: string;
  lastInitial: string;
  sectionNumber?: string;
  teacherName?: string;
}

/**
 * Context value provided by StudentProvider.
 * Available via useStudentId() hook.
 */
export interface StudentContextValue {
  // Current student data (null if not registered)
  student: StudentRegistration | null;
  
  // Computed states for conditional rendering
  isRegistered: boolean;
  isLoading: boolean;
  
  // Actions available to components
  register: (data: RegistrationFormData) => Promise<string>;
  login: (uniqueId: string) => Promise<boolean>;
  logout: () => void;
  updateLastActive: () => void;
}
```

### context/StudentContext.tsx
```typescript
/**
 * Student Context Provider
 * 
 * This context manages global student state and provides authentication-like
 * functionality without requiring email/password. It:
 * 
 * 1. Persists student ID in localStorage for returning users
 * 2. Syncs with database on mount to validate stored ID
 * 3. Provides register/login/logout actions
 * 4. Tracks last activity for engagement metrics
 * 
 * USAGE:
 * Wrap your app with <StudentProvider> in App.tsx
 * Access state via useStudentId() hook in any component
 * 
 * CONNECTION TO OTHER MODULES:
 * - Student Dashboard reads studentId to fetch assigned tasks
 * - Teacher Dashboard queries by studentId to show progress
 * - Unit viewers use studentId to track completion
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStudentStorage } from '../hooks/useStudentStorage';
import type { StudentRegistration, StudentContextValue, RegistrationFormData } from '../types';
import { generateUniqueId } from '../utils/generateUniqueId';
import { getBrowserSessionId } from '../utils/browserSession';

const StudentContext = createContext<StudentContextValue | null>(null);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<StudentRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getStoredId, setStoredId, clearStoredId } = useStudentStorage();

  /**
   * On mount, check if user has a stored ID and validate it.
   * This enables "remember me" functionality without auth.
   */
  useEffect(() => {
    async function validateStoredStudent() {
      const storedId = getStoredId();
      if (!storedId) {
        setIsLoading(false);
        return;
      }

      // Verify the stored ID still exists in database
      const { data, error } = await supabase
        .from('student_registrations')
        .select('*')
        .eq('unique_id', storedId)
        .eq('is_active', true)
        .single();

      if (data && !error) {
        setStudent(mapDbToStudent(data));
        updateLastActive(storedId);
      } else {
        // Stored ID is invalid, clear it
        clearStoredId();
      }
      setIsLoading(false);
    }

    validateStoredStudent();
  }, []);

  /**
   * Register a new student.
   * 
   * FLOW:
   * 1. Generate unique ID using last4 + initials + random
   * 2. Check for collisions in database
   * 3. Insert new registration
   * 4. Store ID locally for persistence
   * 5. Update context state
   */
  async function register(data: RegistrationFormData): Promise<string> {
    const browserSessionId = getBrowserSessionId();
    const uniqueId = await generateUniqueId(data, supabase);

    const { data: inserted, error } = await supabase
      .from('student_registrations')
      .insert({
        unique_id: uniqueId,
        last_four_digits: data.lastFourDigits,
        first_initial: data.firstInitial.toUpperCase(),
        last_initial: data.lastInitial.toUpperCase(),
        section_number: data.sectionNumber || null,
        teacher_name: data.teacherName || null,
        browser_session_id: browserSessionId,
      })
      .select()
      .single();

    if (error) throw error;

    setStudent(mapDbToStudent(inserted));
    setStoredId(uniqueId);
    return uniqueId;
  }

  /**
   * Login with existing unique ID.
   * Used by returning students who remember their ID.
   */
  async function login(uniqueId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('student_registrations')
      .select('*')
      .eq('unique_id', uniqueId.toUpperCase())
      .eq('is_active', true)
      .single();

    if (data && !error) {
      setStudent(mapDbToStudent(data));
      setStoredId(uniqueId.toUpperCase());
      updateLastActive(uniqueId);
      return true;
    }
    return false;
  }

  /**
   * Logout clears local storage but doesn't delete registration.
   * Student can login again with their unique ID.
   */
  function logout() {
    clearStoredId();
    setStudent(null);
  }

  return (
    <StudentContext.Provider value={{
      student,
      isRegistered: !!student,
      isLoading,
      register,
      login,
      logout,
      updateLastActive: () => student && updateLastActive(student.uniqueId),
    }}>
      {children}
    </StudentContext.Provider>
  );
}

/**
 * Custom hook to access student context.
 * Throws if used outside StudentProvider.
 */
export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within StudentProvider');
  }
  return context;
}
```

### utils/generateUniqueId.ts
```typescript
/**
 * Unique ID Generation Algorithm
 * 
 * Generates memorable IDs in format: {last4}-{initials}-{random2}
 * Example: 1234-JD-7X
 * 
 * DESIGN DECISIONS:
 * - Uses student's own info (memorable)
 * - Only partial ID (privacy-preserving)
 * - Random suffix (collision-resistant)
 * - Uppercase letters only (easy to read)
 * 
 * COLLISION HANDLING:
 * If generated ID exists, regenerate with new random suffix.
 * Max 10 attempts before throwing error.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { RegistrationFormData } from '../types';

// Characters used in random suffix (no confusing chars like 0/O, 1/I)
const RANDOM_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Generate a random 2-character suffix.
 */
function generateRandomSuffix(): string {
  let result = '';
  for (let i = 0; i < 2; i++) {
    result += RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length));
  }
  return result;
}

/**
 * Generate unique ID with collision checking.
 * 
 * @param data - Registration form data with student info
 * @param supabase - Supabase client for database queries
 * @returns Promise<string> - The generated unique ID
 * @throws Error if unable to generate unique ID after max attempts
 */
export async function generateUniqueId(
  data: RegistrationFormData,
  supabase: SupabaseClient
): Promise<string> {
  const { lastFourDigits, firstInitial, lastInitial } = data;
  const initials = `${firstInitial}${lastInitial}`.toUpperCase();
  
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const suffix = generateRandomSuffix();
    const uniqueId = `${lastFourDigits}-${initials}-${suffix}`;

    // Check if this ID already exists
    const { data: existing } = await supabase
      .from('student_registrations')
      .select('id')
      .eq('unique_id', uniqueId)
      .single();

    if (!existing) {
      return uniqueId; // ID is unique, return it
    }

    attempts++;
  }

  throw new Error('Unable to generate unique ID after maximum attempts');
}
```

### components/RegistrationWizard.tsx
```typescript
/**
 * Multi-Step Registration Wizard
 * 
 * Orchestrates the registration flow through 3 steps:
 * 1. StepDigits - Collect last 4 digits of student ID
 * 2. StepInitials - Collect first/last name initials
 * 3. StepClassInfo - Collect optional section/teacher info
 * 
 * After completion, shows SuccessCard with the generated ID.
 * 
 * STATE MANAGEMENT:
 * - Uses local state for form data and current step
 * - Calls context's register() on final submission
 * - Passes step-specific props to child components
 * 
 * REUSABILITY:
 * This pattern can be adapted for any multi-step form:
 * 1. Define steps as components with onNext/onBack props
 * 2. Manage currentStep state in parent
 * 3. Accumulate form data across steps
 * 4. Submit on final step
 */

import React, { useState } from 'react';
import { useStudentId } from '../hooks/useStudentId';
import { StepDigits } from './StepDigits';
import { StepInitials } from './StepInitials';
import { StepClassInfo } from './StepClassInfo';
import { SuccessCard } from './SuccessCard';
import type { RegistrationFormData } from '../types';

interface RegistrationWizardProps {
  onComplete?: (uniqueId: string) => void;
}

type Step = 'digits' | 'initials' | 'classInfo' | 'success';

export function RegistrationWizard({ onComplete }: RegistrationWizardProps) {
  // Track current step in wizard
  const [step, setStep] = useState<Step>('digits');
  
  // Accumulate form data across steps
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({});
  
  // Store generated ID for success screen
  const [generatedId, setGeneratedId] = useState<string>('');
  
  // Access registration function from context
  const { register } = useStudentId();

  /**
   * Update form data and advance to next step.
   * Each step component calls this with its collected data.
   */
  function handleStepComplete(stepData: Partial<RegistrationFormData>, nextStep: Step) {
    setFormData(prev => ({ ...prev, ...stepData }));
    setStep(nextStep);
  }

  /**
   * Final submission: register student and show success.
   */
  async function handleFinalSubmit(finalData: Partial<RegistrationFormData>) {
    const completeData = { ...formData, ...finalData } as RegistrationFormData;
    
    try {
      const uniqueId = await register(completeData);
      setGeneratedId(uniqueId);
      setStep('success');
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error (show toast, etc.)
    }
  }

  // Render current step
  switch (step) {
    case 'digits':
      return (
        <StepDigits 
          onNext={(data) => handleStepComplete(data, 'initials')}
        />
      );
    case 'initials':
      return (
        <StepInitials
          onNext={(data) => handleStepComplete(data, 'classInfo')}
          onBack={() => setStep('digits')}
        />
      );
    case 'classInfo':
      return (
        <StepClassInfo
          onNext={handleFinalSubmit}
          onBack={() => setStep('initials')}
        />
      );
    case 'success':
      return (
        <SuccessCard
          uniqueId={generatedId}
          onContinue={() => onComplete?.(generatedId)}
        />
      );
  }
}
```

## Integration with Other Modules

### How Student Dashboard Uses This Module
```typescript
// In student-dashboard/hooks/useStudentTasks.ts
import { useStudentId } from '@/features/student-id';

export function useStudentTasks() {
  // Get current student from Student ID module
  const { student, isRegistered } = useStudentId();
  
  // Fetch tasks assigned to this student
  const { data: tasks } = useQuery({
    queryKey: ['tasks', student?.uniqueId],
    queryFn: () => fetchTasksForStudent(student!.uniqueId, student?.sectionNumber),
    enabled: isRegistered, // Only fetch when student is registered
  });
  
  return { tasks, isLoading: !isRegistered };
}
```

### How Teacher Dashboard Uses This Module
```typescript
// In teacher-dashboard/hooks/useStudentList.ts
// Teacher dashboard queries student_registrations directly
// but uses the same types for consistency

import type { StudentRegistration } from '@/features/student-id';

export function useStudentList(filters: StudentFilters) {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: async () => {
      const query = supabase
        .from('student_registrations')
        .select('*')
        .eq('is_active', true);
      
      if (filters.section) {
        query.eq('section_number', filters.section);
      }
      
      const { data } = await query;
      return data as StudentRegistration[];
    },
  });
}
```

## Customization Points

### Changing ID Format
Edit `utils/generateUniqueId.ts` to change the format:
```typescript
// Current: 1234-JD-7X
const uniqueId = `${lastFourDigits}-${initials}-${suffix}`;

// Alternative: JD-1234-7X (initials first)
const uniqueId = `${initials}-${lastFourDigits}-${suffix}`;

// Alternative: S-1234-JD (with prefix)
const uniqueId = `S-${lastFourDigits}-${initials}`;
```

### Adding Validation Rules
Edit `utils/validation.ts` to add custom validation:
```typescript
export const registrationSchema = z.object({
  lastFourDigits: z.string()
    .length(4, 'Must be exactly 4 digits')
    .regex(/^\d+$/, 'Must contain only numbers'),
  
  firstInitial: z.string()
    .length(1, 'Must be exactly 1 letter')
    .regex(/^[A-Za-z]$/, 'Must be a letter'),
  
  // Add custom validation
  sectionNumber: z.string()
    .regex(/^[A-Z]\d{2}$/, 'Must be format like A01')
    .optional(),
});
```

### Persisting to Different Storage
Edit `hooks/useStudentStorage.ts` to use different storage:
```typescript
// Current: localStorage
export function useStudentStorage() {
  return {
    getStoredId: () => localStorage.getItem(STORAGE_KEY),
    setStoredId: (id: string) => localStorage.setItem(STORAGE_KEY, id),
    clearStoredId: () => localStorage.removeItem(STORAGE_KEY),
  };
}

// Alternative: sessionStorage (clears on browser close)
export function useStudentStorage() {
  return {
    getStoredId: () => sessionStorage.getItem(STORAGE_KEY),
    // ...
  };
}

// Alternative: Cookie (works across subdomains)
export function useStudentStorage() {
  return {
    getStoredId: () => getCookie(STORAGE_KEY),
    setStoredId: (id: string) => setCookie(STORAGE_KEY, id, { days: 30 }),
    // ...
  };
}
```
