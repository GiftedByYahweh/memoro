import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import type { preHandlerAsyncHookHandler } from 'fastify';
import { ApiRoutes } from '@memoro/shared';
import type { FastifyInstanceZod } from '@/common/fastify.types';
import type { RequestUploadUrlUseCase } from '../use-cases/request-upload-url.use-case';
import { requestUploadUrlRouteSchema } from './media.schema';

export interface MediaRoutesDeps {
  authGuard: preHandlerAsyncHookHandler;
  requestUploadUrlUseCase: RequestUploadUrlUseCase;
}

function requestUploadUrlRoute(
  server: FastifyInstanceZod,
  authGuard: preHandlerAsyncHookHandler,
  useCase: RequestUploadUrlUseCase,
): void {
  server.post(
    ApiRoutes.media.uploadUrl,
    {
      preHandler: authGuard,
      schema: requestUploadUrlRouteSchema,
    },
    async (request) => {
      const profileId = request.profile?.id ?? '';
      return useCase({
        profileId,
        fileName: request.body.fileName,
        contentType: request.body.contentType,
      });
    },
  );
}

export function mediaRoutes(deps: MediaRoutesDeps): FastifyPluginCallbackZod {
  const { authGuard, requestUploadUrlUseCase: uploadUrlUseCase } = deps;

  return (server, _options, done): void => {
    requestUploadUrlRoute(server, authGuard, uploadUrlUseCase);
    done();
  };
}
