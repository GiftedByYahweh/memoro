export const AUTH_CONSTRAINTS = {
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  VERIFICATION_CODE_LENGTH: 6,
  TOKEN_HASH_LENGTH: 64,
  IP_ADDRESS_MAX_LENGTH: 45,
  VERIFICATION_CODE_TTL_MS: 900000,
} as const;

export const VerificationCodeType = {
  REGISTRATION: 'registration',
  PASSWORD_RESET: 'password_reset',
} as const;

export type VerificationCodeType = (typeof VerificationCodeType)[keyof typeof VerificationCodeType];
