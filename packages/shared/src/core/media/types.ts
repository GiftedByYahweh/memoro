import type { AllowedContentType, MediaStatus, MediaType } from './constants';

export interface RequestUploadUrlDto {
  readonly fileName: string;
  readonly contentType: AllowedContentType;
}

export interface UploadUrlResponseDto {
  readonly uploadUrl: string;
  readonly fileKey: string;
}

export interface CreateMediaDto {
  readonly fileKey: string;
  readonly contentType: string;
  readonly type: MediaType;
  readonly status: MediaStatus;
  readonly captureTime?: string;
  readonly timezone?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly cameraModel?: string;
  readonly width?: number;
  readonly height?: number;
  readonly sizeBytes?: number;
  readonly duration?: number;
  readonly collectionIds?: string[];
}

export interface MediaDto {
  readonly id: string;
  readonly profileId: string;
  readonly fileKey: string;
  readonly fileUrl: string;
  readonly thumbnailUrl?: string;
  readonly contentType: string;
  readonly status: MediaStatus;
  readonly type: MediaType;
  readonly captureTime: string | null;
  readonly timezone: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly cameraModel: string | null;
  readonly width: number | null;
  readonly height: number | null;
  readonly sizeBytes: number | null;
  readonly duration: number | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface MediaFilterDto {
  readonly minLatitude?: number;
  readonly maxLatitude?: number;
  readonly minLongitude?: number;
  readonly maxLongitude?: number;
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly collectionId?: string;
  readonly limit?: number;
  readonly offset?: number;
}
