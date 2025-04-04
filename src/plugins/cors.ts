import { fastifyCors as cors, type FastifyCorsOptions } from '@fastify/cors';
import { fastifyPlugin } from 'fastify-plugin';

export const fastifyCors = fastifyPlugin<FastifyCorsOptions>(
  async (fastify, options) => {
    await fastify.register(cors, options);
  },
);

export type { FastifyCorsOptions } from '@fastify/cors';
