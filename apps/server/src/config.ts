const SESSION_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

function loadR2Config(env: NodeJS.ProcessEnv) {
  return {
    accountId: env['R2_ACCOUNT_ID'] ?? '',
    accessKeyId: env['R2_ACCESS_KEY_ID'] ?? '',
    secretAccessKey: env['R2_SECRET_ACCESS_KEY'] ?? '',
    bucketName: env['R2_BUCKET_NAME'] ?? '',
    publicUrl: env['R2_PUBLIC_URL'] ?? '',
  };
}

function loadCorsOrigin(corsOrigin: string | undefined): string[] | boolean {
  if (corsOrigin) {
    return corsOrigin.split(',');
  }
  return true;
}

export const loadAppConfig = () => {
  const env = process.env;
  const rawPort = env['PORT'];
  const port = rawPort ? Number(rawPort) : 3000;

  return {
    port: Number.isNaN(port) ? 3000 : port,
    host: env['HOST'] ?? '0.0.0.0',
    isProduction: env['NODE_ENV'] === 'production',
    logger: {
      level: env['LOG_LEVEL'] ?? 'info',
      pretty: env['NODE_ENV'] !== 'production',
    },
    session: {
      secret: env['SESSION_SECRET'] ?? 'dev-session-secret-key-at-least-32-chars-long',
      maxAge: SESSION_COOKIE_MAX_AGE,
    },
    db: {
      url: env['DB_CONNECTION_URL'] ?? '',
    },
    r2: loadR2Config(env),
    cors: {
      origin: loadCorsOrigin(env['CORS_ORIGIN']),
    },
  };
};

export type AppConfig = ReturnType<typeof loadAppConfig>;
