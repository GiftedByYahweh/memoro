import type { UserSex } from '@memoro/shared';
import type { Profile } from '../entities/profile.entity';

export interface CreateProfileData {
  userId: string;
  username?: string;
  sex?: UserSex;
  avatar?: string;
}

export interface ProfileRepository {
  create(data: CreateProfileData): Promise<Profile>;
  findByUserId(userId: string): Promise<Profile | null>;
  findByUsername(username: string): Promise<Profile | null>;
}
