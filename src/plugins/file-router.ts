import {
  fastifyAutoload as autoload,
  type AutoloadPluginOptions,
} from '@fastify/autoload';
import { fastifyPlugin } from 'fastify-plugin';
import path from 'node:path';
import { cwd } from 'node:process';

export interface FastifyFileRouterOptions extends Partial<AutoloadPluginOptions> {}

export const fastifyFileRouter = fastifyPlugin<FastifyFileRouterOptions>(
  async (fastify, options) => {
    await fastify.register(autoload, {
      dir: path.join(cwd(), 'src', 'routes'),
      ...options,
    });
  },
);
