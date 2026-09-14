import { randomUUID } from 'node:crypto';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { AppConfig } from '../../config';
import type { FileStorage, GenerateUploadUrlInput, UploadUrlOutput } from './file-storage';

export class R2FileStorageProvider implements FileStorage {
  private client: S3Client;
  private bucketName: string;
  private presignedUrlExpires = 3600;
  private defaultExtension = 'jpg'

  constructor(config: AppConfig['r2']) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.bucketName = config.bucketName;
  }

  async getUploadUrl(input: GenerateUploadUrlInput): Promise<UploadUrlOutput> {
    const { fileName, profileId, contentType, folder } = input;
    const ext = fileName.split('.').pop()?.toLowerCase() ?? this.defaultExtension;
    const fileKey = `${folder}/${profileId}/${String(Date.now())}-${randomUUID()}.${ext}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(this.client, command, {
      expiresIn: this.presignedUrlExpires,
    });

    return { presignedUrl, fileKey };
  }

  async getReadUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: fileKey });
    return getSignedUrl(this.client, command, { expiresIn: this.presignedUrlExpires });
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.client.send(command);
  }
}
