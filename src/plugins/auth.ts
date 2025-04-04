import type {
  preHandlerAsyncHookHandler,
  preHandlerHookHandler,
} from 'fastify';

import {
  fastifyAuth as auth,
  type FastifyAuthPluginOptions,
} from '@fastify/auth';
import { Role } from '@prisma/client';
import { fastifyPlugin } from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    verifyAdmin: preHandlerHookHandler;
    verifyJwt: preHandlerAsyncHookHandler;
  }
}

export const fastifyAuth = fastifyPlugin<FastifyAuthPluginOptions>(
  async (fastify, options) => {
    await fastify
      .decorate('verifyJwt', async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch {
          reply.code(401).send({ error: 'Invalid or missing token' });
        }
      })
      .decorate('verifyAdmin', (request, reply, done) => {
        if (request.user.role !== Role.ADMIN) {
          reply.code(403).send({ error: 'Forbidden - Admin only' });
        }

        done();
      })
      .register(auth, options);
  },
);

export type { FastifyAuthPluginOptions } from '@fastify/auth';
