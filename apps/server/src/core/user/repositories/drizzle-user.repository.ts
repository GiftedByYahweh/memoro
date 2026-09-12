import { eq } from 'drizzle-orm';
import type { DBProvider } from '@/db/db.provider';
import { usersTable } from '@/db/schema/users';
import type { User } from '../entities/user.entity';
import { toUserEntity } from '../mappers/user.mapper';
import type { CreateUserData, UserRepository } from './user.repository';

export function drizzleUserRepository(dbProvider: DBProvider): UserRepository {
  return {
    create: async (data: CreateUserData): Promise<User> => {
      const [row] = await dbProvider
        .current()
        .insert(usersTable)
        .values({
          email: data.email,
          passwordHash: data.passwordHash,
        })
        .returning();

      if (!row) throw new Error('Failed to create user');
      return toUserEntity(row);
    },

    findByEmail: async (email: string): Promise<User | null> => {
      const [row] = await dbProvider
        .current()
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);
      return row ? toUserEntity(row) : null;
    },

    findById: async (id: string): Promise<User | null> => {
      const [row] = await dbProvider
        .current()
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .limit(1);
      return row ? toUserEntity(row) : null;
    },
  };
}
