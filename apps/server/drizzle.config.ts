import { defineConfig } from 'drizzle-kit';

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
