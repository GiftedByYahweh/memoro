import { DomainErrorCode, type AuthUserDto } from '@memoro/shared';
import { verifyPassword } from '@/common/crypto/crypto';
import { AppError, ErrorCode } from '@/common/error/app.error';
import type { UseCase } from '@/common/use-case';
import type { FindUserByEmailUseCase } from '@/core/user';
import { toAuthUserDto } from '@/core/user';
import type { CreateSessionUseCase } from './create-session.use-case';

interface LoginInput {
  email: string;
  password: string;
  userAgent: string | null;
  ipAddress: string | null;
}

interface LoginOutput {
  user: AuthUserDto;
  sessionToken: string;
  maxAgeSeconds: number;
}

interface LoginUseCaseDeps {
  findUserByEmailUseCase: FindUserByEmailUseCase;
  createSessionUseCase: CreateSessionUseCase;
}

export type LoginUseCase = UseCase<LoginInput, LoginOutput>;

export function loginUseCase(deps: LoginUseCaseDeps): LoginUseCase {
  const { findUserByEmailUseCase, createSessionUseCase } = deps;

  return async (input: LoginInput): Promise<LoginOutput> => {
    const user = await findUserByEmailUseCase({ email: input.email });
    if (!user) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        DomainErrorCode.INVALID_LOGIN_CREDENTIALS,
      );
    }

    const isPasswordValid = await verifyPassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        DomainErrorCode.INVALID_LOGIN_CREDENTIALS,
      );
    }

    const { rawToken, maxAgeSeconds } = await createSessionUseCase({
      userId: user.id,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    });

    return {
      user: toAuthUserDto(user),
      sessionToken: rawToken,
      maxAgeSeconds,
    };
  };
}
