import type { AppConfig } from '@/config';
import type { Logger } from '@/logger';
import { DBProvider } from '@/db/db.provider';
import { createTxContext, type TxContext } from '@/db/tx-context';
import { unitOfWork, type UnitOfWork } from '@/db/unit-of-work';
import { ResendMailerProvider, type Mailer } from '@/common/mailer';
import { R2FileStorageProvider, type FileStorage } from '@/common/file-storage';

interface Infrastructure {
  dbProvider: DBProvider;
  txContext: TxContext;
  uow: UnitOfWork;
  mailer: Mailer;
  fileStorage: FileStorage;
}

export function initInfrastructure(config: AppConfig, logger: Logger): Infrastructure {
  const txContext = createTxContext();
  const dbProvider = new DBProvider(config, txContext);

  return {
    txContext,
    dbProvider,
    uow: unitOfWork(dbProvider),
    mailer: new ResendMailerProvider(config.resend, logger),
    fileStorage: new R2FileStorageProvider(config.r2),
  };
}
