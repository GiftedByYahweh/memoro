import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import { ZodError } from 'zod';
import type { AppContainer } from './container.js';
import type { AppConfig } from './config.js';
import type { Logger } from './logger/index.js';
import { AppError, ErrorCode } from './common/error/appError.js';
import { HTTP_STATUS_BY_ERROR_CODE } from './common/error/httpStatusMap.js';

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
      reply.status(400).send({
        ok: false,
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: error.issues,
        timestamp: Date.now(),
      });
      return;
    }

    if (error instanceof AppError) {
      const statusCode = HTTP_STATUS_BY_ERROR_CODE[error.code];
      reply.status(statusCode).send({
        ok: false,
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: Date.now(),
      });
      return;
    }

    logger.error('API', `Unknown error at ${request.method} ${request.url}: ${String(error)}`);

    reply.status(500).send({
      ok: false,
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      timestamp: Date.now(),
    });
  });
}

function registerRoutes(server: FastifyInstance) {
  server.get('/health', () => ({
    ok: true,
    uptime: process.uptime(),
    timestamp: Date.now(),
  }));
}

export const createServer = async (
  options: CreateServerOptions,
): Promise<FastifyInstance> => {
  const { config, logger } = options;
  const server = fastify({
    trustProxy: true,
  });

  await registerPlugins(server, config);
  registerErrorHandlers(server, logger);
  registerRoutes(server);

  await server.ready();
  return server;
};
