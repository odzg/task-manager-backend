import { fastifyEnv as env } from '@fastify/env';
import { type Static, Type } from '@sinclair/typebox';
import { fastifyPlugin } from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    config: EnvSchema;
  }
}

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

type EnvSchema = Static<typeof envSchema>;

const fastifyEnv = fastifyPlugin(async (fastify) => {
  await fastify.register(env, {
    schema: envSchema,
  });
});

export default fastifyEnv;
