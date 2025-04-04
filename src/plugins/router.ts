import path from 'node:path';
import { cwd } from 'node:process';

import {
  fastifyAutoload as autoload,
  type AutoloadPluginOptions,
} from '@fastify/autoload';
import { fastifyPlugin } from 'fastify-plugin';

export interface FastifyRouterOptions extends Partial<AutoloadPluginOptions> {}

export const fastifyRouter = fastifyPlugin<FastifyRouterOptions>(
  async (fastify, options) => {
    await fastify.register(autoload, {
      dir: path.join(cwd(), 'src', 'routes'),
      ...options,
    });
  },
);
