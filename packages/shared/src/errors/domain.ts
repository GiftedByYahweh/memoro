export const DomainErrorCode = {
  USER_ALREADY_EXISTS: 1001,
  INVALID_LOGIN_CREDENTIALS: 1002,
  SESSION_EXPIRED: 1003,
  INVALID_VERIFICATION_CODE: 1004,
  VERIFICATION_CODE_EXPIRED: 1005,
  USER_NOT_FOUND: 1006,
  USERNAME_ALREADY_EXISTS: 1007,
} as const;

export type DomainErrorCode = (typeof DomainErrorCode)[keyof typeof DomainErrorCode];
