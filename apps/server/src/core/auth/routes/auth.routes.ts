import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { ApiRoutes } from '@memoro/shared';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_PATH, SAME_SITE } from '../auth.constants';
import type { RegisterUseCase } from '../use-cases/register.use-case';
import type { LoginUseCase } from '../use-cases/login.use-case';
import type { LogoutUseCase } from '../use-cases/logout.use-case';
import type { FastifyInstanceZod } from '@/common/fastify.types';
import { loginRouteSchema, registerRouteSchema } from './auth.schema';

export interface AuthRoutesDeps {
  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  logoutUseCase: LogoutUseCase;
  isProduction: boolean;
}

function registerRoute(server: FastifyInstanceZod, registerUseCase: RegisterUseCase): void {
  server.post(
    ApiRoutes.auth.register,
    { schema: registerRouteSchema },
    async (request) => {
      const body = request.body;
      const { user } = await registerUseCase({
        email: body.email,
        password: body.password,
      });

      return user;
    },
  );
}

function loginRoute(
  server: FastifyInstanceZod,
  loginUseCase: LoginUseCase,
  isProduction: boolean,
): void {
  server.post(
    ApiRoutes.auth.login,
    { schema: loginRouteSchema },
    async (request, reply) => {
      const body = request.body;
      const userAgent = request.headers['user-agent'];
      const ipAddress = request.ip;

      const { user, sessionToken, maxAgeSeconds } = await loginUseCase({
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
}

function logoutRoute(server: FastifyInstanceZod, logoutUseCase: LogoutUseCase): void {
  server.post(
    ApiRoutes.auth.logout,
    async (request, reply) => {
      const rawCookie = request.cookies[AUTH_COOKIE_NAME];
      const unsigned = rawCookie ? request.unsignCookie(rawCookie) : null;
      const sessionToken = unsigned?.valid ? unsigned.value : undefined;

      await logoutUseCase({
        sessionToken,
      });

      reply.clearCookie(AUTH_COOKIE_NAME, {
        path: AUTH_COOKIE_PATH,
      });

      return null;
    },
  );
}

export function authRoutes(deps: AuthRoutesDeps): FastifyPluginCallbackZod {
  const { registerUseCase, loginUseCase, logoutUseCase, isProduction } = deps;

  return (server, _options, done): void => {
    registerRoute(server, registerUseCase);
    loginRoute(server, loginUseCase, isProduction);
    logoutRoute(server, logoutUseCase);
    done();
  };
}
