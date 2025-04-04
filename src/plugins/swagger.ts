import type { Simplify } from 'type-fest';

import {
  fastifySwagger as swagger,
  type SwaggerOptions,
} from '@fastify/swagger';
import {
  fastifySwaggerUi,
  type FastifySwaggerUiOptions,
} from '@fastify/swagger-ui';
import { fastifyPlugin } from 'fastify-plugin';

export type FastifySwaggerOptions = Simplify<
  SwaggerOptions & { uiOptions?: FastifySwaggerUiOptions }
>;

export const fastifySwagger = fastifyPlugin<FastifySwaggerOptions>(
  async (fastify, { uiOptions, ...options }) => {
    await fastify.register(
      swagger,
      options.mode === 'static'
        ? options
        : {
            ...options,
            openapi: {
              ...options.openapi,
              info: {
                description: 'API Docs for the Task Manager',
                title: 'Task Manager API',
                version: '1.0.0',
                ...options.openapi?.info,
              },
            },
          },
    );

    await fastify.register(fastifySwaggerUi, {
      routePrefix: '/docs',
      staticCSP: true,
      ...uiOptions,
    });
  },
);
