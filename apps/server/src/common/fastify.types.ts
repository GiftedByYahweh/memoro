import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import type { AuthUserDto } from '@memoro/shared';

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUserDto;
  }
}

export type FastifyInstanceZod = Parameters<FastifyPluginCallbackZod>[0];
