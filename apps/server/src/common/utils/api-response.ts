import type { ApiErrorResponse, ApiSuccessResponse, DomainErrorCode } from '@memoro/shared';
import type { ErrorCode } from '@/common/error/app.error';

interface ErrorResponseOptions {
  code: ErrorCode;
  errorCode?: DomainErrorCode | null;
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
    code: options.code,
    errorCode: options.errorCode ?? null,
    timestamp: Date.now(),
  };
};

export { successResponse, errorResponse };
