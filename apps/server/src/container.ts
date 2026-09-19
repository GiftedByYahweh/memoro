import type { AppConfig } from './config';
import type { Logger } from './logger';
import { ConsoleLogger } from './logger';
import { createTxContext } from '@/db/tx-context';
import { DBProvider } from '@/db/db.provider';
import { unitOfWork } from '@/db/unit-of-work';
import { ResendMailerProvider } from '@/common/mailer';
import { drizzleUserRepository } from '@/core/user';
import { drizzleProfileRepository } from '@/core/profile';
import { drizzleSessionRepository } from '@/core/auth/repositories/drizzle-session.repository';
import { drizzleVerificationCodeRepository } from '@/core/auth/repositories/drizzle-verification-code.repository';
import { registerUseCase } from '@/core/auth/use-cases/register.use-case';
import { loginUseCase } from '@/core/auth/use-cases/login.use-case';
import { logoutUseCase } from '@/core/auth/use-cases/logout.use-case';
import { createSessionUseCase } from '@/core/auth/use-cases/create-session.use-case';
import { validateSessionUseCase } from '@/core/auth/use-cases/validate-session.use-case';
import { sendVerificationCodeUseCase } from '@/core/auth/use-cases/send-verification-code.use-case';
import { verifyCodeUseCase } from '@/core/auth/use-cases/verify-code.use-case';
import { resetPasswordUseCase } from '@/core/auth/use-cases/reset-password.use-case';
import { authRoutes } from '@/core/auth/routes/auth.routes';

interface InfrastructureDeps {
  dbProvider: DBProvider;
  txContext: ReturnType<typeof createTxContext>;
  uow: ReturnType<typeof unitOfWork>;
  userRepository: ReturnType<typeof drizzleUserRepository>;
  profileRepository: ReturnType<typeof drizzleProfileRepository>;
  sessionRepository: ReturnType<typeof drizzleSessionRepository>;
  verificationCodeRepository: ReturnType<typeof drizzleVerificationCodeRepository>;
  mailer: ResendMailerProvider;
}

function initInfrastructure(config: AppConfig, logger: Logger): InfrastructureDeps {
  const txContext = createTxContext();
  const dbProvider = new DBProvider(config, txContext);
  const uow = unitOfWork(dbProvider);
  const mailer = new ResendMailerProvider(config.resend, logger);

  return {
    txContext,
    dbProvider,
    uow,
    mailer,
    userRepository: drizzleUserRepository(dbProvider),
    profileRepository: drizzleProfileRepository(dbProvider),
    sessionRepository: drizzleSessionRepository(dbProvider),
    verificationCodeRepository: drizzleVerificationCodeRepository(dbProvider),
  };
}

function initUseCases(infra: InfrastructureDeps, sessionMaxAgeMs: number) {
  const createSession = createSessionUseCase({
    sessionRepository: infra.sessionRepository,
    sessionMaxAgeMs,
  });

  const register = registerUseCase({
    userRepository: infra.userRepository,
    profileRepository: infra.profileRepository,
    verificationCodeRepository: infra.verificationCodeRepository,
    unitOfWork: infra.uow,
  });

  const login = loginUseCase({
    userRepository: infra.userRepository,
    createSessionUseCase: createSession,
  });

  const logout = logoutUseCase({
    sessionRepository: infra.sessionRepository,
  });

  const validateSession = validateSessionUseCase({
    userRepository: infra.userRepository,
    sessionRepository: infra.sessionRepository,
  });

  const sendVerificationCode = sendVerificationCodeUseCase({
    userRepository: infra.userRepository,
    verificationCodeRepository: infra.verificationCodeRepository,
    mailer: infra.mailer,
    unitOfWork: infra.uow,
  });

  const verifyCode = verifyCodeUseCase({
    verificationCodeRepository: infra.verificationCodeRepository,
    unitOfWork: infra.uow,
  });

  const resetPassword = resetPasswordUseCase({
    userRepository: infra.userRepository,
    verificationCodeRepository: infra.verificationCodeRepository,
    sessionRepository: infra.sessionRepository,
    unitOfWork: infra.uow,
  });

  return {
    createSessionUseCase: createSession,
    registerUseCase: register,
    loginUseCase: login,
    logoutUseCase: logout,
    validateSessionUseCase: validateSession,
    sendVerificationCodeUseCase: sendVerificationCode,
    verifyCodeUseCase: verifyCode,
    resetPasswordUseCase: resetPassword,
  };
}

export const createAppContainer = (config: AppConfig, logger: Logger = new ConsoleLogger()) => {
  const infra = initInfrastructure(config, logger);
  const useCases = initUseCases(infra, config.session.maxAge);

  const authRoutePlugin = authRoutes({
    registerUseCase: useCases.registerUseCase,
    loginUseCase: useCases.loginUseCase,
    logoutUseCase: useCases.logoutUseCase,
    validateSessionUseCase: useCases.validateSessionUseCase,
    sendVerificationCodeUseCase: useCases.sendVerificationCodeUseCase,
    verifyCodeUseCase: useCases.verifyCodeUseCase,
    resetPasswordUseCase: useCases.resetPasswordUseCase,
    isProduction: config.isProduction,
  });

  return {
    infrastructure: {
      dbProvider: infra.dbProvider,
      txContext: infra.txContext,
      uow: infra.uow,
      mailer: infra.mailer,
    },
    useCases,
    routes: {
      authRoutes: authRoutePlugin,
    },
  };
};

export type AppContainer = ReturnType<typeof createAppContainer>;
