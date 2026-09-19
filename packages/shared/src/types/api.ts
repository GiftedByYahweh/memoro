import type { AppErrorCode } from '../errors';

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  timestamp: number;
}

export interface ApiErrorResponse {
  success: false;
  code: AppErrorCode;
  message: string;
  timestamp: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
