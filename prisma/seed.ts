import { PrismaClient, Role } from '@prisma/client';

import { hashPassword } from '#utils/password.ts';

const prisma = new PrismaClient();

try {
  await prisma.user.upsert({
    create: {
      password: await hashPassword('admin'),
      role: Role.ADMIN,
      username: 'admin',
    },
    update: {},
    where: { username: 'admin' },
  });

  for (const user of ['user1', 'user2', 'user3', 'user4']) {
    await prisma.user.upsert({
      create: {
        password: await hashPassword(user),
        role: Role.USER,
        username: user,
      },
      update: {},
      where: { username: user },
    });
  }

  await prisma.$disconnect();
} catch (error) {
  await prisma.$disconnect();
  throw new Error('Error while seeding', {
    cause: error,
  });
}
