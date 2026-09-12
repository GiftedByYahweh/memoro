import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { PROFILE_CONSTRAINTS } from '@memoro/shared';
import { usersTable } from './users';

export const profilesTable = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  username: varchar('username', { length: PROFILE_CONSTRAINTS.USERNAME_MAX_LENGTH }).unique(),
  avatar: text('avatar'),
  sex: varchar('sex', { length: PROFILE_CONSTRAINTS.SEX_MAX_LENGTH }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
