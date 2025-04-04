import { buildApp } from '#app.ts';

const app = await buildApp({ logger: true });

try {
  await app.listen({
    host: app.config.HOST,
    port: app.config.PORT,
  });
} catch (error) {
  app.log.error(error);
  throw new Error('Server failed to start');
}
