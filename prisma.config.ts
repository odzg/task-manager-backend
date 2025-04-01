import { config } from '@dotenvx/dotenvx';
import { defineConfig } from 'prisma/config';

config({
  path: '.env.local',
  quiet: true,
});

export default defineConfig({ earlyAccess: true });
