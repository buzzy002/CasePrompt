import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // The e2e tests start the whole app: it reads DATABASE_URL from .env.
    setupFiles: ['dotenv/config'],
  },
});
