import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { AUTH_CONSTRAINTS, VerificationCodeType } from '@memoro/shared';
import { pgEnumValues } from '../pg-enum-values';

export const verificationCodeTypeEnum = pgEnum(
  'verification_code_type',
  pgEnumValues(VerificationCodeType),
);

export const verificationCodesTable = pgTable('verification_codes', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH }).notNull(),
  code: varchar('code', { length: AUTH_CONSTRAINTS.VERIFICATION_CODE_LENGTH }).notNull(),
  type: verificationCodeTypeEnum('type').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
