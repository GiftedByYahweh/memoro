import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { mediaTable } from './media';
import { COLLECTION_CONSTRAINTS, CollectionVisibilityStatus } from '@memoro/shared';
import { pgEnumValues } from '../pg-enum-values';

export const collectionVisibilityEnum = pgEnum(
  'collection_visibility',
  pgEnumValues(CollectionVisibilityStatus),
);

export const collectionsTable = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: COLLECTION_CONSTRAINTS.TITLE_MAX_LENGTH }).notNull(),
  description: varchar('description', { length: COLLECTION_CONSTRAINTS.DESCRIPTION_MAX_LENGTH }),
  visibility: collectionVisibilityEnum('visibility').notNull().default('private'),
  wallpaperMediaId: uuid('wallpaper_media_id').references(() => mediaTable.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
