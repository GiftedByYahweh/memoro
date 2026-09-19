import type { VerificationCodeType } from '@memoro/shared';
import type { VerificationCode } from '../entities/verification-code.entity';

export interface CreateVerificationCodeData {
  email: string;
  code: string;
  type: VerificationCodeType;
  expiresAt: Date;
}

export interface VerificationCodeRepository {
  create(data: CreateVerificationCodeData): Promise<VerificationCode>;
  markVerified(id: string): Promise<void>;
  findVerified(email: string, type: VerificationCodeType): Promise<VerificationCode | null>;
  deleteByEmailAndType(email: string, type: VerificationCodeType): Promise<void>;
  findValid(
    email: string,
    code: string,
    type: VerificationCodeType,
  ): Promise<VerificationCode | null>;
}
