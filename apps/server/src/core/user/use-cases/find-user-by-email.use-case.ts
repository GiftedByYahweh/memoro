import type { UseCase } from '@/common/use-case';
import type { User } from '../entities/user.entity';
import type { UserRepository } from '../repositories/user.repository';

export interface FindUserByEmailInput {
  email: string;
}

export type FindUserByEmailUseCase = UseCase<FindUserByEmailInput, User | null>;

export interface FindUserByEmailUseCaseDeps {
  userRepository: UserRepository;
}

export function findUserByEmailUseCase(deps: FindUserByEmailUseCaseDeps): FindUserByEmailUseCase {
  const { userRepository } = deps;

  return async (input: FindUserByEmailInput): Promise<User | null> => {
    return userRepository.findByEmail(input.email);
  };
}
