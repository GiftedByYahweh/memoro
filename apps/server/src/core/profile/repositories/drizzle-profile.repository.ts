import { eq } from 'drizzle-orm';
import type { DBProvider } from '@/db/db.provider';
import { profilesTable } from '@/db/schema/profiles';
import type { Profile } from '../entities/profile.entity';
import { toProfileEntity } from '../mappers/profile.mapper';
import type { CreateProfileData, ProfileRepository } from './profile.repository';

export function drizzleProfileRepository(dbProvider: DBProvider): ProfileRepository {
  return {
    findByUserId: async (userId: string): Promise<Profile | null> => {
      const [row] = await dbProvider
        .current()
        .select()
        .from(profilesTable)
        .where(eq(profilesTable.userId, userId))
        .limit(1);
      return row ? toProfileEntity(row) : null;
    },

    create: async (data: CreateProfileData): Promise<Profile> => {
      const [row] = await dbProvider
        .current()
        .insert(profilesTable)
        .values({
          userId: data.userId,
        })
        .returning();

      if (!row) throw new Error('Failed to create profile');
      return toProfileEntity(row);
    },
  };
}
