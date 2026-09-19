export interface GenerateUploadUrlInput {
  folder: string;
  profileId: string;
  fileName: string;
  contentType: string;
}

export interface UploadUrlOutput {
  presignedUrl: string;
  fileKey: string;
}

export interface FileStorage {
  getUploadUrl(input: GenerateUploadUrlInput): Promise<UploadUrlOutput>;
  getReadUrl(fileKey: string): Promise<string>;
  delete(key: string): Promise<void>;
}
