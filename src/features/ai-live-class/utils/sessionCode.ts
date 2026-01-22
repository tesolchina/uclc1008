/**
 * =============================================================================
 * AI LIVE CLASS - SESSION CODE UTILITIES
 * =============================================================================
 * 
 * Utility functions for generating and validating session codes.
 * Session codes are used by students to join live sessions.
 * 
 * @module ai-live-class/utils/sessionCode
 * @version 1.0.0
 * 
 * =============================================================================
 */

import { SESSION_CONFIG } from '../constants';

/**
 * Generates a random session code.
 * 
 * Uses cryptographically random values when available (via crypto.getRandomValues),
 * falling back to Math.random() for environments without Web Crypto API.
 * 
 * The generated code:
 * - Is 6 characters long by default
 * - Uses uppercase letters and numbers, excluding ambiguous characters (0, O, I, L)
 * - Provides approximately 2.1 billion unique combinations
 * 
 * @param length - Optional custom length (default: 6)
 * @returns A random alphanumeric session code
 * 
 * @example
 * ```typescript
 * const code = generateSessionCode(); // e.g., "HK7M2N"
 * const longerCode = generateSessionCode(8); // e.g., "AB3XY7MK"
 * ```
 */
export function generateSessionCode(length: number = SESSION_CONFIG.CODE_LENGTH): string {
  const characters = SESSION_CONFIG.CODE_CHARACTERS;
  let result = '';
  
  // Use crypto.getRandomValues if available for better randomness
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      result += characters[randomValues[i] % characters.length];
    }
  } else {
    // Fallback to Math.random (less secure but functional)
    for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }
  }
  
  return result;
}

/**
 * Validates the format of a session code.
 * 
 * Checks that the code:
 * - Is exactly the expected length
 * - Contains only valid characters (uppercase alphanumeric, excluding ambiguous)
 * 
 * Note: This only validates format, not whether the session exists.
 * 
 * @param code - The session code to validate
 * @returns True if the code format is valid, false otherwise
 * 
 * @example
 * ```typescript
 * isValidSessionCode("ABC123"); // true
 * isValidSessionCode("abc123"); // false (lowercase)
 * isValidSessionCode("AB");     // false (too short)
 * isValidSessionCode("ABCDEF0"); // false (contains 0)
 * ```
 */
export function isValidSessionCode(code: string): boolean {
  // Check length
  if (code.length !== SESSION_CONFIG.CODE_LENGTH) {
    return false;
  }
  
  // Check that all characters are valid
  const validChars = new Set(SESSION_CONFIG.CODE_CHARACTERS.split(''));
  for (const char of code) {
    if (!validChars.has(char)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Normalizes a session code to uppercase.
 * 
 * Students might enter codes in mixed or lowercase. This function
 * standardizes the input while preserving invalid characters for
 * proper error handling downstream.
 * 
 * @param code - The raw input code
 * @returns The normalized (uppercase) code
 * 
 * @example
 * ```typescript
 * normalizeSessionCode("abc123"); // "ABC123"
 * normalizeSessionCode("  ABC123  "); // "ABC123"
 * normalizeSessionCode("abc-123"); // "ABC-123" (preserves invalid chars)
 * ```
 */
export function normalizeSessionCode(code: string): string {
  return code.trim().toUpperCase();
}

/**
 * Formats a session code for display with grouping.
 * 
 * Adds a space or separator in the middle for easier reading.
 * Only applies to 6-character codes.
 * 
 * @param code - The session code to format
 * @param separator - The separator character (default: space)
 * @returns The formatted code string
 * 
 * @example
 * ```typescript
 * formatSessionCodeForDisplay("ABC123");      // "ABC 123"
 * formatSessionCodeForDisplay("ABC123", "-"); // "ABC-123"
 * ```
 */
export function formatSessionCodeForDisplay(
  code: string, 
  separator: string = ' '
): string {
  if (code.length === 6) {
    return `${code.slice(0, 3)}${separator}${code.slice(3)}`;
  }
  return code;
}

/**
 * Extracts a session code from various input formats.
 * 
 * Handles cases where users might paste a full URL or include
 * extra characters. Attempts to find a valid code pattern.
 * 
 * @param input - Raw user input that might contain a session code
 * @returns The extracted code or null if not found
 * 
 * @example
 * ```typescript
 * extractSessionCode("ABC123");                    // "ABC123"
 * extractSessionCode("Join code: ABC123");         // "ABC123"
 * extractSessionCode("https://site.com/join/ABC123"); // "ABC123"
 * extractSessionCode("no code here");              // null
 * ```
 */
export function extractSessionCode(input: string): string | null {
  // Normalize input
  const normalized = input.toUpperCase().replace(/\s/g, '');
  
  // Look for a sequence of valid characters of the right length
  const validCharsPattern = `[${SESSION_CONFIG.CODE_CHARACTERS}]{${SESSION_CONFIG.CODE_LENGTH}}`;
  const regex = new RegExp(validCharsPattern);
  const match = normalized.match(regex);
  
  return match ? match[0] : null;
}
