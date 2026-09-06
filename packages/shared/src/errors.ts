export const DomainErrorCode = {
  USER_ALREADY_EXISTS: 1000,
} as const;

export type DomainErrorCode = (typeof DomainErrorCode)[keyof typeof DomainErrorCode];
