import { DomainErrorCode } from '@memoro/shared';
import type { AuthUserDto } from '@memoro/shared';
import { hashPassword } from '@/common/crypto/crypto';
import { AppError, ErrorCode } from '@/common/error/app.error';
import type { UseCase } from '@/common/use-case';
import type { CreateProfileUseCase } from '@/core/profile';
import type { UserRepository } from '../repositories/user.repository';
import type { CreateSessionUseCase } from './create-session.use-case';
import type { UnitOfWork } from '@/db/unit-of-work';
import { toAuthUserDto } from '../mappers/user.mapper';

interface RegisterInput {
  email: string;
  password: string;
  userAgent: string | undefined;
  ipAddress: string | undefined;
}

interface RegisterOutput {
  user: AuthUserDto;
  sessionToken: string;
  maxAgeSeconds: number;
}

interface RegisterUseCaseDeps {
  userRepository: UserRepository;
  createProfileUseCase: CreateProfileUseCase;
  createSessionUseCase: CreateSessionUseCase;
  unitOfWork: UnitOfWork;
}

export type RegisterUseCase = UseCase<RegisterInput, RegisterOutput>;

export function registerUseCase(deps: RegisterUseCaseDeps): RegisterUseCase {
  const { unitOfWork, userRepository, createProfileUseCase, createSessionUseCase } = deps;

  return async (input: RegisterInput): Promise<RegisterOutput> => {
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(
        ErrorCode.CONFLICT,
        'User with this email already exists',
        DomainErrorCode.USER_ALREADY_EXISTS,
      );
    }

    const passwordHash = await hashPassword(input.password);

    const { user, rawToken, maxAgeSeconds } = await unitOfWork.run(async () => {
      const createdUser = await userRepository.create({
        email: input.email,
        passwordHash,
      });

      await createProfileUseCase({
        userId: createdUser.id,
      });

      const { rawToken, maxAgeSeconds } = await createSessionUseCase({
        userId: createdUser.id,
        userAgent: input.userAgent,
        ipAddress: input.ipAddress,
      });

      return {
        user: createdUser,
        rawToken,
        maxAgeSeconds,
      };
    });

    return {
      user: toAuthUserDto(user),
      sessionToken: rawToken,
      maxAgeSeconds,
    };
  };
}
