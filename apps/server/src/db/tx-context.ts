import { AsyncLocalStorage } from 'node:async_hooks';
import type { DBExecutor } from './db.provider.js';


export interface TxContext {
  run<T>(executor: DBExecutor, fn: () => Promise<T>): Promise<T>;
  get(): DBExecutor | undefined;
}

export const createTxContext = (): TxContext => {
  const storage = new AsyncLocalStorage<DBExecutor>();
  return {
    run: <T>(executor: DBExecutor, fn: () => Promise<T>) => storage.run(executor, fn),
    get: (): DBExecutor | undefined => storage.getStore(),
  };
};
