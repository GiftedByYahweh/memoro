import { z } from 'zod';
import { COORDINATES_LIMITS } from '../../utils/coordinates';
import { EncryptionAlgorithm, ENCRYPTION_CONSTRAINTS } from '../../consts/encryption';
import {
  ALLOWED_CONTENT_TYPES,
  MEDIA_CONSTRAINTS,
  MEDIA_QUERY_CONSTRAINTS,
  MediaStatus,
  MediaType,
  UploadType,
} from './constants';

export const createMediaSchema = z.object({
  fileName: z.string().min(1).max(MEDIA_CONSTRAINTS.FILE_KEY_MAX_LENGTH),
  contentType: z.enum(ALLOWED_CONTENT_TYPES),
  sizeBytes: z.number().int().positive(),
  type: z.enum([MediaType.IMAGE, MediaType.VIDEO]),
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
  encryptionAlgorithm: z
    .enum([EncryptionAlgorithm.AES_GCM, EncryptionAlgorithm.AES_CTR])
    .optional(),
  originalIv: z.string().max(ENCRYPTION_CONSTRAINTS.ORIGINAL_IV_MAX_LENGTH).optional(),
  duration: z.number().positive().optional(),
  videoCodec: z.string().max(MEDIA_CONSTRAINTS.VIDEO_CODEC_MAX_LENGTH).optional(),
});

export type CreateMediaDto = z.infer<typeof createMediaSchema>;

export const uploadPartSchema = z.object({
  partNumber: z.number().int().positive(),
  presignedUrl: z.string().url(),
});

export const completedPartSchema = z.object({
  partNumber: z.number().int().positive(),
  etag: z.string().min(1),
});

export const singleUploadResponseSchema = z.object({
  id: z.string().uuid(),
  fileKey: z.string().min(1).max(MEDIA_CONSTRAINTS.FILE_KEY_MAX_LENGTH),
  type: z.literal(UploadType.SINGLE),
  presignedUrl: z.string().url(),
});

export const multipartUploadResponseSchema = z.object({
  id: z.string().uuid(),
  fileKey: z.string().min(1).max(MEDIA_CONSTRAINTS.FILE_KEY_MAX_LENGTH),
  type: z.literal(UploadType.MULTIPART),
  uploadId: z.string().min(1),
  parts: z.array(uploadPartSchema),
});

export const createMediaResponseSchema = z.discriminatedUnion('type', [
  singleUploadResponseSchema,
  multipartUploadResponseSchema,
]);

export type CreateMediaResponseDto = z.infer<typeof createMediaResponseSchema>;

export const completeMediaUploadSchema = z.object({
  uploadId: z.string().min(1).optional(),
  parts: z.array(completedPartSchema).optional(),
});

export type CompleteMediaUploadDto = z.infer<typeof completeMediaUploadSchema>;

export const abortMediaUploadSchema = z.object({
  uploadId: z.string().min(1).optional(),
});

export type AbortMediaUploadDto = z.infer<typeof abortMediaUploadSchema>;

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
  limit: z.coerce.number().int().positive().max(MEDIA_QUERY_CONSTRAINTS.MAX_LIMIT).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

export type MediaFilterDto = z.infer<typeof mediaFilterSchema>;

export const mediaResponseSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  fileKey: z.string(),
  fileUrl: z.string().url(),
  thumbnailUrl: z.string().url().nullable(),
  contentType: z.string(),
  status: z.enum([MediaStatus.PENDING, MediaStatus.READY, MediaStatus.FAILED]),
  type: z.enum([MediaType.IMAGE, MediaType.VIDEO]),
  captureTime: z.string().nullable(),
  timezone: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  cameraModel: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  sizeBytes: z.number().nullable(),
  encryptionAlgorithm: z.string().nullable(),
  originalIv: z.string().nullable(),
  duration: z.number().nullable(),
  videoCodec: z.string().nullable(),
  hasThumbnail: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const mediaIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type MediaIdParamDto = z.infer<typeof mediaIdParamSchema>;
