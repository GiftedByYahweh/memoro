export const MediaStatus = {
  PENDING: 'pending',
  READY: 'ready',
} as const;
export type MediaStatus = (typeof MediaStatus)[keyof typeof MediaStatus];

export const MediaType = {
  IMAGE: 'image',
  VIDEO: 'video',
} as const;
export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export const MEDIA_CONSTRAINTS = {
  FILE_KEY_MAX_LENGTH: 512,
  CONTENT_TYPE_MAX_LENGTH: 100,
  CAMERA_MODEL_MAX_LENGTH: 255,
  TIMEZONE_MAX_LENGTH: 50,
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

export const MEDIA_UPLOAD_CONSTRAINTS = {
  FOLDER_NAME: 'media',
} as const;

export const MEDIA_QUERY_CONSTRAINTS = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 500,
} as const;
