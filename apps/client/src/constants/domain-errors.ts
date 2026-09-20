import { DomainErrorCode } from '@memoro/shared';

export const DOMAIN_ERROR_KEYS: Record<DomainErrorCode, string> = {
  [DomainErrorCode.USER_ALREADY_EXISTS]: 'errors.userAlreadyExists',
  [DomainErrorCode.INVALID_LOGIN_CREDENTIALS]: 'errors.invalidLoginCredentials',
  [DomainErrorCode.SESSION_EXPIRED]: 'errors.sessionExpired',
  [DomainErrorCode.INVALID_VERIFICATION_CODE]: 'errors.invalidVerificationCode',
  [DomainErrorCode.VERIFICATION_CODE_EXPIRED]: 'errors.verificationCodeExpired',
  [DomainErrorCode.USER_NOT_FOUND]: 'errors.userNotFound',
  [DomainErrorCode.USERNAME_ALREADY_EXISTS]: 'errors.usernameAlreadyExists',
  [DomainErrorCode.MEDIA_NOT_FOUND]: 'errors.mediaNotFound',
  [DomainErrorCode.PROFILE_NOT_FOUND]: 'errors.profileNotFound',
  [DomainErrorCode.INVALID_FILE_TYPE]: 'errors.invalidFileType',
  [DomainErrorCode.MEDIA_FORBIDDEN]: 'errors.mediaForbidden',
};

export const DEFAULT_ERROR_KEY = 'errors.unknown';
