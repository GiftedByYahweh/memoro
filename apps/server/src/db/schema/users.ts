import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { AUTH_CONSTRAINTS } from '@memoro/shared';

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
