import {
  type FastifyHelmetOptions,
  fastifyHelmet as helmet,
} from '@fastify/helmet';
import { fastifyPlugin } from 'fastify-plugin';

export const fastifyHelmet = fastifyPlugin<FastifyHelmetOptions>(
  async (fastify, options) => {
    await fastify.register(helmet, options);
  },
);

export type { FastifyHelmetOptions } from '@fastify/helmet';
