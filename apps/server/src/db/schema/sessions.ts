import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { AUTH_CONSTRAINTS } from '@memoro/shared';
import { usersTable } from './users';

export const sessionsTable = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: AUTH_CONSTRAINTS.TOKEN_HASH_LENGTH })
    .notNull()
    .unique(),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: AUTH_CONSTRAINTS.IP_ADDRESS_MAX_LENGTH }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
