import { ErrorCode, type AppErrorCode } from './appError.js';

export const HTTP_STATUS_BY_ERROR_CODE: Record<AppErrorCode, number> = {
  [ErrorCode.NOT_ENOUGH_PERMISSIONS]: 403,
  [ErrorCode.INVALID_CREDENTIALS]: 401,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.CONFLICT]: 409,
  [ErrorCode.INVALID_STATE]: 400,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.TOO_MANY_REQUESTS]: 429,
  [ErrorCode.INTERNAL_SERVER_ERROR]: 500,
};
