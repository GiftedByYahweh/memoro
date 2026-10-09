import type { AppConfig } from '@/config';
import { ConsoleLogger, type Logger } from '@/logger';
import { initInfrastructure } from './infrastructure.container';
import { initRepositories } from './repositories.container';
import { initAuthModule } from './auth.container';
import { initMediaModule } from './media.container';

export const createAppContainer = (config: AppConfig, logger: Logger = new ConsoleLogger()) => {
  const infrastructure = initInfrastructure(config, logger);
  const repositories = initRepositories(infrastructure.dbProvider);
  const auth = initAuthModule(
    {
      unitOfWork: infrastructure.uow,
      mailer: infrastructure.mailer,
      userRepository: repositories.userRepository,
      sessionRepository: repositories.sessionRepository,
      verificationCodeRepository: repositories.verificationCodeRepository,
    },
    config,
  );
  const media = initMediaModule({
    fileStorage: infrastructure.fileStorage,
    mediaRepository: repositories.mediaRepository,
    authGuard: auth.authGuard,
  });

  return {
    infrastructure,
    useCases: {
      ...auth.useCases,
      ...media.useCases,
    },
    routes: {
      authRoutes: auth.routes,
      mediaRoutes: media.routes,
    },
  };
};

export type AppContainer = ReturnType<typeof createAppContainer>;
