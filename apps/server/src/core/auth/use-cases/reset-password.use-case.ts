import { DomainErrorCode, VerificationCodeType } from '@memoro/shared';
import { hashPassword } from '@/common/crypto/crypto';
import { AppError } from '@/common/error/app.error';
import type { UseCase } from '@/common/use-case';
import type { UserRepository } from '@/core/user';
import type { UnitOfWork } from '@/db/unit-of-work';
import type { SessionRepository } from '../repositories/session.repository';
import type { VerificationCodeRepository } from '../repositories/verification-code.repository';

interface ResetPasswordInput {
  email: string;
  password: string;
}

interface ResetPasswordOutput {
  success: boolean;
}

interface ResetPasswordDeps {
  userRepository: UserRepository;
  verificationCodeRepository: VerificationCodeRepository;
  sessionRepository: SessionRepository;
  unitOfWork: UnitOfWork;
}

export type ResetPasswordUseCase = UseCase<ResetPasswordInput, ResetPasswordOutput>;

export function resetPasswordUseCase(deps: ResetPasswordDeps): ResetPasswordUseCase {
  const { userRepository, verificationCodeRepository, sessionRepository, unitOfWork } = deps;

  return async (input: ResetPasswordInput): Promise<ResetPasswordOutput> => {
    const verifiedCode = await verificationCodeRepository.findVerified(
      input.email,
      VerificationCodeType.PASSWORD_RESET,
    );

    if (!verifiedCode) {
      throw new AppError(DomainErrorCode.INVALID_VERIFICATION_CODE);
    }

    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(DomainErrorCode.USER_NOT_FOUND);
    }

    const passwordHash = await hashPassword(input.password);

    await unitOfWork.run(async () => {
      await userRepository.updatePassword(user.id, passwordHash);
      await sessionRepository.deleteByUserId(user.id);
      await verificationCodeRepository.deleteByEmailAndType(
        input.email,
        VerificationCodeType.PASSWORD_RESET,
      );
    });

    return { success: true };
  };
}
