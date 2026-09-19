import { DomainErrorCode, VerificationCodeType, type AuthUserDto } from '@memoro/shared';
import { hashPassword } from '@/common/crypto/crypto';
import { AppError } from '@/common/error/app.error';
import type { UseCase } from '@/common/use-case';
import type { ProfileRepository } from '@/core/profile';
import type { UserRepository } from '@/core/user';
import { toAuthUserDto } from '@/core/user';
import type { UnitOfWork } from '@/db/unit-of-work';
import type { VerificationCodeRepository } from '../repositories/verification-code.repository';

interface RegisterInput {
  email: string;
  password: string;
  username: string;
  gender: string;
}

interface RegisterOutput {
  user: AuthUserDto;
}

interface RegisterUseCaseDeps {
  userRepository: UserRepository;
  profileRepository: ProfileRepository;
  verificationCodeRepository: VerificationCodeRepository;
  unitOfWork: UnitOfWork;
}

export type RegisterUseCase = UseCase<RegisterInput, RegisterOutput>;

export function registerUseCase(deps: RegisterUseCaseDeps): RegisterUseCase {
  const { userRepository, profileRepository, verificationCodeRepository, unitOfWork } = deps;

  return async (input: RegisterInput): Promise<RegisterOutput> => {
    const verifiedCode = await verificationCodeRepository.findVerified(
      input.email,
      VerificationCodeType.REGISTRATION,
    );
    if (!verifiedCode) {
      throw new AppError(DomainErrorCode.INVALID_VERIFICATION_CODE);
    }

    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(DomainErrorCode.USER_ALREADY_EXISTS);
    }

    const existingProfile = await profileRepository.findByUsername(input.username);
    if (existingProfile) {
      throw new AppError(DomainErrorCode.USERNAME_ALREADY_EXISTS);
    }

    const passwordHash = await hashPassword(input.password);
    const createdUser = await unitOfWork.run(async () => {
      const user = await userRepository.create({
        email: input.email,
        passwordHash,
      });

      await profileRepository.create({
        userId: user.id,
        username: input.username,
        sex: input.gender,
      });

      await verificationCodeRepository.deleteByEmailAndType(
        input.email,
        VerificationCodeType.REGISTRATION,
      );

      return user;
    });

    return {
      user: toAuthUserDto(createdUser),
    };
  };
}
