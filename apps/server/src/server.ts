import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import { ZodError } from 'zod';
import type { AppContainer } from './container';
import type { AppConfig } from './config';
import type { Logger } from './logger/index';
import { AppError, ErrorCode } from '@/common/error/app.error';
import { HTTP_STATUS_BY_ERROR_CODE } from '@/common/error/http-status.map';
import { ApiRoutes } from '@memoro/shared';
import { errorResponse, successResponse } from '@/common/utils/api-response';

interface CreateServerOptions {
  container: AppContainer;
  config: AppConfig;
  logger: Logger;
}

async function registerPlugins(server: FastifyInstance, config: AppConfig) {
  await server.register(fastifyHelmet, { contentSecurityPolicy: false });
  await server.register(fastifyCors, {
    origin: config.cors.origin,
    credentials: true,
  });
  await server.register(fastifyCookie, { secret: config.session.secret });
  await server.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: () => {
      throw new AppError(ErrorCode.TOO_MANY_REQUESTS, 'Too many requests, please try again later');
    },
  });
}

function registerErrorHandlers(server: FastifyInstance, logger: Logger) {
  server.setNotFoundHandler((req) => {
    throw new AppError(ErrorCode.NOT_FOUND, `Requested URL (${req.method} ${req.url}) not found`);
  });

  server.setSchemaErrorFormatter((errors) => {
    const error = errors[0];
    const fieldName = error?.instancePath.substring(1);
    const field = fieldName ?? 'Field';
    const reason = error?.message ?? 'is invalid';
    return new AppError(ErrorCode.VALIDATION_ERROR, `${field}: ${reason}`);
  });

  server.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      reply.status(400).send(
        errorResponse({
          code: ErrorCode.VALIDATION_ERROR,
          message: error.issues[0]?.message ?? 'Validation failed',
        }),
      );
      return;
    }

    if (error instanceof AppError) {
      const statusCode = HTTP_STATUS_BY_ERROR_CODE[error.code];
      reply.status(statusCode).send(
        errorResponse({
          code: error.code,
          errorCode: error.errorCode,
          message: error.message,
        }),
      );
      return;
    }

    logger.error('API', `Unknown error at ${request.method} ${request.url}: ${String(error)}`);

    reply.status(500).send(
      errorResponse({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }),
    );
  });
}

function registerResponseHooks(server: FastifyInstance) {
  server.addHook('preSerialization', (_request, reply, payload, done) => {
    if (reply.statusCode >= 400) {
      done(null, payload);
      return;
    }

    done(null, successResponse(payload));
  });
}

async function registerRoutes(server: FastifyInstance, container: AppContainer) {
  server.get(ApiRoutes.health, () => ({
    uptime: process.uptime(),
  }));

  await server.register(container.routes.authRoutes, {
    prefix: ApiRoutes.auth.prefix,
  });
}

export const createServer = async (options: CreateServerOptions): Promise<FastifyInstance> => {
  const { config, logger, container } = options;
  const server = fastify({
    trustProxy: true,
  });

  await registerPlugins(server, config);
  registerResponseHooks(server);
  registerErrorHandlers(server, logger);
  await registerRoutes(server, container);

  await server.ready();
  return server;
};
