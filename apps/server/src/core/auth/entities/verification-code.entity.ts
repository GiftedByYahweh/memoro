import type { VerificationCodeType } from '@memoro/shared';

export interface VerificationCode {
  readonly id: string;
  readonly email: string;
  readonly code: string;
  readonly type: VerificationCodeType;
  readonly expiresAt: Date;
  readonly verifiedAt: Date | null;
  readonly createdAt: Date;
}
