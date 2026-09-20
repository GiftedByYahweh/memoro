import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { ApiRoutes } from '@memoro/shared';
import type { FastifyInstanceZod } from '@/common/fastify.types';
import type { CreateMediaUseCase } from '../use-cases/create-media.use-case';
import type { CompleteMediaUseCase } from '../use-cases/complete-media.use-case';
import type { AbortMediaUseCase } from '../use-cases/abort-media.use-case';
import {
  abortMediaRouteSchema,
  completeMediaRouteSchema,
  createMediaRouteSchema,
} from './media.schema';

export interface MediaRoutesDeps {
  authGuard: preHandlerAsyncHookHandler;
  createMediaUseCase: CreateMediaUseCase;
  completeMediaUseCase: CompleteMediaUseCase;
  abortMediaUseCase: AbortMediaUseCase;
}

function registerCreateMediaRoute(
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

function registerCompleteMediaRoute(
  server: FastifyInstanceZod,
  authGuard: preHandlerAsyncHookHandler,
  useCase: CompleteMediaUseCase,
): void {
  server.post(
    ApiRoutes.media.complete,
    {
      preHandler: authGuard,
      schema: completeMediaRouteSchema,
    },
    async (request) => {
      const profileId = request.profile?.id ?? '';
      return useCase({
        mediaId: request.params.id,
        profileId,
        data: request.body,
      });
    },
  );
}

function registerAbortMediaRoute(
  server: FastifyInstanceZod,
  authGuard: preHandlerAsyncHookHandler,
  useCase: AbortMediaUseCase,
): void {
  server.post(
    ApiRoutes.media.abort,
    {
      preHandler: authGuard,
      schema: abortMediaRouteSchema,
    },
    async (request) => {
      const profileId = request.profile?.id ?? '';
      return useCase({
        mediaId: request.params.id,
        profileId,
        data: request.body,
      });
    },
  );
}

export function mediaRoutes(deps: MediaRoutesDeps): FastifyPluginCallbackZod {
  const {
    authGuard,
    createMediaUseCase: createUseCase,
    completeMediaUseCase,
    abortMediaUseCase,
  } = deps;

  return (server, _options, done): void => {
    registerCreateMediaRoute(server, authGuard, createUseCase);
    registerCompleteMediaRoute(server, authGuard, completeMediaUseCase);
    registerAbortMediaRoute(server, authGuard, abortMediaUseCase);
    done();
  };
}
