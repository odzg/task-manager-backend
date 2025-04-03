import type { Role } from '@prisma/client';

import { fastifyJwt as jwt } from '@fastify/jwt';
import { fastifyPlugin } from 'fastify-plugin';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtUser;
  }
}

interface JwtPayload {
  role: Role;
  userId: string;
}

interface JwtUser {
  role: Role;
  userId: string;
}

const fastifyJwt = fastifyPlugin(async (fastify) => {
  await fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET,
    sign: {
      expiresIn: '1d',
    },
  });
});

export default fastifyJwt;
