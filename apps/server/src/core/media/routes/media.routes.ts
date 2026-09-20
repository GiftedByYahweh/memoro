import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { ApiRoutes } from '@memoro/shared';
import type { FastifyInstanceZod } from '@/common/fastify.types';
import type { CreateMediaUseCase } from '../use-cases/create-media.use-case';
import { createMediaRouteSchema } from './media.schema';

export interface MediaRoutesDeps {
  authGuard: preHandlerAsyncHookHandler;
  createMediaUseCase: CreateMediaUseCase;
}

function createMediaRoute(
  server: FastifyInstanceZod,
  authGuard: preHandlerAsyncHookHandler,
  useCase: CreateMediaUseCase,
): void {
  server.post(
    ApiRoutes.media.root,
    {
      preHandler: authGuard,
      schema: createMediaRouteSchema,
    },
    async (request) => {
      const profileId = request.profile?.id ?? '';
      return useCase({
        profileId,
        data: request.body,
      });
    },
  );
}

export function mediaRoutes(deps: MediaRoutesDeps): FastifyPluginCallbackZod {
  const { authGuard, createMediaUseCase: createUseCase } = deps;

  return (server, _options, done): void => {
    createMediaRoute(server, authGuard, createUseCase);
    done();
  };
}
