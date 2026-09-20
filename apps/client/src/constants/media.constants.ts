import { ALLOWED_CONTENT_TYPES, type AllowedContentType } from '@memoro/shared';

export const MEDIA_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.heic',
  '.heif',
  '.mp4',
  '.mov',
] as const;

export const MEDIA_ACCEPT_ATTRIBUTE = [...ALLOWED_CONTENT_TYPES, ...MEDIA_EXTENSIONS].join(',');

export const EXTENSION_MIME_MAP: Partial<Record<string, AllowedContentType>> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  heic: 'image/heic',
  heif: 'image/heif',
  webp: 'image/webp',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
} as const;

export const MIME_ALIAS_MAP: Partial<Record<string, AllowedContentType>> = {
  'image/jpeg': 'image/jpeg',
  'image/jpg': 'image/jpeg',
  'image/pjpeg': 'image/jpeg',
  'image/png': 'image/png',
  'image/heic': 'image/heic',
  'image/heif': 'image/heif',
  'image/webp': 'image/webp',
  'video/mp4': 'video/mp4',
  'video/quicktime': 'video/quicktime',
} as const;

export const MEDIA_UPLOAD_LIMITS = {
  LOCATION_TOAST_DURATION_MS: 3000,
  SUCCESS_TOAST_DURATION_MS: 2000,
  ERROR_TOAST_DURATION_MS: 4000,
} as const;

export const MEDIA_UI_CONSTANTS = {
  EMPTY_ZONE_ICON_SIZE: 48,
  ACTION_ICON_SIZE: 20,
  PREVIEW_ICON_SIZE: 16,
  NAVIGATION_ICON_SIZE: 18,
} as const;
