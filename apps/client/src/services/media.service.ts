import { apiClient } from '@/api';
import {
  MULTIPART_CONSTRAINTS,
  UploadType,
  type ApiResponse,
  type CreateMediaDto,
  type CreateMediaResponseDto,
  type MediaDto,
} from '@memoro/shared';

interface UploadedPart {
  partNumber: number;
  etag: string;
}

async function uploadPart(
  part: { partNumber: number; presignedUrl: string },
  file: File,
): Promise<UploadedPart> {
  const partSize = MULTIPART_CONSTRAINTS.PART_SIZE_BYTES;
  const start = (part.partNumber - 1) * partSize;
  const end = Math.min(start + partSize, file.size);
  const chunk = file.slice(start, end);
  const res = await apiClient.media.uploadToUrl(part.presignedUrl, chunk, file.type);
  if (!res.success) {
    throw new Error(String(res.code));
  }
  const etag = res.data.etag ?? '';
  return { partNumber: part.partNumber, etag };
}

async function uploadMultipartParts(
  parts: readonly { partNumber: number; presignedUrl: string }[],
  file: File,
): Promise<UploadedPart[]> {
  return Promise.all(parts.map((part) => uploadPart(part, file)));
}

async function handleSingleUpload(file: File, presignedUrl: string, id: string): Promise<MediaDto> {
  const res = await apiClient.media.uploadToUrl(presignedUrl, file, file.type);
  if (!res.success) {
    throw new Error(String(res.code));
  }
  const completeRes = await apiClient.media.complete(id, {});
  if (!completeRes.success) {
    throw new Error(String(completeRes.code));
  }
  return completeRes.data;
}

async function handleMultipartUpload(
  file: File,
  id: string,
  uploadId: string,
  parts: readonly { partNumber: number; presignedUrl: string }[],
): Promise<MediaDto> {
  try {
    const completedParts = await uploadMultipartParts(parts, file);
    const completeRes = await apiClient.media.complete(id, {
      uploadId,
      parts: completedParts,
    });
    if (!completeRes.success) {
      throw new Error(String(completeRes.code));
    }
    return completeRes.data;
  } catch (error) {
    await apiClient.media.abort(id, { uploadId });
    throw error;
  }
}

export const mediaService = {
  create: (data: CreateMediaDto): Promise<ApiResponse<CreateMediaResponseDto>> => {
    return apiClient.media.create(data);
  },

  uploadFile: async (file: File, uploadInfo: CreateMediaResponseDto): Promise<MediaDto> => {
    if (uploadInfo.type === UploadType.SINGLE) {
      return handleSingleUpload(file, uploadInfo.presignedUrl, uploadInfo.id);
    }
    return handleMultipartUpload(file, uploadInfo.id, uploadInfo.uploadId, uploadInfo.parts);
  },
};
