import type { FastifyInstance } from 'fastify';
import { createAppContainer } from './src/container';
import { loadAppConfig } from './src/config';
import { createServer } from './src/server';
import { ConsoleLogger } from './src/logger';

const SHUTDOWN_SIGNALS = ['SIGINT', 'SIGTERM'] as const;

const config = loadAppConfig();
const logger = new ConsoleLogger();

function registerShutdownHandlers(server: FastifyInstance): void {
  for (const signal of SHUTDOWN_SIGNALS) {
    process.on(signal, () => {
      void (async () => {
        logger.info('Server', `Received ${signal}, starting graceful shutdown...`);
        try {
          await server.close();
          logger.info('Server', 'Server closed gracefully');
          process.exit(0);
        } catch (err: unknown) {
          logger.error('Server', 'Error during graceful shutdown', err);
          process.exit(1);
        }
      })();
    });
  }
}

async function bootstrap(): Promise<void> {
  const container = createAppContainer(config, logger);
  logger.info('Server', 'App Container created');

  const server = await createServer({ container, config, logger });
  registerShutdownHandlers(server);

  await server.listen({ port: config.port, host: config.host });
  logger.info('Server', `Application running on http://${config.host}:${String(config.port)}`);
}

bootstrap().catch((err: unknown) => {
  logger.error('Server', 'Failed to start server', err);
  process.exit(1);
});
