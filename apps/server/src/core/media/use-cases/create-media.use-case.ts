import {
  ALLOWED_CONTENT_TYPES,
  DomainErrorCode,
  MEDIA_UPLOAD_CONSTRAINTS,
  UploadType,
  type CreateMediaDto,
  type CreateMediaResponseDto,
} from '@memoro/shared';
import { AppError } from '@/common/error/app.error';
import type { FileStorage } from '@/common/file-storage';
import type { UseCase } from '@/common/use-case';
import { toInsertMediaInput } from '../mappers/media.mapper';
import type { MediaRepository } from '../repositories/media.repository';

export interface CreateMediaInput {
  profileId: string;
  data: CreateMediaDto;
}

export interface CreateMediaDeps {
  fileStorage: FileStorage;
  mediaRepository: MediaRepository;
}

export type CreateMediaUseCase = UseCase<CreateMediaInput, CreateMediaResponseDto>;

export function createMediaUseCase(deps: CreateMediaDeps): CreateMediaUseCase {
  const { fileStorage, mediaRepository } = deps;

  return async (input: CreateMediaInput): Promise<CreateMediaResponseDto> => {
    if (!ALLOWED_CONTENT_TYPES.includes(input.data.contentType)) {
      throw new AppError(DomainErrorCode.INVALID_FILE_TYPE);
    }

    const uploadResult = await fileStorage.getUploadUrls({
      folder: MEDIA_UPLOAD_CONSTRAINTS.FOLDER_NAME,
      profileId: input.profileId,
      fileName: input.data.fileName,
      contentType: input.data.contentType,
      sizeBytes: input.data.sizeBytes,
    });

    const insertData = toInsertMediaInput(input.profileId, uploadResult.fileKey, input.data);
    const media = await mediaRepository.insert(insertData).catch(async (err: unknown) => {
      if (uploadResult.type === UploadType.MULTIPART) {
        await fileStorage.abortMultipartUpload(uploadResult.fileKey, uploadResult.uploadId);
      }
      throw err;
    });

    return {
      id: media.id,
      ...uploadResult,
    };
  };
}
