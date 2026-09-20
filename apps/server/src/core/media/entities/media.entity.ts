import type { MediaStatus, MediaType } from '@memoro/shared';

export interface Media {
  id: string;
  profileId: string;
  fileKey: string;
  contentType: string;
  status: MediaStatus;
  type: MediaType;
  captureTime: Date | null;
  timezone: string | null;
  latitude: number | null;
  longitude: number | null;
  cameraModel: string | null;
  width: number | null;
  height: number | null;
  sizeBytes: number | null;
  encryptionAlgorithm: string | null;
  originalIv: string | null;
  duration: number | null;
  videoCodec: string | null;
  hasThumbnail: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertMediaInput {
  profileId: string;
  fileKey: string;
  contentType: string;
  status: MediaStatus;
  type: MediaType;
  captureTime: Date | undefined;
  timezone: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  cameraModel: string | undefined;
  width: number | undefined;
  height: number | undefined;
  sizeBytes: number | undefined;
  encryptionAlgorithm: string | undefined;
  originalIv: string | undefined;
  duration: number | undefined;
  videoCodec: string | undefined;
  hasThumbnail: boolean | undefined;
}
