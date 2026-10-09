import type { AppConfig } from '@/config';
import type { UnitOfWork } from '@/db/unit-of-work';
import type { Mailer } from '@/common/mailer';
import { authGuard } from '@/common/guards/auth.guard';
import type { UserRepository } from '@/core/user';
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
  type SessionRepository,
  type VerificationCodeRepository,
} from '@/core/auth';

export interface AuthModuleDeps {
  unitOfWork: UnitOfWork;
  mailer: Mailer;
  userRepository: UserRepository;
  sessionRepository: SessionRepository;
  verificationCodeRepository: VerificationCodeRepository;
}

function initAuthUseCases(deps: AuthModuleDeps, sessionMaxAgeMs: number) {
  const { unitOfWork, mailer, userRepository, sessionRepository, verificationCodeRepository } =
    deps;

  return {
    registerUseCase: registerUseCase({
      userRepository,
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

export function initAuthModule(deps: AuthModuleDeps, config: AppConfig) {
  const useCases = initAuthUseCases(deps, config.session.maxAge);

  const guard = authGuard({ validateSessionUseCase: useCases.validateSessionUseCase });

  const routes = authRoutes({
    ...useCases,
    isProduction: config.isProduction,
  });

  return { useCases, authGuard: guard, routes };
}
