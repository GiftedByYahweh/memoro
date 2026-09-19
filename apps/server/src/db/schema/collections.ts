import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles';
import { mediaTable } from './media';
import { COLLECTION_CONSTRAINTS, CollectionVisibilityStatus } from '@memoro/shared';

export const collectionVisibilityEnum = pgEnum(
  'collection_visibility',
  Object.values(CollectionVisibilityStatus) as [string, ...string[]],
);

export const collectionsTable = pgTable('collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => profilesTable.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: COLLECTION_CONSTRAINTS.TITLE_MAX_LENGTH }).notNull(),
  description: varchar('description', { length: COLLECTION_CONSTRAINTS.DESCRIPTION_MAX_LENGTH }),
  visibility: collectionVisibilityEnum('visibility').notNull().default('private'),
  wallpaperMediaId: uuid('wallpaper_media_id').references(() => mediaTable.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
