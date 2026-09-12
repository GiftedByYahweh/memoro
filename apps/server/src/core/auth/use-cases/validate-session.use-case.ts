import { DomainErrorCode, type AuthUserDto } from '@memoro/shared';
import { hashToken } from '@/common/crypto/crypto';
import { AppError, ErrorCode } from '@/common/error/app.error';
import type { UseCase } from '@/common/use-case';
import type { UserRepository } from '../repositories/user.repository';
import type { SessionRepository } from '../repositories/session.repository';
import { toAuthUserDto } from '../mappers/user.mapper';

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
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        DomainErrorCode.SESSION_EXPIRED,
      );
    }

    const tokenHash = hashToken(input.sessionToken);
    const session = await sessionRepository.findByTokenHash(tokenHash);

    if (!session) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        DomainErrorCode.SESSION_EXPIRED,
      );
    }

    if (session.expiresAt <= new Date()) {
      await sessionRepository.deleteByTokenHash(tokenHash);
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        DomainErrorCode.SESSION_EXPIRED,
      );
    }

    const user = await userRepository.findById(session.userId);
    if (!user) {
      await sessionRepository.deleteByTokenHash(tokenHash);
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        DomainErrorCode.SESSION_EXPIRED,
      );
    }

    return toAuthUserDto(user);
  };
}
