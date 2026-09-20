import type { AppConfig } from './config';
import type { Logger } from './logger';
import { ConsoleLogger } from './logger';
import { createTxContext } from '@/db/tx-context';
import { DBProvider } from '@/db/db.provider';
import { unitOfWork } from '@/db/unit-of-work';
import { ResendMailerProvider } from '@/common/mailer';
import { R2FileStorageProvider, type FileStorage } from '@/common/file-storage';
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
import { authGuard } from '@/common/guards/auth.guard';
import { authRoutes } from '@/core/auth/routes/auth.routes';
import { createMediaUseCase, drizzleMediaRepository, mediaRoutes } from '@/core/media';

interface InfrastructureDeps {
  dbProvider: DBProvider;
  txContext: ReturnType<typeof createTxContext>;
  uow: ReturnType<typeof unitOfWork>;
  userRepository: ReturnType<typeof drizzleUserRepository>;
  profileRepository: ReturnType<typeof drizzleProfileRepository>;
  sessionRepository: ReturnType<typeof drizzleSessionRepository>;
  verificationCodeRepository: ReturnType<typeof drizzleVerificationCodeRepository>;
  mediaRepository: ReturnType<typeof drizzleMediaRepository>;
  mailer: ResendMailerProvider;
  fileStorage: FileStorage;
}

function initInfrastructure(config: AppConfig, logger: Logger): InfrastructureDeps {
  const txContext = createTxContext();
  const dbProvider = new DBProvider(config, txContext);
  const uow = unitOfWork(dbProvider);
  const mailer = new ResendMailerProvider(config.resend, logger);
  const fileStorage = new R2FileStorageProvider(config.r2);

  return {
    txContext,
    dbProvider,
    uow,
    mailer,
    fileStorage,
    userRepository: drizzleUserRepository(dbProvider),
    profileRepository: drizzleProfileRepository(dbProvider),
    sessionRepository: drizzleSessionRepository(dbProvider),
    verificationCodeRepository: drizzleVerificationCodeRepository(dbProvider),
    mediaRepository: drizzleMediaRepository(dbProvider),
  };
}

function initAuthUseCases(infra: InfrastructureDeps, sessionMaxAgeMs: number) {
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

function initMediaUseCases(infra: InfrastructureDeps) {
  const createMedia = createMediaUseCase({
    fileStorage: infra.fileStorage,
    mediaRepository: infra.mediaRepository,
  });

  return {
    createMediaUseCase: createMedia,
  };
}

export const createAppContainer = (config: AppConfig, logger: Logger = new ConsoleLogger()) => {
  const infra = initInfrastructure(config, logger);
  const authUseCases = initAuthUseCases(infra, config.session.maxAge);
  const mediaUseCases = initMediaUseCases(infra);

  const guard = authGuard({
    validateSessionUseCase: authUseCases.validateSessionUseCase,
    profileRepository: infra.profileRepository,
  });

  const authRoutePlugin = authRoutes({
    ...authUseCases,
    authGuard: guard,
    isProduction: config.isProduction,
  });

  const mediaRoutePlugin = mediaRoutes({
    authGuard: guard,
    createMediaUseCase: mediaUseCases.createMediaUseCase,
  });

  return {
    infrastructure: {
      dbProvider: infra.dbProvider,
      txContext: infra.txContext,
      uow: infra.uow,
      mailer: infra.mailer,
      fileStorage: infra.fileStorage,
    },
    useCases: {
      ...authUseCases,
      ...mediaUseCases,
    },
    routes: {
      authRoutes: authRoutePlugin,
      mediaRoutes: mediaRoutePlugin,
    },
  };
};

export type AppContainer = ReturnType<typeof createAppContainer>;
