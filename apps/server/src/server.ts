import fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
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

const DOCS_ROUTE_PREFIX = '/docs';

async function registerDocs(server: FastifyInstance, config: AppConfig) {
  if (config.isProduction) return;

  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Memoro API',
        version: '0.1.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: DOCS_ROUTE_PREFIX,
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
  server.addHook('preSerialization', (request, reply, payload, done) => {
    if (reply.statusCode >= 400 || request.url.startsWith(DOCS_ROUTE_PREFIX)) {
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

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  await registerPlugins(server, config);
  await registerDocs(server, config);
  registerResponseHooks(server);
  registerErrorHandlers(server, logger);
  await registerRoutes(server, container);

  await server.ready();
  return server;
};
