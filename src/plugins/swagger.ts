import { fastifySwagger as swagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastifyPlugin } from 'fastify-plugin';

const fastifySwagger = fastifyPlugin(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        description: 'API Docs for the Task Manager',
        title: 'Task Manager API',
        version: '1.0.0',
      },
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    staticCSP: true,
  });
});

export default fastifySwagger;
