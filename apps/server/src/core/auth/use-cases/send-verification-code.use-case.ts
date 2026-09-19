import {
  AUTH_CONSTRAINTS,
  DomainErrorCode,
  VerificationCodeType,
  type VerificationCodeType as VerificationCodeTypeValue,
} from '@memoro/shared';
import { generateVerificationCode } from '@/common/crypto/crypto';
import { AppError } from '@/common/error/app.error';
import type { Mailer } from '@/common/mailer';
import type { UseCase } from '@/common/use-case';
import type { UserRepository } from '@/core/user';
import type { UnitOfWork } from '@/db/unit-of-work';
import type { VerificationCodeRepository } from '../repositories/verification-code.repository';

interface SendVerificationCodeInput {
  email: string;
  type: VerificationCodeTypeValue;
}

interface SendVerificationCodeOutput {
  sent: boolean;
}

interface SendVerificationCodeDeps {
  userRepository: UserRepository;
  verificationCodeRepository: VerificationCodeRepository;
  mailer: Mailer;
  unitOfWork: UnitOfWork;
}

export type SendVerificationCodeUseCase = UseCase<
  SendVerificationCodeInput,
  SendVerificationCodeOutput
>;

export function sendVerificationCodeUseCase(
  deps: SendVerificationCodeDeps,
): SendVerificationCodeUseCase {
  const { userRepository, verificationCodeRepository, mailer, unitOfWork } = deps;

  return async (input: SendVerificationCodeInput): Promise<SendVerificationCodeOutput> => {
    const existingUser = await userRepository.findByEmail(input.email);

    if (input.type === VerificationCodeType.REGISTRATION && existingUser) {
      throw new AppError(DomainErrorCode.USER_ALREADY_EXISTS);
    }

    if (input.type === VerificationCodeType.PASSWORD_RESET && !existingUser) {
      throw new AppError(DomainErrorCode.USER_NOT_FOUND);
    }

    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + AUTH_CONSTRAINTS.VERIFICATION_CODE_TTL_MS);

    await unitOfWork.run(async () => {
      await verificationCodeRepository.deleteByEmailAndType(input.email, input.type);
      await verificationCodeRepository.create({
        email: input.email,
        code,
        type: input.type,
        expiresAt,
      });
    });

    const subject =
      input.type === VerificationCodeType.REGISTRATION
        ? 'Your Memoro verification code'
        : 'Your Memoro password reset code';

    await mailer.sendMail({
      to: input.email,
      subject,
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });

    return { sent: true };
  };
}
