import type { Profile } from '../entities/profile.entity';

export interface CreateProfileData {
  userId: string;
}

export interface ProfileRepository {
  create(data: CreateProfileData): Promise<Profile>;
  findByUserId(userId: string): Promise<Profile | null>;
}
