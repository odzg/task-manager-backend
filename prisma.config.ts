import { loadEnvFile } from 'node:process';

import { defineConfig } from 'prisma/config';

try {
  loadEnvFile('.env.local');
} catch {
  /* ignore error */
}

export default defineConfig({ earlyAccess: true });
