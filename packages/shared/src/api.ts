import type { DomainErrorCode } from './errors.js';

export interface ApiSuccessResponse<T = unknown> {
  readonly success: true;
  readonly data: T;
  readonly message?: string;
  readonly timestamp?: number;
}

export interface ApiErrorResponse {
  readonly success: false;
  readonly errorCode: DomainErrorCode | null;
  readonly message: string;
  readonly data: null;
  readonly timestamp?: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
