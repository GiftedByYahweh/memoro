import { eq } from 'drizzle-orm';
import type { DBProvider } from '@/db/db.provider';
import { profilesTable } from '@/db/schema/profiles';
import type { Profile } from '../entities/profile.entity';
import { toProfileEntity } from '../mappers/profile.mapper';
import type { CreateProfileData, ProfileRepository } from './profile.repository';

async function createProfile(dbProvider: DBProvider, data: CreateProfileData): Promise<Profile> {
  const [row] = await dbProvider
    .current()
    .insert(profilesTable)
    .values({
      userId: data.userId,
      username: data.username,
      sex: data.sex,
      avatar: data.avatar,
    })
    .returning();

  if (!row) throw new Error('Failed to create profile');
  return toProfileEntity(row);
}

async function findProfileByUserId(
  dbProvider: DBProvider,
  userId: string,
): Promise<Profile | null> {
  const [row] = await dbProvider
    .current()
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId))
    .limit(1);
  return row ? toProfileEntity(row) : null;
}

async function findProfileByUsername(
  dbProvider: DBProvider,
  username: string,
): Promise<Profile | null> {
  const [row] = await dbProvider
    .current()
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.username, username))
    .limit(1);
  return row ? toProfileEntity(row) : null;
}

export function drizzleProfileRepository(dbProvider: DBProvider): ProfileRepository {
  return {
    create: (data: CreateProfileData) => createProfile(dbProvider, data),
    findByUserId: (userId: string) => findProfileByUserId(dbProvider, userId),
    findByUsername: (username: string) => findProfileByUsername(dbProvider, username),
  };
}
