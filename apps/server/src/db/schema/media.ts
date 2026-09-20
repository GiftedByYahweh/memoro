import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  doublePrecision,
  bigint,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles';
import { MEDIA_CONSTRAINTS, MediaStatus, MediaType } from '@memoro/shared';

export const mediaStatusEnum = pgEnum(
  'media_status',
  Object.values(MediaStatus) as [string, ...string[]],
);
export const mediaTypeEnum = pgEnum(
  'media_type',
  Object.values(MediaType) as [string, ...string[]],
);
export const mediaTable = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => profilesTable.id, { onDelete: 'cascade' }),
  fileKey: varchar('file_key', { length: MEDIA_CONSTRAINTS.FILE_KEY_MAX_LENGTH })
    .notNull()
    .unique(),
  contentType: varchar('content_type', {
    length: MEDIA_CONSTRAINTS.CONTENT_TYPE_MAX_LENGTH,
  }).notNull(),
  status: mediaStatusEnum('status').notNull(),
  type: mediaTypeEnum('type').notNull(),
  captureTime: timestamp('capture_time', { withTimezone: true }),
  timezone: varchar('timezone', { length: MEDIA_CONSTRAINTS.TIMEZONE_MAX_LENGTH }),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  cameraModel: varchar('camera_model', { length: MEDIA_CONSTRAINTS.CAMERA_MODEL_MAX_LENGTH }),
  width: integer('width'),
  height: integer('height'),
  sizeBytes: bigint('size_bytes', { mode: 'number' }),
  encryptionAlgorithm: varchar('encryption_algorithm', { length: 16 }),
  originalIv: varchar('original_iv', { length: 32 }),
  duration: doublePrecision('duration'),
  videoCodec: varchar('video_codec', { length: 32 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
