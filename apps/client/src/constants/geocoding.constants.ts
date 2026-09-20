export const GEOCODING_CONSTANTS = {
  REVERSE_URL: 'https://nominatim.openstreetmap.org/reverse',
  COORDINATE_PRECISION: 4,
  REQUEST_TIMEOUT_MS: 5000,
  DEFAULT_LANGUAGE: 'uk',
} as const;

export const EXIF_CONSTANTS = {
  HEADER_READ_BYTES: 131072,
} as const;
