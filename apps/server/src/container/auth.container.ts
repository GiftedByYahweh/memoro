import type { AppConfig } from '@/config';
import { authGuard } from '@/common/guards/auth.guard';
import {
  authRoutes,
  createSessionUseCase,
  loginUseCase,
  logoutUseCase,
  registerUseCase,
  resetPasswordUseCase,
  sendVerificationCodeUseCase,
  validateSessionUseCase,
  verifyCodeUseCase,
} from '@/core/auth';
import type { Infrastructure } from './infrastructure.container';
import type { Repositories } from './repositories.container';

function initAuthUseCases(infra: Infrastructure, repos: Repositories, sessionMaxAgeMs: number) {
  const { uow: unitOfWork, mailer } = infra;
  const { userRepository, profileRepository, sessionRepository, verificationCodeRepository } =
    repos;

  return {
    registerUseCase: registerUseCase({
      userRepository,
      profileRepository,
      verificationCodeRepository,
      unitOfWork,
    }),
    loginUseCase: loginUseCase({
      userRepository,
      createSessionUseCase: createSessionUseCase({ sessionRepository, sessionMaxAgeMs }),
    }),
    logoutUseCase: logoutUseCase({ sessionRepository }),
    validateSessionUseCase: validateSessionUseCase({ userRepository, sessionRepository }),
    sendVerificationCodeUseCase: sendVerificationCodeUseCase({
      userRepository,
      verificationCodeRepository,
      mailer,
      unitOfWork,
    }),
    verifyCodeUseCase: verifyCodeUseCase({ verificationCodeRepository, unitOfWork }),
    resetPasswordUseCase: resetPasswordUseCase({
      userRepository,
      verificationCodeRepository,
      sessionRepository,
      unitOfWork,
    }),
  };
}

export function initAuthModule(infra: Infrastructure, repos: Repositories, config: AppConfig) {
  const useCases = initAuthUseCases(infra, repos, config.session.maxAge);

  const guard = authGuard({
    validateSessionUseCase: useCases.validateSessionUseCase,
    profileRepository: repos.profileRepository,
  });

  const routes = authRoutes({
    ...useCases,
    authGuard: guard,
    isProduction: config.isProduction,
  });

  return { useCases, authGuard: guard, routes };
}
