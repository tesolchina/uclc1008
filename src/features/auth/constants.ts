// Student ID generation
export const STUDENT_ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const STUDENT_ID_MAX_ATTEMPTS = 10;
export const STUDENT_ID_PATTERN = /^\d{4}-[A-Z]{2}-[A-Z0-9]{2}$/i;

// LocalStorage keys
export const STORAGE_KEYS = {
  STUDENT_ID: 'student_id',
  HKBU_SESSION: 'hkbu_session',
  OAUTH_STATE: 'oauth_state',
} as const;

// Error codes and messages
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  no_code: 'Authorization code not received. Please try again.',
  config_error: 'OAuth configuration error. Please contact support.',
  token_exchange_failed: 'Failed to complete authentication. Please try again.',
  invalid_token: 'Invalid authentication token received.',
  profile_error: 'Error creating user profile. Please try again.',
  session_error: 'Error creating session. Please try again.',
  server_error: 'Server error occurred. Please try again later.',
  invalid_credentials: 'Invalid email or password. Please try again.',
  user_exists: 'An account with this email already exists. Please sign in instead.',
  unique_id_failed: 'Unable to generate a unique ID. Please try again or contact support.',
  id_taken: 'This ID was just taken. Please try again.',
  invalid_id_format: 'Please enter a valid ID (format: 1234-JD-XX)',
  invalid_digits: 'Please enter exactly 4 digits',
  invalid_initials: 'Please enter single letters for initials',
};

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  STUDENT_ID_DIGITS: 4,
  MAX_REGISTRATION_ATTEMPTS: 10,
} as const;
