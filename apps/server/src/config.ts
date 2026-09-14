import { requireEnv } from '@memoro/shared';

export const loadAppConfig = () => {
  const env = process.env;
  const rawPort = env['PORT'];
  const port = rawPort ? Number(rawPort) : 3000;

  return {
    port: Number.isNaN(port) ? 3000 : port,
    host: requireEnv(env, 'HOST'),
    isProduction: env['NODE_ENV'] === 'production',
    logger: {
      level: env['LOG_LEVEL'] ?? 'info',
      pretty: env['NODE_ENV'] !== 'production',
    },
    session: {
      secret: requireEnv(env, 'SESSION_SECRET'),
      maxAge: requireEnv(env, 'SESSION_MAX_AGE_MS'),
    },
    db: {
      url: requireEnv(env, 'DB_CONNECTION_URL'),
    },
    r2: {
      accountId: requireEnv(env, 'R2_ACCOUNT_ID'),
      accessKeyId: requireEnv(env, 'R2_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv(env, 'R2_SECRET_ACCESS_KEY'),
      bucketName: requireEnv(env, 'R2_BUCKET_NAME'),
    },
    cors: {
      origin: requireEnv(env, 'CORS_ORIGIN').split(','),
    },
  };
};

export type AppConfig = ReturnType<typeof loadAppConfig>;
