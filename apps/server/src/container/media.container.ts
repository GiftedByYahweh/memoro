import type { preHandlerAsyncHookHandler } from 'fastify';
import {
  abortMediaUseCase,
  completeMediaUseCase,
  createMediaUseCase,
  mediaRoutes,
} from '@/core/media';
import type { Infrastructure } from './infrastructure.container';
import type { Repositories } from './repositories.container';

export function initMediaModule(
  infra: Infrastructure,
  repos: Repositories,
  guard: preHandlerAsyncHookHandler,
) {
  const deps = { fileStorage: infra.fileStorage, mediaRepository: repos.mediaRepository };

  const useCases = {
    createMediaUseCase: createMediaUseCase(deps),
    completeMediaUseCase: completeMediaUseCase(deps),
    abortMediaUseCase: abortMediaUseCase(deps),
  };

  const routes = mediaRoutes({ ...useCases, authGuard: guard });

  return { useCases, routes };
}
