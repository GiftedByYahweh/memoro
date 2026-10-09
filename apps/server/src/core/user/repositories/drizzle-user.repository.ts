import { eq } from 'drizzle-orm';
import type { DBProvider } from '@/db/db.provider';
import { usersTable } from '@/db/schema/users';
import type { User } from '../entities/user.entity';
import { toUserEntity } from '../mappers/user.mapper';
import type { CreateUserData, UserRepository } from './user.repository';

async function createUser(dbProvider: DBProvider, data: CreateUserData): Promise<User> {
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
}

async function findUserByEmail(dbProvider: DBProvider, email: string): Promise<User | null> {
  const [row] = await dbProvider
    .current()
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  return row ? toUserEntity(row) : null;
}

async function findUserById(dbProvider: DBProvider, id: string): Promise<User | null> {
  const [row] = await dbProvider
    .current()
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);
  return row ? toUserEntity(row) : null;
}

async function updateUserPassword(
  dbProvider: DBProvider,
  id: string,
  passwordHash: string,
): Promise<void> {
  await dbProvider
    .current()
    .update(usersTable)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(usersTable.id, id));
}

export function drizzleUserRepository(dbProvider: DBProvider): UserRepository {
  return {
    create: (data: CreateUserData) => createUser(dbProvider, data),
    findByEmail: (email: string) => findUserByEmail(dbProvider, email),
    findById: (id: string) => findUserById(dbProvider, id),
    updatePassword: (id: string, passwordHash: string) =>
      updateUserPassword(dbProvider, id, passwordHash),
  };
}
