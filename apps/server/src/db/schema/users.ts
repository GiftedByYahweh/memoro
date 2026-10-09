import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { AUTH_CONSTRAINTS, USER_CONSTRAINTS, UserSex } from '@memoro/shared';
import { pgEnumValues } from '../pg-enum-values';

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: AUTH_CONSTRAINTS.EMAIL_MAX_LENGTH }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  username: varchar('username', { length: USER_CONSTRAINTS.USERNAME_MAX_LENGTH })
    .notNull()
    .unique(),
  sex: varchar('sex', {
    length: USER_CONSTRAINTS.SEX_MAX_LENGTH,
    enum: pgEnumValues(UserSex),
  }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
