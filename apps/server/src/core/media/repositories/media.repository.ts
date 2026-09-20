import type { MediaFilterDto, MediaStatus } from '@memoro/shared';
import type { InsertMediaInput, Media } from '../entities/media.entity';

export interface MediaRepository {
  insert(input: InsertMediaInput): Promise<Media>;
  findById(id: string): Promise<Media | null>;
  findByProfileId(profileId: string, filter?: MediaFilterDto): Promise<Media[]>;
  updateStatus(id: string, status: MediaStatus): Promise<Media | null>;
  delete(id: string): Promise<void>;
}
