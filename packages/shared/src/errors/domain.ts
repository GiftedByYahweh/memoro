export const DomainErrorCode = {
  USER_ALREADY_EXISTS: 1001,
  INVALID_LOGIN_CREDENTIALS: 1002,
  SESSION_EXPIRED: 1003,
} as const;

export type DomainErrorCode = (typeof DomainErrorCode)[keyof typeof DomainErrorCode];
