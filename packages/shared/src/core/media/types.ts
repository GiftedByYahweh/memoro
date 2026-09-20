import type { MediaStatus, MediaType } from './constants';
import type {
  CreateMediaDto,
  CreateMediaResponseDto,
  CompleteMediaUploadDto,
  AbortMediaUploadDto,
  MediaFilterDto,
} from './schema';

export type {
  CreateMediaDto,
  CreateMediaResponseDto,
  CompleteMediaUploadDto,
  AbortMediaUploadDto,
  MediaFilterDto,
};

export interface MediaDto {
  readonly id: string;
  readonly profileId: string;
  readonly fileKey: string;
  readonly fileUrl: string;
  readonly thumbnailUrl: string | null;
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
  readonly encryptionAlgorithm: string | null;
  readonly originalIv: string | null;
  readonly duration: number | null;
  readonly videoCodec: string | null;
  readonly hasThumbnail: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
