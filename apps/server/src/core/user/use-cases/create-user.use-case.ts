import type { UseCase } from '@/common/use-case';
import type { User } from '../entities/user.entity';
import type { UserRepository } from '../repositories/user.repository';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
}

export type CreateUserUseCase = UseCase<CreateUserInput, User>;

export interface CreateUserUseCaseDeps {
  userRepository: UserRepository;
}

export function createUserUseCase(deps: CreateUserUseCaseDeps): CreateUserUseCase {
  const { userRepository } = deps;

  return async (input: CreateUserInput): Promise<User> => {
    return userRepository.create(input);
  };
}
