export const DomainErrorCode = {
  USER_ALREADY_EXISTS: 1000,
  INVALID_CREDENTIALS: 1001,
  SESSION_EXPIRED: 1002,
  UNAUTHORIZED: 1003,
} as const;

export type DomainErrorCode = (typeof DomainErrorCode)[keyof typeof DomainErrorCode];
