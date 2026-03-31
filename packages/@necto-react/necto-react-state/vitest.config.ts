import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['__tests__/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    environment: 'jsdom'
  }
});
