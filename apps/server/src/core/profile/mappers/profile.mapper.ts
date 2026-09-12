import type { ProfileDto, UserSex } from '@memoro/shared';
import type { profilesTable } from '@/db/schema/profiles';
import type { Profile } from '../entities/profile.entity';

export type ProfileRow = typeof profilesTable.$inferSelect;

const toProfileEntity = (row: ProfileRow): Profile => {
  return {
    id: row.id,
    userId: row.userId,
    username: row.username,
    avatar: row.avatar,
    sex: row.sex as UserSex | null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

const toProfileDto = (profile: Profile): ProfileDto => {
  return {
    id: profile.id,
    userId: profile.userId,
    username: profile.username,
    avatar: profile.avatar,
    sex: profile.sex,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
};

export { toProfileDto, toProfileEntity };
