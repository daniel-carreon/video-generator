/**
 * Error Handler Utilities
 * Centralized error handling across the application
 */

import { AppError } from '@/shared/types';

export class ErrorHandler {
  static handle(error: unknown): AppError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR',
        statusCode: 500,
      };
    }

    if (typeof error === 'string') {
      return {
        message: error,
        code: 'UNKNOWN_ERROR',
        statusCode: 500,
      };
    }

    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
    };
  }

  static isAppError(error: unknown): error is AppError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    );
  }
}
