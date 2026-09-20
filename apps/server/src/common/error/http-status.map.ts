import { DomainErrorCode, HttpStatusCode, type AppErrorCode } from '@memoro/shared';

const HTTP_STATUS_MESSAGES: Record<HttpStatusCode, string> = {
  [HttpStatusCode.BAD_REQUEST]: 'Bad Request',
  [HttpStatusCode.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatusCode.FORBIDDEN]: 'Not allowed',
  [HttpStatusCode.NOT_FOUND]: 'Not Found',
  [HttpStatusCode.CONFLICT]: 'Conflict',
  [HttpStatusCode.TOO_MANY_REQUESTS]: 'Too Many Requests',
  [HttpStatusCode.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};

const HTTP_STATUS_BY_APP_ERROR: Record<AppErrorCode, HttpStatusCode> = {
  [HttpStatusCode.BAD_REQUEST]: HttpStatusCode.BAD_REQUEST,
  [HttpStatusCode.UNAUTHORIZED]: HttpStatusCode.UNAUTHORIZED,
  [HttpStatusCode.FORBIDDEN]: HttpStatusCode.FORBIDDEN,
  [HttpStatusCode.NOT_FOUND]: HttpStatusCode.NOT_FOUND,
  [HttpStatusCode.CONFLICT]: HttpStatusCode.CONFLICT,
  [HttpStatusCode.TOO_MANY_REQUESTS]: HttpStatusCode.TOO_MANY_REQUESTS,
  [HttpStatusCode.INTERNAL_SERVER_ERROR]: HttpStatusCode.INTERNAL_SERVER_ERROR,

  [DomainErrorCode.USER_ALREADY_EXISTS]: HttpStatusCode.CONFLICT,
  [DomainErrorCode.INVALID_LOGIN_CREDENTIALS]: HttpStatusCode.UNAUTHORIZED,
  [DomainErrorCode.SESSION_EXPIRED]: HttpStatusCode.UNAUTHORIZED,
  [DomainErrorCode.INVALID_VERIFICATION_CODE]: HttpStatusCode.BAD_REQUEST,
  [DomainErrorCode.VERIFICATION_CODE_EXPIRED]: HttpStatusCode.BAD_REQUEST,
  [DomainErrorCode.USER_NOT_FOUND]: HttpStatusCode.NOT_FOUND,
  [DomainErrorCode.USERNAME_ALREADY_EXISTS]: HttpStatusCode.CONFLICT,
  [DomainErrorCode.MEDIA_NOT_FOUND]: HttpStatusCode.NOT_FOUND,
  [DomainErrorCode.PROFILE_NOT_FOUND]: HttpStatusCode.NOT_FOUND,
  [DomainErrorCode.INVALID_FILE_TYPE]: HttpStatusCode.BAD_REQUEST,
  [DomainErrorCode.MEDIA_FORBIDDEN]: HttpStatusCode.FORBIDDEN,
};

export { HTTP_STATUS_MESSAGES, HTTP_STATUS_BY_APP_ERROR };
