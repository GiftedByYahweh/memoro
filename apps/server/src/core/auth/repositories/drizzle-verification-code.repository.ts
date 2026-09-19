import { and, desc, eq, gt, isNotNull } from 'drizzle-orm';
import type { DBProvider } from '@/db/db.provider';
import { verificationCodesTable } from '@/db/schema/verification-codes';
import type { VerificationCodeType } from '@memoro/shared';
import type { VerificationCode } from '../entities/verification-code.entity';
import { toVerificationCodeEntity } from '../mappers/verification-code.mapper';
import type {
  CreateVerificationCodeData,
  VerificationCodeRepository,
} from './verification-code.repository';

async function createVerificationCode(
  dbProvider: DBProvider,
  data: CreateVerificationCodeData,
): Promise<VerificationCode> {
  const [row] = await dbProvider
    .current()
    .insert(verificationCodesTable)
    .values({
      email: data.email,
      code: data.code,
      type: data.type,
      expiresAt: data.expiresAt,
    })
    .returning();

  if (!row) throw new Error('Failed to create verification code');
  return toVerificationCodeEntity(row);
}

async function findValidCode(
  dbProvider: DBProvider,
  email: string,
  code: string,
  type: VerificationCodeType,
): Promise<VerificationCode | null> {
  const now = new Date();
  const [row] = await dbProvider
    .current()
    .select()
    .from(verificationCodesTable)
    .where(
      and(
        eq(verificationCodesTable.email, email),
        eq(verificationCodesTable.code, code),
        eq(verificationCodesTable.type, type),
        gt(verificationCodesTable.expiresAt, now),
      ),
    )
    .orderBy(desc(verificationCodesTable.createdAt))
    .limit(1);

  return row ? toVerificationCodeEntity(row) : null;
}

async function markCodeVerified(dbProvider: DBProvider, id: string): Promise<void> {
  await dbProvider
    .current()
    .update(verificationCodesTable)
    .set({ verifiedAt: new Date() })
    .where(eq(verificationCodesTable.id, id));
}

async function findVerifiedCode(
  dbProvider: DBProvider,
  email: string,
  type: VerificationCodeType,
): Promise<VerificationCode | null> {
  const now = new Date();
  const [row] = await dbProvider
    .current()
    .select()
    .from(verificationCodesTable)
    .where(
      and(
        eq(verificationCodesTable.email, email),
        eq(verificationCodesTable.type, type),
        isNotNull(verificationCodesTable.verifiedAt),
        gt(verificationCodesTable.expiresAt, now),
      ),
    )
    .orderBy(desc(verificationCodesTable.createdAt))
    .limit(1);

  return row ? toVerificationCodeEntity(row) : null;
}

async function deleteCodeByEmailAndType(
  dbProvider: DBProvider,
  email: string,
  type: VerificationCodeType,
): Promise<void> {
  await dbProvider
    .current()
    .delete(verificationCodesTable)
    .where(and(eq(verificationCodesTable.email, email), eq(verificationCodesTable.type, type)));
}

export function drizzleVerificationCodeRepository(
  dbProvider: DBProvider,
): VerificationCodeRepository {
  return {
    create: (data: CreateVerificationCodeData) => createVerificationCode(dbProvider, data),
    findValid: (email: string, code: string, type: VerificationCodeType) =>
      findValidCode(dbProvider, email, code, type),
    markVerified: (id: string) => markCodeVerified(dbProvider, id),
    findVerified: (email: string, type: VerificationCodeType) =>
      findVerifiedCode(dbProvider, email, type),
    deleteByEmailAndType: (email: string, type: VerificationCodeType) =>
      deleteCodeByEmailAndType(dbProvider, email, type),
  };
}
