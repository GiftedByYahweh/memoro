import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { mediaTable } from './media';
import { collectionsTable } from './collections';

export const mediaCollectionsTable = pgTable(
  'media_collections',
  {
    mediaId: uuid('media_id')
      .notNull()
      .references(() => mediaTable.id, { onDelete: 'cascade' }),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collectionsTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.mediaId, t.collectionId] })],
);
