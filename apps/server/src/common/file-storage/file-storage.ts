import type { UploadType } from '@memoro/shared';

export interface GenerateUploadUrlInput {
  folder: string;
  profileId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface UploadPartOutput {
  partNumber: number;
  presignedUrl: string;
}

export interface SingleUploadOutput {
  type: typeof UploadType.SINGLE;
  fileKey: string;
  presignedUrl: string;
}

export interface MultipartUploadOutput {
  type: typeof UploadType.MULTIPART;
  fileKey: string;
  uploadId: string;
  parts: UploadPartOutput[];
}

export type UploadUrlOutput = SingleUploadOutput | MultipartUploadOutput;

export interface CompleteMultipartInput {
  fileKey: string;
  uploadId: string;
  parts: { partNumber: number; etag: string }[];
}

export interface FileStorage {
  getUploadUrls(input: GenerateUploadUrlInput): Promise<UploadUrlOutput>;
  completeMultipartUpload(input: CompleteMultipartInput): Promise<void>;
  abortMultipartUpload(fileKey: string, uploadId: string): Promise<void>;
  getReadUrl(fileKey: string): Promise<string>;
  delete(key: string): Promise<void>;
}
