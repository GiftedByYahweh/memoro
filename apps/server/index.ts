import type { FastifyInstance } from 'fastify';
import { createAppContainer } from './src/container.js';
import type { AppConfig } from './src/config.js';
import { loadAppConfig } from './src/config.js';
import { createServer } from './src/server.js';
import { ConsoleLogger } from './src/logger/index.js';

export const app = async (config: AppConfig): Promise<FastifyInstance> => {
  const logger = new ConsoleLogger();

  const container = createAppContainer(config);
  logger.info('Server', 'App Container created');

  return createServer({ container, config, logger });
};

const config = loadAppConfig();
const logger = new ConsoleLogger();

app(config)
  .then(async (server) => {
    const signals = ['SIGINT', 'SIGTERM'] as const;
    for (const signal of signals) {
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

    await server.listen({ port: config.port, host: config.host });
    logger.info('Server', `Application running on http://${config.host}:${String(config.port)}`);
  })
  .catch((err: unknown) => {
    logger.error('Server', 'Failed to start server', err);
    process.exit(1);
  });
