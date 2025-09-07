import { fastify, type FastifyServerOptions } from 'fastify';

import { fastifyAuth, type FastifyAuthPluginOptions } from '#plugins/auth.ts';
import { fastifyCors, type FastifyCorsOptions } from '#plugins/cors.ts';
import { fastifyEnv, type FastifyEnvOptions } from '#plugins/env.ts';
import {
  fastifyFileRouter,
  type FastifyFileRouterOptions,
} from '#plugins/file-router.ts';
import { fastifyHelmet, type FastifyHelmetOptions } from '#plugins/helmet.ts';
import { fastifyJwt, type FastifyJwtOptions } from '#plugins/jwt.ts';
import {
  fastifySwagger,
  type FastifySwaggerOptions,
} from '#plugins/swagger.ts';

interface BuildAppOptions extends FastifyServerOptions {
  authOptions?: FastifyAuthPluginOptions;
  corsOptions?: FastifyCorsOptions;
  envOptions?: FastifyEnvOptions;
  fileRouterOptions?: FastifyFileRouterOptions;
  helmetOptions?: FastifyHelmetOptions;
  jwtOptions?: FastifyJwtOptions;
  swaggerOptions?: FastifySwaggerOptions;
}

/**
 * Builds and configures the Fastify application.
 * @param fastifyServerOptions - The options for building the Fastify application.
 * @param fastifyServerOptions.authOptions - Options for the Fastify Auth plugin.
 * @param fastifyServerOptions.corsOptions - Options for the Fastify CORS plugin.
 * @param fastifyServerOptions.envOptions - Options for the Fastify Env plugin.
 * @param fastifyServerOptions.helmetOptions - Options for the Fastify Helmet plugin.
 * @param fastifyServerOptions.jwtOptions - Options for the Fastify JWT plugin.
 * @param fastifyServerOptions.fileRouterOptions - Options for the Fastify Router plugin.
 * @param fastifyServerOptions.swaggerOptions - Options for the Fastify Swagger plugin.
 * @returns promise that resolves to the configured Fastify instance.
 */
export const buildApp = async ({
  authOptions = {},
  corsOptions = {},
  envOptions = {},
  fileRouterOptions = {},
  helmetOptions = {},
  jwtOptions = {},
  swaggerOptions = {},
  ...fastifyServerOptions
}: BuildAppOptions) => {
  const app = fastify(fastifyServerOptions);

  await app.register(fastifyEnv, envOptions);
  await app.register(fastifyCors, corsOptions);
  await app.register(fastifyHelmet, helmetOptions);
  await app.register(fastifySwagger, swaggerOptions);
  await app.register(fastifyJwt, jwtOptions);
  await app.register(fastifyAuth, authOptions);
  await app.register(fastifyFileRouter, fileRouterOptions);

  return app;
};
