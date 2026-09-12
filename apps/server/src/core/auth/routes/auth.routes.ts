import type { FastifyPluginCallback } from 'fastify';
import { ApiRoutes, registerSchema } from '@memoro/shared';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_PATH, SAME_SITE } from '../auth.constants';
import type { RegisterUseCase } from '../use-cases/register.use-case';
import { registerRouteSchema } from './auth.schema';

export interface AuthRoutesDeps {
  registerUseCase: RegisterUseCase;
  isProduction: boolean;
}

export function authRoutes(deps: AuthRoutesDeps): FastifyPluginCallback {
  const { registerUseCase, isProduction } = deps;

  return (server, _options, done): void => {
    server.post(
      ApiRoutes.auth.register,
      { schema: registerRouteSchema },
      async (request, reply) => {
        const body = registerSchema.parse(request.body);
        const userAgent = request.headers['user-agent'];
        const ipAddress = request.ip;

        const { user, sessionToken, maxAgeSeconds } = await registerUseCase({
          email: body.email,
          password: body.password,
          userAgent,
          ipAddress,
        });

        reply.setCookie(AUTH_COOKIE_NAME, sessionToken, {
          path: AUTH_COOKIE_PATH,
          httpOnly: true,
          secure: isProduction,
          sameSite: SAME_SITE.LAX,
          signed: true,
          maxAge: maxAgeSeconds,
        });

        return user;
      },
    );

    done();
  };
}
