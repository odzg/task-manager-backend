import type { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox';
import type { FastifySchema } from 'fastify';

import { Type } from '@sinclair/typebox';

import { prisma } from '#instances/prisma.ts';
import { verifyPassword } from '#utils/password.ts';

const LoginSchema = {
  body: Type.Object({
    password: Type.String(),
    username: Type.String(),
  }),
  response: {
    '4xx': Type.Object({
      error: Type.String(),
    }),
    200: Type.Object({
      token: Type.String(),
    }),
  },
} satisfies FastifySchema;

const loginRoutes: FastifyPluginCallbackTypebox = (fastify, _options, done) => {
  fastify.post('/', { schema: LoginSchema }, async (request, reply) => {
    const { password, username } = request.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return reply.status(401).send({ error: 'User not found' });
    }

    const isValid = await verifyPassword({
      input: password,
      storedHash: user.password,
    });
    if (!isValid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    return {
      token: fastify.jwt.sign({
        role: user.role,
        userId: user.id,
      }),
    };
  });

  done();
};

export default loginRoutes;
