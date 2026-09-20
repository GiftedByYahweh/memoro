import {
  DomainErrorCode,
  MediaStatus,
  type CompleteMediaUploadDto,
  type MediaDto,
} from '@memoro/shared';
import { AppError } from '@/common/error/app.error';
import type { FileStorage } from '@/common/file-storage';
import type { UseCase } from '@/common/use-case';
import { toMediaDto } from '../mappers/media.mapper';
import type { MediaRepository } from '../repositories/media.repository';

export interface CompleteMediaInput {
  mediaId: string;
  profileId: string;
  data: CompleteMediaUploadDto;
}

export interface CompleteMediaDeps {
  fileStorage: FileStorage;
  mediaRepository: MediaRepository;
}

export type CompleteMediaUseCase = UseCase<CompleteMediaInput, MediaDto>;

export function completeMediaUseCase(deps: CompleteMediaDeps): CompleteMediaUseCase {
  const { fileStorage, mediaRepository } = deps;

  return async (input: CompleteMediaInput): Promise<MediaDto> => {
    const media = await mediaRepository.findById(input.mediaId);
    if (!media) {
      throw new AppError(DomainErrorCode.MEDIA_NOT_FOUND);
    }

    if (media.profileId !== input.profileId) {
      throw new AppError(DomainErrorCode.MEDIA_FORBIDDEN);
    }

    if (input.data.uploadId && input.data.parts && input.data.parts.length > 0) {
      await fileStorage.completeMultipartUpload({
        fileKey: media.fileKey,
        uploadId: input.data.uploadId,
        parts: input.data.parts,
      });
    }

    const updatedMedia = await mediaRepository.updateStatus(media.id, MediaStatus.READY);
    if (!updatedMedia) {
      throw new AppError(DomainErrorCode.MEDIA_NOT_FOUND);
    }

    const fileUrl = await fileStorage.getReadUrl(updatedMedia.fileKey);
    return toMediaDto(updatedMedia, fileUrl);
  };
}
