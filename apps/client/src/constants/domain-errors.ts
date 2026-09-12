import { DomainErrorCode } from '@memoro/shared';

export const DOMAIN_ERROR_KEYS: Record<DomainErrorCode, string> = {
  [DomainErrorCode.USER_ALREADY_EXISTS]: 'errors.userAlreadyExists',
  [DomainErrorCode.INVALID_CREDENTIALS]: 'errors.invalidCredentials',
  [DomainErrorCode.SESSION_EXPIRED]: 'errors.sessionExpired',
  [DomainErrorCode.UNAUTHORIZED]: 'errors.unauthorized',
};

export const DEFAULT_ERROR_KEY = 'errors.unknown';
