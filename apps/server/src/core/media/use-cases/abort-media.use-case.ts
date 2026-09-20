import { DomainErrorCode, MediaStatus, type AbortMediaUploadDto } from '@memoro/shared';
import { AppError } from '@/common/error/app.error';
import type { FileStorage } from '@/common/file-storage';
import type { UseCase } from '@/common/use-case';
import type { MediaRepository } from '../repositories/media.repository';

export interface AbortMediaInput {
  mediaId: string;
  profileId: string;
  data: AbortMediaUploadDto;
}

export interface AbortMediaDeps {
  fileStorage: FileStorage;
  mediaRepository: MediaRepository;
}

export type AbortMediaUseCase = UseCase<AbortMediaInput>;

export function abortMediaUseCase(deps: AbortMediaDeps): AbortMediaUseCase {
  const { fileStorage, mediaRepository } = deps;

  return async (input: AbortMediaInput): Promise<void> => {
    const media = await mediaRepository.findById(input.mediaId);
    if (!media) {
      throw new AppError(DomainErrorCode.MEDIA_NOT_FOUND);
    }

    if (media.profileId !== input.profileId) {
      throw new AppError(DomainErrorCode.MEDIA_FORBIDDEN);
    }

    if (input.data.uploadId) {
      await fileStorage.abortMultipartUpload(media.fileKey, input.data.uploadId);
    }

    await mediaRepository.updateStatus(media.id, MediaStatus.FAILED);
  };
}
