import type { DomainErrorCode } from './errors';

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  timestamp: number;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  errorCode: DomainErrorCode | null;
  timestamp: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
