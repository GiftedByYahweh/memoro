import { DomainErrorCode } from '@memoro/shared';
import type { AuthUserDto } from '@memoro/shared';
import { hashPassword } from '@/common/crypto/crypto';
import { AppError, ErrorCode } from '@/common/error/app.error';
import type { UseCase } from '@/common/use-case';
import type { CreateProfileUseCase } from '@/core/profile';
import type { CreateUserUseCase, FindUserByEmailUseCase } from '@/core/user';
import { toAuthUserDto } from '@/core/user';
import type { UnitOfWork } from '@/db/unit-of-work';

interface RegisterInput {
  email: string;
  password: string;
}

interface RegisterOutput {
  user: AuthUserDto;
}

interface RegisterUseCaseDeps {
  findUserByEmailUseCase: FindUserByEmailUseCase;
  createUserUseCase: CreateUserUseCase;
  createProfileUseCase: CreateProfileUseCase;
  unitOfWork: UnitOfWork;
}

export type RegisterUseCase = UseCase<RegisterInput, RegisterOutput>;

export function registerUseCase(deps: RegisterUseCaseDeps): RegisterUseCase {
  const { unitOfWork, findUserByEmailUseCase, createUserUseCase, createProfileUseCase } = deps;

  return async (input: RegisterInput): Promise<RegisterOutput> => {
    const existingUser = await findUserByEmailUseCase({ email: input.email });
    if (existingUser) {
      throw new AppError(ErrorCode.CONFLICT, DomainErrorCode.USER_ALREADY_EXISTS);
    }

    const passwordHash = await hashPassword(input.password);

    const createdUser = await unitOfWork.run(async () => {
      const user = await createUserUseCase({
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
