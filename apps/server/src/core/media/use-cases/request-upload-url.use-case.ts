import {
  ALLOWED_CONTENT_TYPES,
  DomainErrorCode,
  MEDIA_UPLOAD_CONSTRAINTS,
  type AllowedContentType,
  type UploadUrlResponseDto,
} from '@memoro/shared';
import { AppError } from '@/common/error/app.error';
import type { FileStorage } from '@/common/file-storage';
import type { UseCase } from '@/common/use-case';

export interface RequestUploadUrlInput {
  profileId: string;
  fileName: string;
  contentType: AllowedContentType;
}

export interface RequestUploadUrlUseCaseDeps {
  fileStorage: FileStorage;
}

export type RequestUploadUrlUseCase = UseCase<RequestUploadUrlInput, UploadUrlResponseDto>;

export function requestUploadUrlUseCase(
  deps: RequestUploadUrlUseCaseDeps,
): RequestUploadUrlUseCase {
  const { fileStorage } = deps;

  return async (input: RequestUploadUrlInput): Promise<UploadUrlResponseDto> => {
    if (!ALLOWED_CONTENT_TYPES.includes(input.contentType)) {
      throw new AppError(DomainErrorCode.INVALID_FILE_TYPE);
    }

    const { presignedUrl, fileKey } = await fileStorage.getUploadUrl({
      folder: MEDIA_UPLOAD_CONSTRAINTS.FOLDER_NAME,
      profileId: input.profileId,
      fileName: input.fileName,
      contentType: input.contentType,
    });

    return {
      uploadUrl: presignedUrl,
      fileKey,
    };
  };
}
