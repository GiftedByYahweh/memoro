import { DomainErrorCode, type AuthUserDto } from '@memoro/shared';
import { hashToken } from '@/common/crypto/crypto';
import { AppError } from '@/common/error/app.error';
import type { UseCase } from '@/common/use-case';
import type { UserRepository } from '@/core/user';
import { toAuthUserDto } from '@/core/user';
import type { SessionRepository } from '../repositories/session.repository';

interface ValidateSessionInput {
  sessionToken: string | undefined;
}

interface ValidateSessionUseCaseDeps {
  userRepository: UserRepository;
  sessionRepository: SessionRepository;
}

export type ValidateSessionUseCase = UseCase<ValidateSessionInput, AuthUserDto>;

export function validateSessionUseCase(deps: ValidateSessionUseCaseDeps): ValidateSessionUseCase {
  const { userRepository, sessionRepository } = deps;

  return async (input: ValidateSessionInput): Promise<AuthUserDto> => {
    if (!input.sessionToken) {
      throw new AppError(DomainErrorCode.SESSION_EXPIRED);
    }

    const tokenHash = hashToken(input.sessionToken);
    const session = await sessionRepository.findByTokenHash(tokenHash);

    if (!session) {
      throw new AppError(DomainErrorCode.SESSION_EXPIRED);
    }

    if (session.expiresAt <= new Date()) {
      await sessionRepository.deleteByTokenHash(tokenHash);
      throw new AppError(DomainErrorCode.SESSION_EXPIRED);
    }

    const user = await userRepository.findById(session.userId);
    if (!user) {
      await sessionRepository.deleteByTokenHash(tokenHash);
      throw new AppError(DomainErrorCode.SESSION_EXPIRED);
    }

    return toAuthUserDto(user);
  };
}
