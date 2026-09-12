import { DomainErrorCode } from '@memoro/shared';
import type { AuthUserDto } from '@memoro/shared';
import { hashPassword } from '@/common/crypto/crypto';
import { AppError, ErrorCode } from '@/common/error/app.error';
import type { UseCase } from '@/common/use-case';
import type { CreateProfileUseCase } from '@/core/profile';
import type { UserRepository } from '../repositories/user.repository';
import type { UnitOfWork } from '@/db/unit-of-work';
import { toAuthUserDto } from '../mappers/user.mapper';

interface RegisterInput {
  email: string;
  password: string;
}

interface RegisterOutput {
  user: AuthUserDto;
}

interface RegisterUseCaseDeps {
  userRepository: UserRepository;
  createProfileUseCase: CreateProfileUseCase;
  unitOfWork: UnitOfWork;
}

export type RegisterUseCase = UseCase<RegisterInput, RegisterOutput>;

export function registerUseCase(deps: RegisterUseCaseDeps): RegisterUseCase {
  const { unitOfWork, userRepository, createProfileUseCase } = deps;

  return async (input: RegisterInput): Promise<RegisterOutput> => {
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(ErrorCode.CONFLICT, DomainErrorCode.USER_ALREADY_EXISTS);
    }

    const passwordHash = await hashPassword(input.password);

    const createdUser = await unitOfWork.run(async () => {
      const user = await userRepository.create({
        email: input.email,
        passwordHash,
      });

      await createProfileUseCase({
        userId: user.id,
      });

      return user;
    });

    return {
      user: toAuthUserDto(createdUser),
    };
  };
}
