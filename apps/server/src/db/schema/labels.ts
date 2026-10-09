import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { LABEL_CONSTRAINTS } from '@memoro/shared';

export const labelsTable = pgTable('labels', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: LABEL_CONSTRAINTS.NAME_MAX_LENGTH }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
