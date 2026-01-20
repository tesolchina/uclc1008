/**
 * @fileoverview Centralized error handling utilities for the application.
 * 
 * This module provides:
 * - Custom error classes for different error types
 * - Error parsing utilities
 * - User-friendly error message generation
 * - Error logging integration
 */

import { logger } from './logger';

// ============================================================================
// Error Types
// ============================================================================

/**
 * Base application error with additional context
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.isOperational = isOperational;
    this.context = context;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace?.(this, this.constructor);
  }
}

/**
 * API-related errors (network, rate limits, auth)
 */
export class ApiError extends AppError {
  public readonly statusCode?: number;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    context?: Record<string, unknown>
  ) {
    super(message, code, true, context);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Validation errors for user input
 */
export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', true, { field });
    this.name = 'ValidationError';
    this.field = field;
  }
}

// ============================================================================
// Error Code Constants
// ============================================================================

export const ErrorCodes = {
  // API Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  DAILY_LIMIT_REACHED: 'DAILY_LIMIT_REACHED',
  PAYMENT_REQUIRED: 'PAYMENT_REQUIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  
  // Auth Errors
  AUTH_FAILED: 'AUTH_FAILED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  
  // Validation Errors
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  
  // AI Errors
  AI_UNAVAILABLE: 'AI_UNAVAILABLE',
  AI_RESPONSE_ERROR: 'AI_RESPONSE_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// ============================================================================
// Error Utilities
// ============================================================================

/**
 * Converts an unknown error to a standardized AppError
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', true, {
      originalName: error.name,
      stack: error.stack,
    });
  }

  if (typeof error === 'string') {
    return new AppError(error);
  }

  return new AppError('An unexpected error occurred');
}

/**
 * Extracts a user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  const normalized = normalizeError(error);
  
  // Map specific error codes to user-friendly messages
  const messageMap: Record<string, string> = {
    [ErrorCodes.NETWORK_ERROR]: 'Unable to connect. Please check your internet connection.',
    [ErrorCodes.RATE_LIMITED]: 'Too many requests. Please wait a moment and try again.',
    [ErrorCodes.DAILY_LIMIT_REACHED]: 'Daily AI limit reached. Set up your HKBU API key for unlimited access.',
    [ErrorCodes.PAYMENT_REQUIRED]: 'Additional credits required. Please add credits to continue.',
    [ErrorCodes.UNAUTHORIZED]: 'Please log in to continue.',
    [ErrorCodes.SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
    [ErrorCodes.AI_UNAVAILABLE]: 'AI service is temporarily unavailable. Please try again later.',
  };

  return messageMap[normalized.code] || normalized.message;
}

/**
 * Logs an error with appropriate severity and context
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const normalized = normalizeError(error);
  
  logger.error(normalized.message, {
    code: normalized.code,
    isOperational: normalized.isOperational,
    ...normalized.context,
    ...context,
  });
}

/**
 * Parses HTTP response errors into ApiError
 */
export function parseHttpError(response: Response, body?: unknown): ApiError {
  const status = response.status;
  let code: ErrorCode;
  let message: string;

  switch (status) {
    case 401:
      code = ErrorCodes.UNAUTHORIZED;
      message = 'Authentication required';
      break;
    case 402:
      code = ErrorCodes.PAYMENT_REQUIRED;
      message = 'Payment required';
      break;
    case 403:
      code = ErrorCodes.FORBIDDEN;
      message = 'Access denied';
      break;
    case 404:
      code = ErrorCodes.NOT_FOUND;
      message = 'Resource not found';
      break;
    case 429:
      code = ErrorCodes.RATE_LIMITED;
      message = 'Rate limit exceeded';
      break;
    default:
      code = status >= 500 ? ErrorCodes.SERVER_ERROR : ErrorCodes.NETWORK_ERROR;
      message = `Request failed (${status})`;
  }

  // Try to extract error message from body
  if (body && typeof body === 'object' && 'error' in body) {
    message = (body as { error: string }).error;
  }

  return new ApiError(message, code, status, { body });
}

/**
 * Creates a safe async wrapper with error handling
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  onError?: (error: AppError) => void
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const normalized = normalizeError(error);
      logError(normalized);
      onError?.(normalized);
      throw normalized;
    }
  }) as T;
}
