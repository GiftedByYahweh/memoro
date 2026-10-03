import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'drizzle-kit';

const ENV_FILE_PATH = fileURLToPath(new URL('../../.env', import.meta.url));

if (existsSync(ENV_FILE_PATH)) process.loadEnvFile(ENV_FILE_PATH);

const dbUrl = process.env['DB_CONNECTION_URL'] || '';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
  breakpoints: false,
});
