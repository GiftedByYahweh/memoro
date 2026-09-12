import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

export type FastifyInstanceZod = Parameters<FastifyPluginCallbackZod>[0];
