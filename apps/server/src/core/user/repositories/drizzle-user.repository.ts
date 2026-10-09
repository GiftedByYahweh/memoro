import { eq } from 'drizzle-orm';
import { DomainErrorCode } from '@memoro/shared';
import { AppError } from '@/common/error/app.error';
import type { DBProvider } from '@/db/db.provider';
import { isUniqueViolation } from '@/db/pg-errors';
import { usersTable } from '@/db/schema/users';
import type { User } from '../entities/user.entity';
import { toUserEntity } from '../mappers/user.mapper';
import type { CreateUserData, UserRepository } from './user.repository';

function toUniqueViolationError(error: unknown): unknown {
  if (isUniqueViolation(error, usersTable.email.uniqueName)) {
    return new AppError(DomainErrorCode.USER_ALREADY_EXISTS);
  }
  if (isUniqueViolation(error, usersTable.username.uniqueName)) {
    return new AppError(DomainErrorCode.USERNAME_ALREADY_EXISTS);
  }
  return error;
}

async function createUser(dbProvider: DBProvider, data: CreateUserData): Promise<User> {
  const [row] = await dbProvider
    .current()
    .insert(usersTable)
    .values({
      email: data.email,
      passwordHash: data.passwordHash,
      username: data.username,
      sex: data.sex,
    })
    .returning()
    .catch((error: unknown) => {
      throw toUniqueViolationError(error);
    });

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

async function findUserByUsername(dbProvider: DBProvider, username: string): Promise<User | null> {
  const [row] = await dbProvider
    .current()
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
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
    findByUsername: (username: string) => findUserByUsername(dbProvider, username),
    updatePassword: (id: string, passwordHash: string) =>
      updateUserPassword(dbProvider, id, passwordHash),
  };
}
