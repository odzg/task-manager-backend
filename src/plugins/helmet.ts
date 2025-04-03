import { fastifyHelmet as helmet } from '@fastify/helmet';
import { fastifyPlugin } from 'fastify-plugin';

const fastifyHelmet = fastifyPlugin(async (fastify) => {
  await fastify.register(helmet);
});

export default fastifyHelmet;
