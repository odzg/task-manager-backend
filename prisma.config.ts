import { loadEnvFile } from 'node:process';

import { defineConfig } from 'prisma/config';

loadEnvFile('.env.local');

export default defineConfig({ earlyAccess: true });
