/**
 * Custom error classes for the application
 */

export class GoogleAPIError extends Error {
  constructor(
    message: string,
    public code?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'GoogleAPIError';
  }
}

export class SyncError extends Error {
  constructor(
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'SyncError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof GoogleAPIError) {
    return error.code === 429 || error.code === 503;
  }
  return false;
}
