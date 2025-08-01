import { loadEnvFile } from 'node:process';
import { defineConfig } from 'prisma/config';

try {
  loadEnvFile('.env.local');
} catch {
  // If any error occurs while loading the environment file, simply ignore it.
}

export default defineConfig({
  migrations: {
    seed: 'node ./prisma/seed.ts',
  },
});
