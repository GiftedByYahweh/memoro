import type { FastifyRequest, preHandlerAsyncHookHandler } from 'fastify';
import { DomainErrorCode } from '@memoro/shared';
import { AppError } from '@/common/error/app.error';
import { readSessionToken, type ValidateSessionUseCase } from '@/core/auth';
import type { ProfileRepository } from '@/core/profile';

export interface AuthGuardDeps {
  validateSessionUseCase: ValidateSessionUseCase;
  profileRepository: ProfileRepository;
}

export function authGuard(deps: AuthGuardDeps): preHandlerAsyncHookHandler {
  const { validateSessionUseCase, profileRepository } = deps;

  return async (request: FastifyRequest): Promise<void> => {
    const sessionToken = readSessionToken(request);

    if (!sessionToken) {
      throw new AppError(DomainErrorCode.SESSION_EXPIRED);
    }

    const user = await validateSessionUseCase({ sessionToken });
    const profile = await profileRepository.findByUserId(user.id);

    if (!profile) {
      throw new AppError(DomainErrorCode.PROFILE_NOT_FOUND);
    }

    request.user = user;
    request.profile = profile;
  };
}
