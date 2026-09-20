import { MediaStatus, type CreateMediaDto, type MediaDto, type MediaType } from '@memoro/shared';
import type { mediaTable } from '@/db/schema';
import type { InsertMediaInput, Media } from '../entities/media.entity';

type MediaRecord = typeof mediaTable.$inferSelect;

export function toMediaDomain(record: MediaRecord): Media {
  return {
    id: record.id,
    profileId: record.profileId,
    fileKey: record.fileKey,
    contentType: record.contentType,
    status: record.status as MediaStatus,
    type: record.type as MediaType,
    captureTime: record.captureTime,
    timezone: record.timezone,
    latitude: record.latitude,
    longitude: record.longitude,
    cameraModel: record.cameraModel,
    width: record.width,
    height: record.height,
    sizeBytes: record.sizeBytes,
    encryptionAlgorithm: record.encryptionAlgorithm,
    originalIv: record.originalIv,
    duration: record.duration,
    videoCodec: record.videoCodec,
    hasThumbnail: record.hasThumbnail,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function toInsertMediaInput(
  profileId: string,
  fileKey: string,
  data: CreateMediaDto,
): InsertMediaInput {
  return {
    profileId,
    fileKey,
    contentType: data.contentType,
    status: MediaStatus.PENDING,
    type: data.type,
    hasThumbnail: false,
    captureTime: data.captureTime ? new Date(data.captureTime) : new Date(),
    timezone: data.timezone,
    latitude: data.latitude,
    longitude: data.longitude,
    cameraModel: data.cameraModel,
    width: data.width,
    height: data.height,
    sizeBytes: data.sizeBytes,
    encryptionAlgorithm: data.encryptionAlgorithm,
    originalIv: data.originalIv,
    duration: data.duration,
    videoCodec: data.videoCodec,
  };
}

export function toMediaDto(
  media: Media,
  fileUrl: string,
  thumbnailUrl: string | null = null,
): MediaDto {
  return {
    id: media.id,
    profileId: media.profileId,
    fileKey: media.fileKey,
    fileUrl,
    thumbnailUrl,
    contentType: media.contentType,
    status: media.status,
    type: media.type,
    captureTime: media.captureTime ? media.captureTime.toISOString() : null,
    timezone: media.timezone,
    latitude: media.latitude,
    longitude: media.longitude,
    cameraModel: media.cameraModel,
    width: media.width,
    height: media.height,
    sizeBytes: media.sizeBytes,
    encryptionAlgorithm: media.encryptionAlgorithm,
    originalIv: media.originalIv,
    duration: media.duration,
    videoCodec: media.videoCodec,
    hasThumbnail: media.hasThumbnail,
    createdAt: media.createdAt.toISOString(),
    updatedAt: media.updatedAt.toISOString(),
  };
}
