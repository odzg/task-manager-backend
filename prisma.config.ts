import { loadEnvFile } from 'node:process';
import { defineConfig } from 'prisma/config';

try {
  loadEnvFile('.env.local');
} catch (error) {
  const isFileNotFoundError =
    error instanceof Error && 'code' in error && error.code === 'ENOENT';

  if (!isFileNotFoundError) {
    throw error;
  }
}

export default defineConfig({
  migrations: {
    seed: 'node ./prisma/seed.ts',
  },
  schema: './prisma/schema.prisma',
});
