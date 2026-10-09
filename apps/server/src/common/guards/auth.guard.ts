import type { FastifyRequest, preHandlerAsyncHookHandler } from 'fastify';
import { DomainErrorCode } from '@memoro/shared';
import { AppError } from '@/common/error/app.error';
import { readSessionToken, type ValidateSessionUseCase } from '@/core/auth';

export interface AuthGuardDeps {
  validateSessionUseCase: ValidateSessionUseCase;
}

export function authGuard(deps: AuthGuardDeps): preHandlerAsyncHookHandler {
  const { validateSessionUseCase } = deps;

  return async (request: FastifyRequest): Promise<void> => {
    const sessionToken = readSessionToken(request);

    if (!sessionToken) {
      throw new AppError(DomainErrorCode.SESSION_EXPIRED);
    }

    const user = await validateSessionUseCase({ sessionToken });
    request.user = user;
  };
}
