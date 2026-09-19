import type { ApiErrorResponse, ApiSuccessResponse, AppErrorCode } from '@memoro/shared';

interface ErrorResponseOptions {
  message: string;
  code: AppErrorCode;
}

const successResponse = <T>(data: T): ApiSuccessResponse<T> => {
  return {
    success: true,
    data,
    timestamp: Date.now(),
  };
};

const errorResponse = (options: ErrorResponseOptions): ApiErrorResponse => {
  return {
    success: false,
    message: options.message,
    code: options.code,
    timestamp: Date.now(),
  };
};

export { successResponse, errorResponse };
