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
];
