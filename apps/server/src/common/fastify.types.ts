import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import type { AuthUserDto } from '@memoro/shared';
import type { Profile } from '@/core/profile';

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUserDto;
    profile?: Profile;
  }
}

export type FastifyInstanceZod = Parameters<FastifyPluginCallbackZod>[0];
