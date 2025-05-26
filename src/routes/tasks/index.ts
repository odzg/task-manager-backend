import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import type { FastifySchema } from 'fastify';

import { Type } from '@sinclair/typebox';
import { parseISO } from 'date-fns';

import { Role, Status } from '#generated/prisma/client.js';
import { prisma } from '#instances/prisma.ts';

const Task = Type.Object({
  createdAt: Type.String({
    format: 'date-time',
  }),
  description: Type.Union([Type.String(), Type.Null()]),
  id: Type.String(),
  reminderDate: Type.String({
    format: 'date-time',
  }),
  status: Type.Enum(Status),
  title: Type.String(),
  updatedAt: Type.String({
    format: 'date-time',
  }),
  userId: Type.String(),
});

const GetTasksSchema = {
  response: {
    200: Type.Array(Task),
  },
} satisfies FastifySchema;

const CreateTaskSchema = {
  body: Type.Composite([
    Type.Pick(Task, ['reminderDate', 'title', 'userId']),
    Type.Partial(Type.Pick(Task, ['description'])),
  ]),
  response: {
    200: Task,
  },
} satisfies FastifySchema;

const UpdateTaskSchema = {
  body: Type.Partial(
    Type.Pick(Task, ['description', 'reminderDate', 'status', 'title']),
  ),
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    '4xx': Type.Object({
      error: Type.String(),
    }),
    200: Task,
  },
} satisfies FastifySchema;

const DeleteTaskSchema = {
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    '4xx': Type.Object({
      error: Type.String(),
    }),
    200: Task,
  },
} satisfies FastifySchema;

const tasksRoutes: FastifyPluginAsyncTypebox = (fastify) => {
  fastify.addHook('preHandler', fastify.auth([fastify.verifyJwt]));

  fastify.route({
    async handler(request) {
      const { role, userId } = request.user;

      const tasks = await prisma.task.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          createdAt: true,
          description: true,
          id: true,
          reminderDate: true,
          status: true,
          title: true,
          updatedAt: true,
          userId: true,
        },
        where: {
          OR: [
            {
              deletedAt: null,
            },
            {
              deletedAt: {
                isSet: false,
              },
            },
          ],

          // If user is admin, retrieve all tasks; otherwise, retrieve only the user's tasks
          ...(role !== Role.ADMIN && { userId }),
        },
      });

      return tasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        reminderDate: task.reminderDate.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      }));
    },
    method: 'GET',
    schema: GetTasksSchema,
    url: '/',
  });

  fastify.route({
    async handler(request) {
      const { reminderDate, ...body } = request.body;

      const newTask = await prisma.task.create({
        data: {
          ...body,
          reminderDate: parseISO(reminderDate),
        },
        select: {
          createdAt: true,
          description: true,
          id: true,
          reminderDate: true,
          status: true,
          title: true,
          updatedAt: true,
          userId: true,
        },
      });

      return {
        ...newTask,
        createdAt: newTask.createdAt.toISOString(),
        reminderDate: newTask.reminderDate.toISOString(),
        updatedAt: newTask.updatedAt.toISOString(),
      };
    },
    method: 'POST',
    preHandler: fastify.auth([fastify.verifyAdmin]),
    schema: CreateTaskSchema,
    url: '/',
  });

  fastify.route({
    handler: async (request, reply) => {
      const { id } = request.params;
      const { role, userId } = request.user;

      const existingTask = await prisma.task.findUnique({
        select: { userId: true },
        where: {
          id,
          OR: [
            {
              deletedAt: null,
            },
            {
              deletedAt: {
                isSet: false,
              },
            },
          ],
        },
      });

      if (!existingTask) {
        return reply.code(404).send({ error: 'Task not found' });
      }
      if (role !== Role.ADMIN && existingTask.userId !== userId) {
        return reply.code(403).send({ error: 'Forbidden' });
      }

      const { reminderDate, ...body } = request.body;

      const updatedTask = await prisma.task.update({
        data: {
          ...body,
          ...(reminderDate && {
            reminderDate: parseISO(reminderDate),
          }),
        },
        where: { id },
      });

      return {
        ...updatedTask,
        createdAt: updatedTask.createdAt.toISOString(),
        reminderDate: updatedTask.reminderDate.toISOString(),
        updatedAt: updatedTask.updatedAt.toISOString(),
      };
    },
    method: 'PUT',
    schema: UpdateTaskSchema,
    url: '/:id',
  });

  fastify.route({
    handler: async (request, reply) => {
      const { id } = request.params;

      const existingTask = await prisma.task.findUnique({
        where: {
          id,
          OR: [
            {
              deletedAt: null,
            },
            {
              deletedAt: {
                isSet: false,
              },
            },
          ],
        },
      });

      if (!existingTask) {
        return reply.code(404).send({ error: 'Task not found' });
      }

      const deletedTask = await prisma.task.update({
        data: { deletedAt: new Date() },
        where: { id },
      });

      return {
        ...deletedTask,
        createdAt: deletedTask.createdAt.toISOString(),
        reminderDate: deletedTask.reminderDate.toISOString(),
        updatedAt: deletedTask.updatedAt.toISOString(),
      };
    },
    method: 'DELETE',
    preHandler: fastify.auth([fastify.verifyAdmin]),
    schema: DeleteTaskSchema,
    url: '/:id',
  });

  return Promise.resolve();
};

export default tasksRoutes;
