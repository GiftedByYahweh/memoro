import { z } from 'zod';
import { COORDINATES_LIMITS } from '../../utils/coordinates';
import {
  ALLOWED_CONTENT_TYPES,
  MEDIA_CONSTRAINTS,
  MEDIA_QUERY_CONSTRAINTS,
  MediaStatus,
  MediaType,
} from './constants';

export const requestUploadUrlSchema = z.object({
  fileName: z.string().min(1).max(MEDIA_CONSTRAINTS.FILE_KEY_MAX_LENGTH),
  contentType: z.enum(ALLOWED_CONTENT_TYPES),
});

export const uploadUrlResponseSchema = z.object({
  uploadUrl: z.string().url(),
  fileKey: z.string().min(1).max(MEDIA_CONSTRAINTS.FILE_KEY_MAX_LENGTH),
});

export const createMediaSchema = z.object({
  fileKey: z.string().min(1).max(MEDIA_CONSTRAINTS.FILE_KEY_MAX_LENGTH),
  contentType: z.string().min(1).max(MEDIA_CONSTRAINTS.CONTENT_TYPE_MAX_LENGTH),
  type: z.enum([MediaType.IMAGE, MediaType.VIDEO]),
  status: z.enum([MediaStatus.PENDING, MediaStatus.READY]),
  captureTime: z.string().datetime().optional(),
  timezone: z.string().max(MEDIA_CONSTRAINTS.TIMEZONE_MAX_LENGTH).optional(),
  latitude: z
    .number()
    .min(COORDINATES_LIMITS.MIN_LATITUDE)
    .max(COORDINATES_LIMITS.MAX_LATITUDE)
    .optional(),
  longitude: z
    .number()
    .min(COORDINATES_LIMITS.MIN_LONGITUDE)
    .max(COORDINATES_LIMITS.MAX_LONGITUDE)
    .optional(),
  cameraModel: z.string().max(MEDIA_CONSTRAINTS.CAMERA_MODEL_MAX_LENGTH).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  sizeBytes: z.number().int().positive().optional(),
  duration: z.number().positive().optional(),
  collectionIds: z.array(z.string().uuid()).optional(),
});

export const mediaFilterSchema = z.object({
  minLatitude: z.coerce
    .number()
    .min(COORDINATES_LIMITS.MIN_LATITUDE)
    .max(COORDINATES_LIMITS.MAX_LATITUDE)
    .optional(),
  maxLatitude: z.coerce
    .number()
    .min(COORDINATES_LIMITS.MIN_LATITUDE)
    .max(COORDINATES_LIMITS.MAX_LATITUDE)
    .optional(),
  minLongitude: z.coerce
    .number()
    .min(COORDINATES_LIMITS.MIN_LONGITUDE)
    .max(COORDINATES_LIMITS.MAX_LONGITUDE)
    .optional(),
  maxLongitude: z.coerce
    .number()
    .min(COORDINATES_LIMITS.MIN_LONGITUDE)
    .max(COORDINATES_LIMITS.MAX_LONGITUDE)
    .optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  collectionId: z.string().uuid().optional(),
  limit: z.coerce.number().int().positive().max(MEDIA_QUERY_CONSTRAINTS.MAX_LIMIT).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

export const mediaResponseSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  fileKey: z.string(),
  fileUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  contentType: z.string(),
  status: z.enum([MediaStatus.PENDING, MediaStatus.READY]),
  type: z.enum([MediaType.IMAGE, MediaType.VIDEO]),
  captureTime: z.string().nullable(),
  timezone: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  cameraModel: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  sizeBytes: z.number().nullable(),
  duration: z.number().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
