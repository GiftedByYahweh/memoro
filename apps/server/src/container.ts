import type { AppConfig } from './config';
import { createTxContext } from '@/db/tx-context';
import { DBProvider } from '@/db/db.provider';
import { unitOfWork } from '@/db/unit-of-work';
import { drizzleUserRepository } from '@/core/auth/repositories/drizzle-user.repository';
import { drizzleProfileRepository, createProfileUseCase } from '@/core/profile';
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

  const createProfile = createProfileUseCase({ profileRepository });

  const createSession = createSessionUseCase({
    sessionRepository,
    sessionMaxAgeMs: config.session.maxAge,
  });

  const register = registerUseCase({
    userRepository,
    createProfileUseCase: createProfile,
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
    useCases: {
      registerUseCase: register,
      createSessionUseCase: createSession,
      createProfileUseCase: createProfile,
    },
    routes: {
      authRoutes: authRoutePlugin,
    },
  };
};

export type AppContainer = ReturnType<typeof createAppContainer>;
