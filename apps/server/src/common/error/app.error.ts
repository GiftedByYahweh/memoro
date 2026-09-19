import type { AppErrorCode } from '@memoro/shared';
import { HTTP_STATUS_BY_APP_ERROR, HTTP_STATUS_MESSAGES } from './http-status.map';

export class AppError extends Error {
  public readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message?: string) {
    const statusCode = HTTP_STATUS_BY_APP_ERROR[code];
    const defaultMessage = message ?? HTTP_STATUS_MESSAGES[statusCode];

    super(defaultMessage);
    this.name = 'AppError';
    this.code = code;
  }
}
