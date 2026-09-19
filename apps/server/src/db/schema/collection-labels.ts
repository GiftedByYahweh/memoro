import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { collectionsTable } from './collections';
import { labelsTable } from './labels';

export const collectionLabelsTable = pgTable(
  'collection_labels',
  {
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collectionsTable.id, { onDelete: 'cascade' }),
    labelId: uuid('label_id')
      .notNull()
      .references(() => labelsTable.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.labelId] })],
);
