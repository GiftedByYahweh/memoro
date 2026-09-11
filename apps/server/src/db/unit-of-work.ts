import type { DBProvider } from './db.provider.js';

export interface UnitOfWork {
  run<T>(fn: () => Promise<T>): Promise<T>;
}

export function unitOfWork(dbProvider: DBProvider): UnitOfWork {
  return {
    run: <T>(fn: () => Promise<T>) => dbProvider.transaction(fn),
  };
}
