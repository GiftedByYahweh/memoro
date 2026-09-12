import type { DomainErrorCode } from '@memoro/shared';

export const ErrorCode = {
  NOT_ENOUGH_PERMISSIONS: 'NOT_ENOUGH_PERMISSIONS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INVALID_STATE: 'INVALID_STATE',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export class AppError extends Error {
  public code: ErrorCode;
  public errorCode: DomainErrorCode | null;

  constructor(code: ErrorCode, errorCode: DomainErrorCode | null = null) {
    super(code);
    this.name = 'AppError';
    this.code = code;
    this.errorCode = errorCode;
  }
}
