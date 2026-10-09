import type { preHandlerAsyncHookHandler } from 'fastify';
import type { FileStorage } from '@/common/file-storage';
import {
  abortMediaUseCase,
  completeMediaUseCase,
  createMediaUseCase,
  mediaRoutes,
  type MediaRepository,
} from '@/core/media';

export interface MediaModuleDeps {
  fileStorage: FileStorage;
  mediaRepository: MediaRepository;
  authGuard: preHandlerAsyncHookHandler;
}

export function initMediaModule(deps: MediaModuleDeps) {
  const { authGuard, ...useCaseDeps } = deps;

  const useCases = {
    createMediaUseCase: createMediaUseCase(useCaseDeps),
    completeMediaUseCase: completeMediaUseCase(useCaseDeps),
    abortMediaUseCase: abortMediaUseCase(useCaseDeps),
  };

  const routes = mediaRoutes({ ...useCases, authGuard });

  return { useCases, routes };
}
