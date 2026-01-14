import { AUTH_ERROR_MESSAGES } from '../constants';

/**
 * Get a user-friendly error message from an error code
 */
export function getErrorMessage(errorCode: string | null): string | null {
  if (!errorCode) return null;
  
  return AUTH_ERROR_MESSAGES[errorCode] ?? `Authentication error: ${errorCode}`;
}

/**
 * Map Supabase auth errors to user-friendly messages
 */
export function mapSupabaseError(error: Error | null): string | null {
  if (!error) return null;
  
  const message = error.message;
  
  if (message.includes('Invalid login credentials')) {
    return AUTH_ERROR_MESSAGES.invalid_credentials;
  }
  
  if (message.includes('User already registered')) {
    return AUTH_ERROR_MESSAGES.user_exists;
  }
  
  return message;
}
