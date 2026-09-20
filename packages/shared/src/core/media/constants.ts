export const MediaStatus = {
  PENDING: 'pending',
  READY: 'ready',
  FAILED: 'failed',
} as const;
export type MediaStatus = (typeof MediaStatus)[keyof typeof MediaStatus];

export const MediaType = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const;
export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export const UploadType = {
  SINGLE: 'single',
  MULTIPART: 'multipart',
} as const;
export type UploadType = (typeof UploadType)[keyof typeof UploadType];

export const MEDIA_CONSTRAINTS = {
  FILE_KEY_MAX_LENGTH: 512,
  CONTENT_TYPE_MAX_LENGTH: 100,
  CAMERA_MODEL_MAX_LENGTH: 255,
  TIMEZONE_MAX_LENGTH: 50,
  VIDEO_CODEC_MAX_LENGTH: 32,
} as const;

export const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
] as const;

export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export const MULTIPART_CONSTRAINTS = {
  THRESHOLD_BYTES: 104857600,
  PART_SIZE_BYTES: 52428800,
  PRESIGNED_URL_EXPIRES_SECONDS: 3600,
} as const;

export const STORAGE_CONSTRAINTS = {
  DEFAULT_EXTENSION: 'jpg',
  DEFAULT_REGION: 'auto',
  URL_EXPIRY_SECONDS: 3600,
} as const;

export const MEDIA_UPLOAD_CONSTRAINTS = {
  FOLDER_NAME: 'media',
} as const;

export const MEDIA_QUERY_CONSTRAINTS = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 500,
} as const;
