import type { UserSex } from '@memoro/shared';
import type { User } from '../entities/user.entity';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  username: string;
  sex: UserSex;
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
}
