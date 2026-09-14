import { defineConfig } from 'drizzle-kit';

const dbUrl = process.env['DB_CONNECTION_URL'];
if (!dbUrl) throw new Error('DB_CONNECTION_URL is missing in environment variables');

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
  breakpoints: false,
});
