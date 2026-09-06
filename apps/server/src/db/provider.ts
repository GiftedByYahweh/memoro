import { Pool } from 'pg';
import type { AppConfig } from '../config.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { TxContext } from './txContext.js';

type DBClient = ReturnType<typeof drizzle>;
export type DBExecutor = DBClient | Parameters<Parameters<DBClient['transaction']>[0]>[0];

export class DBProvider {
  private db: DBClient;
  private pool: Pool;

  constructor(
    config: AppConfig,
    private txContext: TxContext,
  ) {
    this.pool = new Pool({
      connectionString: config.db.url,
    });
    this.db = drizzle(this.pool);
  }

  public current(): DBExecutor {
    return this.txContext.get() ?? this.db;
  }

  public transaction<T>(fn: () => Promise<T>): Promise<T> {
    return this.db.transaction((tx) => this.txContext.run(tx, fn));
  }
}
