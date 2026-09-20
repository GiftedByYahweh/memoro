import { randomUUID } from 'node:crypto';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { MULTIPART_CONSTRAINTS, STORAGE_CONSTRAINTS, UploadType } from '@memoro/shared';
import type { AppConfig } from '../../config';
import type {
  CompleteMultipartInput,
  FileStorage,
  GenerateUploadUrlInput,
  MultipartUploadOutput,
  SingleUploadOutput,
  UploadPartOutput,
  UploadUrlOutput,
} from './file-storage';

export class R2FileStorageProvider implements FileStorage {
  private client: S3Client;
  private bucketName: string;

  constructor(config: AppConfig['r2']) {
    this.client = new S3Client({
      region: config.region,
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.bucketName = config.bucketName;
  }

  private buildFileKey(folder: string, profileId: string, fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase() ?? STORAGE_CONSTRAINTS.DEFAULT_EXTENSION;
    return `${folder}/${profileId}/${String(Date.now())}-${randomUUID()}.${ext}`;
  }

  private async generateSingleUploadUrl(
    fileKey: string,
    contentType: string,
  ): Promise<SingleUploadOutput> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(this.client, command, {
      expiresIn: MULTIPART_CONSTRAINTS.PRESIGNED_URL_EXPIRES_SECONDS,
    });
    return {
      type: UploadType.SINGLE,
      fileKey,
      presignedUrl,
    };
  }

  private async generateMultipartUploadUrls(
    fileKey: string,
    contentType: string,
    sizeBytes: number,
  ): Promise<MultipartUploadOutput> {
    const createCommand = new CreateMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    });
    const createResponse = await this.client.send(createCommand);
    const uploadId = createResponse.UploadId ?? '';

    const partCount = Math.ceil(sizeBytes / MULTIPART_CONSTRAINTS.PART_SIZE_BYTES);
    const parts: UploadPartOutput[] = [];

    for (let partNumber = 1; partNumber <= partCount; partNumber += 1) {
      const partCommand = new UploadPartCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        UploadId: uploadId,
        PartNumber: partNumber,
      });
      const presignedUrl = await getSignedUrl(this.client, partCommand, {
        expiresIn: MULTIPART_CONSTRAINTS.PRESIGNED_URL_EXPIRES_SECONDS,
      });
      parts.push({ partNumber, presignedUrl });
    }

    return {
      type: UploadType.MULTIPART,
      fileKey,
      uploadId,
      parts,
    };
  }

  async getUploadUrls(input: GenerateUploadUrlInput): Promise<UploadUrlOutput> {
    const { fileName, profileId, contentType, folder, sizeBytes } = input;
    const fileKey = this.buildFileKey(folder, profileId, fileName);

    if (sizeBytes < MULTIPART_CONSTRAINTS.THRESHOLD_BYTES) {
      return this.generateSingleUploadUrl(fileKey, contentType);
    }

    return this.generateMultipartUploadUrls(fileKey, contentType, sizeBytes);
  }

  async completeMultipartUpload(input: CompleteMultipartInput): Promise<void> {
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: input.fileKey,
      UploadId: input.uploadId,
      MultipartUpload: {
        Parts: input.parts.map((part) => ({
          PartNumber: part.partNumber,
          ETag: part.etag,
        })),
      },
    });
    await this.client.send(command);
  }

  async abortMultipartUpload(fileKey: string, uploadId: string): Promise<void> {
    const command = new AbortMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      UploadId: uploadId,
    });
    await this.client.send(command);
  }

  async getReadUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: fileKey });
    return getSignedUrl(this.client, command, {
      expiresIn: STORAGE_CONSTRAINTS.URL_EXPIRY_SECONDS,
    });
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.client.send(command);
  }
}
