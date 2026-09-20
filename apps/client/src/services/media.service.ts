import { apiClient } from '@/api';
import {
  MULTIPART_CONSTRAINTS,
  UploadType,
  type ApiResponse,
  type CreateMediaDto,
  type CreateMediaResponseDto,
} from '@memoro/shared';

async function uploadMultipartParts(
  parts: readonly { partNumber: number; presignedUrl: string }[],
  file: File,
): Promise<void> {
  const partSize = MULTIPART_CONSTRAINTS.PART_SIZE_BYTES;
  for (const part of parts) {
    const start = (part.partNumber - 1) * partSize;
    const end = Math.min(start + partSize, file.size);
    const chunk = file.slice(start, end);
    const res = await apiClient.media.uploadToUrl(part.presignedUrl, chunk, file.type);
    if (!res.success) {
      throw new Error(String(res.code));
    }
  }
}

export const mediaService = {
  create: (data: CreateMediaDto): Promise<ApiResponse<CreateMediaResponseDto>> => {
    return apiClient.media.create(data);
  },

  uploadFile: async (file: File, uploadInfo: CreateMediaResponseDto): Promise<void> => {
    if (uploadInfo.type === UploadType.SINGLE) {
      const res = await apiClient.media.uploadToUrl(uploadInfo.presignedUrl, file, file.type);
      if (!res.success) {
        throw new Error(String(res.code));
      }
      return;
    }
    await uploadMultipartParts(uploadInfo.parts, file);
  },
};
