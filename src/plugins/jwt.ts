import { type FastifyJWTOptions, fastifyJwt as jwt } from '@fastify/jwt';
import { fastifyPlugin } from 'fastify-plugin';

import type { Role } from '#generated/prisma/client.js';

interface JwtPayload {
  role: Role;
  userId: string;
}

interface JwtUser {
  role: Role;
  userId: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtUser;
  }
}

export interface FastifyJwtOptions extends Partial<FastifyJWTOptions> {}

export const fastifyJwt = fastifyPlugin<FastifyJwtOptions>(
  async (fastify, options) => {
    await fastify.register(jwt, {
      secret: fastify.config.JWT_SECRET,
      ...options,
      sign: {
        expiresIn: '1d',
        ...options.sign,
      },
    });
  },
);
