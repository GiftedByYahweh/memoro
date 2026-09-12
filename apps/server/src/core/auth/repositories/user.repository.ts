import type { User } from '../entities/user.entity';

export interface CreateUserData {
  email: string;
  passwordHash: string;
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
