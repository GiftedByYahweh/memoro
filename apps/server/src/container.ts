import type { AppConfig } from './config';
import { createTxContext } from '@/db/tx-context';
import { DBProvider } from '@/db/db.provider';
import { unitOfWork } from '@/db/unit-of-work';
import { drizzleUserRepository } from '@/core/auth/repositories/drizzle-user.repository';
import { drizzleProfileRepository } from '@/core/profile/repositories/drizzle-profile.repository';
import { drizzleSessionRepository } from '@/core/auth/repositories/drizzle-session.repository';
import { registerUseCase } from '@/core/auth/use-cases/register.use-case';
import { createSessionUseCase } from '@/core/auth/use-cases/create-session.use-case';
import { authRoutes } from '@/core/auth/routes/auth.routes';

export const createAppContainer = (config: AppConfig) => {
  const txContext = createTxContext();
  const dbProvider = new DBProvider(config, txContext);
  const uow = unitOfWork(dbProvider);

  const userRepository = drizzleUserRepository(dbProvider);
  const profileRepository = drizzleProfileRepository(dbProvider);
  const sessionRepository = drizzleSessionRepository(dbProvider);

  const createSession = createSessionUseCase({
    sessionRepository,
    sessionMaxAgeMs: config.session.maxAge,
  });

  const register = registerUseCase({
    userRepository,
    profileRepository,
    createSessionUseCase: createSession,
    unitOfWork: uow,
  });

  const authRoutePlugin = authRoutes({
    registerUseCase: register,
    isProduction: config.isProduction,
  });

  return {
    infrastructure: {
      dbProvider,
      txContext,
      uow,
    },
    repositories: {
      userRepository,
      profileRepository,
      sessionRepository,
    },
    useCases: {
      registerUseCase: register,
      createSessionUseCase: createSession,
    },
    controllers: {},
    routes: {
      authRoutes: authRoutePlugin,
    },
    services: {},
    guards: {},
  };
};

export type AppContainer = ReturnType<typeof createAppContainer>;
