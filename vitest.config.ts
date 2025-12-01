import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.vitest.spec.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul', // required
      reporter: ['text', 'lcov'], // tipos de reportes
      include: ['src/**/*.{ts,tsx}'], // los archivos a cubrir
      exclude: ['node_modules', 'tests'], // carpetas a ignorar
    },
    globals: true,
  },
});
