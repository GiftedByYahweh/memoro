import type { AppConfig } from './config.js';
import { createTxContext } from './db/txContext.js';
import { DBProvider } from './db/provider.js';
import { unitOfWork } from './db/unitOfWork.js';

export const createAppContainer = (config: AppConfig) => {
  const txContext = createTxContext();
  const dbProvider = new DBProvider(config, txContext);
  const uow = unitOfWork(dbProvider);

  const repositories = {};

  const services = {};

  const guards = {};

  return {
    infrastructure: {
      dbProvider,
      txContext,
      uow,
    },
    repositories,
    services,
    guards,
  };
};

export type AppContainer = ReturnType<typeof createAppContainer>;
