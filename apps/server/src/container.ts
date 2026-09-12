import type { AppConfig } from './config';
import { createTxContext } from '@/db/tx-context';
import { DBProvider } from '@/db/db.provider';
import { unitOfWork } from '@/db/unit-of-work';
import {
  drizzleUserRepository,
  createUserUseCase,
  findUserByEmailUseCase,
  findUserByIdUseCase,
} from '@/core/user';
import { drizzleProfileRepository, createProfileUseCase } from '@/core/profile';
import { drizzleSessionRepository } from '@/core/auth/repositories/drizzle-session.repository';
import { registerUseCase } from '@/core/auth/use-cases/register.use-case';
import { loginUseCase } from '@/core/auth/use-cases/login.use-case';
import { logoutUseCase } from '@/core/auth/use-cases/logout.use-case';
import { createSessionUseCase } from '@/core/auth/use-cases/create-session.use-case';
import { validateSessionUseCase } from '@/core/auth/use-cases/validate-session.use-case';
import { authRoutes } from '@/core/auth/routes/auth.routes';

interface InfrastructureDeps {
  dbProvider: DBProvider;
  txContext: ReturnType<typeof createTxContext>;
  uow: ReturnType<typeof unitOfWork>;
  userRepository: ReturnType<typeof drizzleUserRepository>;
  profileRepository: ReturnType<typeof drizzleProfileRepository>;
  sessionRepository: ReturnType<typeof drizzleSessionRepository>;
}

function initInfrastructure(config: AppConfig): InfrastructureDeps {
  const txContext = createTxContext();
  const dbProvider = new DBProvider(config, txContext);
  const uow = unitOfWork(dbProvider);

  return {
    txContext,
    dbProvider,
    uow,
    userRepository: drizzleUserRepository(dbProvider),
    profileRepository: drizzleProfileRepository(dbProvider),
    sessionRepository: drizzleSessionRepository(dbProvider),
  };
}

function initUseCases(infra: InfrastructureDeps, sessionMaxAgeMs: number) {
  const createUser = createUserUseCase({ userRepository: infra.userRepository });
  const findUserByEmail = findUserByEmailUseCase({ userRepository: infra.userRepository });
  const findUserById = findUserByIdUseCase({ userRepository: infra.userRepository });
  const createProfile = createProfileUseCase({ profileRepository: infra.profileRepository });

  const createSession = createSessionUseCase({
    sessionRepository: infra.sessionRepository,
    sessionMaxAgeMs,
  });

  const register = registerUseCase({
    findUserByEmailUseCase: findUserByEmail,
    createUserUseCase: createUser,
    createProfileUseCase: createProfile,
    unitOfWork: infra.uow,
  });

  const login = loginUseCase({
    findUserByEmailUseCase: findUserByEmail,
    createSessionUseCase: createSession,
  });

  const logout = logoutUseCase({
    sessionRepository: infra.sessionRepository,
  });

  const validateSession = validateSessionUseCase({
    findUserByIdUseCase: findUserById,
    sessionRepository: infra.sessionRepository,
  });

  return {
    createUserUseCase: createUser,
    findUserByEmailUseCase: findUserByEmail,
    findUserByIdUseCase: findUserById,
    createProfileUseCase: createProfile,
    createSessionUseCase: createSession,
    registerUseCase: register,
    loginUseCase: login,
    logoutUseCase: logout,
    validateSessionUseCase: validateSession,
  };
}

export const createAppContainer = (config: AppConfig) => {
  const infra = initInfrastructure(config);
  const useCases = initUseCases(infra, config.session.maxAge);

  const authRoutePlugin = authRoutes({
    registerUseCase: useCases.registerUseCase,
    loginUseCase: useCases.loginUseCase,
    logoutUseCase: useCases.logoutUseCase,
    validateSessionUseCase: useCases.validateSessionUseCase,
    isProduction: config.isProduction,
  });

  return {
    infrastructure: {
      dbProvider: infra.dbProvider,
      txContext: infra.txContext,
      uow: infra.uow,
    },
    useCases,
    routes: {
      authRoutes: authRoutePlugin,
    },
  };
};

export type AppContainer = ReturnType<typeof createAppContainer>;
