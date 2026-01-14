import { z } from 'zod';
import { VALIDATION, STUDENT_ID_PATTERN } from '../constants';

// Email validation schema
export const emailSchema = z
  .string()
  .trim()
  .email('Please enter a valid email address');

// Password validation schema
export const passwordSchema = z
  .string()
  .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`);

// Display name validation schema
export const displayNameSchema = z
  .string()
  .trim()
  .min(1, 'Please enter your name');

// Student ID validation schema
export const studentIdSchema = z
  .string()
  .trim()
  .regex(STUDENT_ID_PATTERN, 'Please enter a valid ID (format: 1234-JD-XX)');

// Last 4 digits validation
export const lastFourDigitsSchema = z
  .string()
  .regex(/^\d{4}$/, 'Please enter exactly 4 digits');

// Initial validation (single letter)
export const initialSchema = z
  .string()
  .regex(/^[A-Za-z]$/, 'Please enter a single letter');

// Teacher sign-in form schema
export const teacherSignInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Teacher sign-up form schema
export const teacherSignUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
});

// Student login schema
export const studentLoginSchema = z.object({
  studentId: studentIdSchema,
});

// Validation helper functions
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const result = emailSchema.safeParse(email);
  return result.success 
    ? { valid: true } 
    : { valid: false, error: result.error.errors[0]?.message };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  const result = passwordSchema.safeParse(password);
  return result.success 
    ? { valid: true } 
    : { valid: false, error: result.error.errors[0]?.message };
}

export function validateStudentId(id: string): { valid: boolean; error?: string } {
  const result = studentIdSchema.safeParse(id);
  return result.success 
    ? { valid: true } 
    : { valid: false, error: result.error.errors[0]?.message };
}
