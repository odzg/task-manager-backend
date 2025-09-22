import type { Except } from 'type-fest';

import {
  fastifyEnv as env,
  type FastifyEnvOptions as EnvOptions,
} from '@fastify/env';
import { fastifyPlugin } from 'fastify-plugin';
import { type Static, Type } from 'typebox';

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvSchema;
  }
}

export interface FastifyEnvOptions extends Except<EnvOptions, 'schema'> {}

interface EnvSchema extends Static<typeof envSchema> {}

const envSchema = Type.Object({
  DATABASE_URL: Type.String({
    minLength: 1,
  }),
  HOST: Type.String({
    minLength: 1,
  }),
  JWT_SECRET: Type.String({
    minLength: 1,
  }),
  PORT: Type.Number(),
});

export const fastifyEnv = fastifyPlugin<FastifyEnvOptions>(
  async (fastify, options) => {
    await fastify.register(env, {
      ...options,
      schema: envSchema,
    });
  },
);
