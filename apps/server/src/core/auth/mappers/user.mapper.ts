import type { AuthUserDto } from '@memoro/shared';
import type { usersTable } from '@/db/schema/users';
import type { User } from '../entities/user.entity';

export type UserRow = typeof usersTable.$inferSelect;

const toUserEntity = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  passwordHash: row.passwordHash,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const toAuthUserDto = (user: User): AuthUserDto => ({
  id: user.id,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
});

export { toUserEntity, toAuthUserDto };
