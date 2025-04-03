import path from 'node:path';

import { fastifyAutoload } from '@fastify/autoload';
import { fastify } from 'fastify';

const app = fastify({ logger: true });

// Autoload our plugins
app.register(fastifyAutoload, {
  dir: path.join(import.meta.dirname, 'plugins'),
});

// Autoload our routes
app.register(fastifyAutoload, {
  dir: path.join(import.meta.dirname, 'routes'),
});

// After registration, we can access config
await app.after();

try {
  await app.listen({
    host: app.config.HOST,
    port: app.config.PORT,
  });

  app.log.info(`Server running on port ${app.config.PORT.toString()}`);
} catch (error) {
  app.log.error(error);
  throw new Error('Server failed to start');
}
