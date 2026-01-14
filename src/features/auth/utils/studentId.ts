import { STORAGE_KEYS, STUDENT_ID_CHARS, STUDENT_ID_PATTERN } from '../constants';

/**
 * Get the stored student ID from localStorage
 */
export function getStoredStudentId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.STUDENT_ID);
}

/**
 * Store the student ID in localStorage
 */
export function setStoredStudentId(id: string): void {
  if (id.trim()) {
    localStorage.setItem(STORAGE_KEYS.STUDENT_ID, id.trim().toUpperCase());
  }
}

/**
 * Clear the stored student ID from localStorage
 */
export function clearStoredStudentId(): void {
  localStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
}

/**
 * Validate student ID format
 */
export function validateStudentIdFormat(id: string): boolean {
  return STUDENT_ID_PATTERN.test(id);
}

/**
 * Generate a random 2-character suffix for student IDs
 */
export function generateRandomSuffix(): string {
  return (
    STUDENT_ID_CHARS.charAt(Math.floor(Math.random() * STUDENT_ID_CHARS.length)) +
    STUDENT_ID_CHARS.charAt(Math.floor(Math.random() * STUDENT_ID_CHARS.length))
  );
}

/**
 * Build a complete student ID from components
 */
export function buildStudentId(
  lastFourDigits: string,
  firstInitial: string,
  lastInitial: string,
  suffix?: string
): string {
  const randomSuffix = suffix || generateRandomSuffix();
  return `${lastFourDigits}-${firstInitial.toUpperCase()}${lastInitial.toUpperCase()}-${randomSuffix}`;
}

/**
 * Parse a student ID into its components
 */
export function parseStudentId(id: string): {
  digits: string;
  initials: string;
  suffix: string;
} | null {
  if (!validateStudentIdFormat(id)) {
    return null;
  }
  
  const parts = id.toUpperCase().split('-');
  return {
    digits: parts[0],
    initials: parts[1],
    suffix: parts[2],
  };
}
