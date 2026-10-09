import type { verificationCodesTable } from '@/db/schema/verification-codes';
import type { VerificationCode } from '../entities/verification-code.entity';

type VerificationCodeRow = typeof verificationCodesTable.$inferSelect;

export function toVerificationCodeEntity(row: VerificationCodeRow): VerificationCode {
  return {
    id: row.id,
    email: row.email,
    code: row.code,
    type: row.type,
    expiresAt: row.expiresAt,
    verifiedAt: row.verifiedAt,
    createdAt: row.createdAt,
  };
}
