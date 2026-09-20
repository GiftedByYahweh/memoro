import { and, desc, eq, gte, lte, type SQL } from 'drizzle-orm';
import { MEDIA_QUERY_CONSTRAINTS, type MediaFilterDto, type MediaStatus } from '@memoro/shared';
import type { DBProvider } from '@/db/db.provider';
import { mediaTable } from '@/db/schema';
import type { InsertMediaInput, Media } from '../entities/media.entity';
import { toMediaDomain } from '../mappers/media.mapper';
import type { MediaRepository } from './media.repository';

function buildGeoConditions(filter: MediaFilterDto): SQL[] {
  const conditions: SQL[] = [];
  if (filter.minLatitude !== undefined) {
    conditions.push(gte(mediaTable.latitude, filter.minLatitude));
  }
  if (filter.maxLatitude !== undefined) {
    conditions.push(lte(mediaTable.latitude, filter.maxLatitude));
  }
  if (filter.minLongitude !== undefined) {
    conditions.push(gte(mediaTable.longitude, filter.minLongitude));
  }
  if (filter.maxLongitude !== undefined) {
    conditions.push(lte(mediaTable.longitude, filter.maxLongitude));
  }
  return conditions;
}

function buildDateConditions(filter: MediaFilterDto): SQL[] {
  const conditions: SQL[] = [];
  if (filter.dateFrom !== undefined) {
    conditions.push(gte(mediaTable.captureTime, new Date(filter.dateFrom)));
  }
  if (filter.dateTo !== undefined) {
    conditions.push(lte(mediaTable.captureTime, new Date(filter.dateTo)));
  }
  return conditions;
}

function buildFilterConditions(profileId: string, filter?: MediaFilterDto): SQL[] {
  const conditions: SQL[] = [eq(mediaTable.profileId, profileId)];
  if (!filter) return conditions;

  conditions.push(...buildGeoConditions(filter));
  conditions.push(...buildDateConditions(filter));
  return conditions;
}

async function insertMedia(dbProvider: DBProvider, input: InsertMediaInput): Promise<Media> {
  const [row] = await dbProvider
    .current()
    .insert(mediaTable)
    .values({
      profileId: input.profileId,
      fileKey: input.fileKey,
      contentType: input.contentType,
      status: input.status,
      type: input.type,
      captureTime: input.captureTime,
      timezone: input.timezone,
      latitude: input.latitude,
      longitude: input.longitude,
      cameraModel: input.cameraModel,
      width: input.width,
      height: input.height,
      sizeBytes: input.sizeBytes,
      encryptionAlgorithm: input.encryptionAlgorithm,
      originalIv: input.originalIv,
      duration: input.duration,
      videoCodec: input.videoCodec,
      hasThumbnail: input.hasThumbnail ?? false,
    })
    .returning();

  if (!row) throw new Error('Failed to insert media');
  return toMediaDomain(row);
}

async function findMediaById(dbProvider: DBProvider, id: string): Promise<Media | null> {
  const [row] = await dbProvider
    .current()
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.id, id))
    .limit(1);
  return row ? toMediaDomain(row) : null;
}

async function findMediaByProfileId(
  dbProvider: DBProvider,
  profileId: string,
  filter?: MediaFilterDto,
): Promise<Media[]> {
  const conditions = buildFilterConditions(profileId, filter);
  const limit = filter?.limit ?? MEDIA_QUERY_CONSTRAINTS.DEFAULT_LIMIT;
  const offset = filter?.offset ?? 0;

  const rows = await dbProvider
    .current()
    .select()
    .from(mediaTable)
    .where(and(...conditions))
    .orderBy(desc(mediaTable.createdAt))
    .limit(limit)
    .offset(offset);

  return rows.map(toMediaDomain);
}

async function updateMediaStatus(
  dbProvider: DBProvider,
  id: string,
  status: MediaStatus,
): Promise<Media | null> {
  const [row] = await dbProvider
    .current()
    .update(mediaTable)
    .set({ status, updatedAt: new Date() })
    .where(eq(mediaTable.id, id))
    .returning();
  return row ? toMediaDomain(row) : null;
}

async function deleteMedia(dbProvider: DBProvider, id: string): Promise<void> {
  await dbProvider.current().delete(mediaTable).where(eq(mediaTable.id, id));
}

export function drizzleMediaRepository(dbProvider: DBProvider): MediaRepository {
  return {
    insert: (input: InsertMediaInput): Promise<Media> => insertMedia(dbProvider, input),
    findById: (id: string): Promise<Media | null> => findMediaById(dbProvider, id),
    findByProfileId: (profileId: string, filter?: MediaFilterDto): Promise<Media[]> =>
      findMediaByProfileId(dbProvider, profileId, filter),
    updateStatus: (id: string, status: MediaStatus): Promise<Media | null> =>
      updateMediaStatus(dbProvider, id, status),
    delete: (id: string): Promise<void> => deleteMedia(dbProvider, id),
  };
}
