import { DomainErrorCode, type VerificationCodeType } from '@memoro/shared';
import { AppError } from '@/common/error/app.error';
import type { UseCase } from '@/common/use-case';
import type { UnitOfWork } from '@/db/unit-of-work';
import type { VerificationCodeRepository } from '../repositories/verification-code.repository';

interface VerifyCodeInput {
  email: string;
  code: string;
  type: VerificationCodeType;
}

interface VerifyCodeOutput {
  verified: boolean;
}

interface VerifyCodeUseCaseDeps {
  verificationCodeRepository: VerificationCodeRepository;
  unitOfWork: UnitOfWork;
}

export type VerifyCodeUseCase = UseCase<VerifyCodeInput, VerifyCodeOutput>;

export function verifyCodeUseCase(deps: VerifyCodeUseCaseDeps): VerifyCodeUseCase {
  const { verificationCodeRepository, unitOfWork } = deps;

  return async (input: VerifyCodeInput): Promise<VerifyCodeOutput> => {
    return unitOfWork.run(async () => {
      const validCode = await verificationCodeRepository.findValid(
        input.email,
        input.code,
        input.type,
      );

      if (!validCode) {
        throw new AppError(DomainErrorCode.INVALID_VERIFICATION_CODE);
      }

      await verificationCodeRepository.markVerified(validCode.id);

      return { verified: true };
    });
  };
}
