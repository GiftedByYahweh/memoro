import type { MediaType } from "../media";

export const CollectionVisibilityStatus = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;
export type CollectionVisibilityStatus = (typeof MediaType)[keyof typeof MediaType];

export const COLLECTION_CONSTRAINTS = {
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 5000,
} as const;

export const LABEL_CONSTRAINTS = {
  NAME_MAX_LENGTH: 50,
} as const;
