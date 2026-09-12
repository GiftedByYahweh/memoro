import type { UseCase } from '@/common/use-case';
import type { User } from '../entities/user.entity';
import type { UserRepository } from '../repositories/user.repository';

export interface FindUserByIdInput {
  id: string;
}

export type FindUserByIdUseCase = UseCase<FindUserByIdInput, User | null>;

export interface FindUserByIdUseCaseDeps {
  userRepository: UserRepository;
}

export function findUserByIdUseCase(deps: FindUserByIdUseCaseDeps): FindUserByIdUseCase {
  const { userRepository } = deps;

  return async (input: FindUserByIdInput): Promise<User | null> => {
    return userRepository.findById(input.id);
  };
}
