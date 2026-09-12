import { DomainErrorCode, type AuthUserDto } from '@memoro/shared';
import { hashToken } from '@/common/crypto/crypto';
import { AppError, ErrorCode } from '@/common/error/app.error';
import type { UseCase } from '@/common/use-case';
import type { FindUserByIdUseCase } from '@/core/user';
import { toAuthUserDto } from '@/core/user';
import type { SessionRepository } from '../repositories/session.repository';

interface ValidateSessionInput {
  sessionToken: string | undefined;
}

interface ValidateSessionUseCaseDeps {
  findUserByIdUseCase: FindUserByIdUseCase;
  sessionRepository: SessionRepository;
}

export type ValidateSessionUseCase = UseCase<ValidateSessionInput, AuthUserDto>;

export function validateSessionUseCase(deps: ValidateSessionUseCaseDeps): ValidateSessionUseCase {
  const { findUserByIdUseCase, sessionRepository } = deps;

  return async (input: ValidateSessionInput): Promise<AuthUserDto> => {
    if (!input.sessionToken) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, DomainErrorCode.SESSION_EXPIRED);
    }

    const tokenHash = hashToken(input.sessionToken);
    const session = await sessionRepository.findByTokenHash(tokenHash);

    if (!session) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, DomainErrorCode.SESSION_EXPIRED);
    }

    if (session.expiresAt <= new Date()) {
      await sessionRepository.deleteByTokenHash(tokenHash);
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, DomainErrorCode.SESSION_EXPIRED);
    }

    const user = await findUserByIdUseCase({ id: session.userId });
    if (!user) {
      await sessionRepository.deleteByTokenHash(tokenHash);
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, DomainErrorCode.SESSION_EXPIRED);
    }

    return toAuthUserDto(user);
  };
}
