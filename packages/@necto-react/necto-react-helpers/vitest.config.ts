import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      '__tests__/**/*.test.{ts,js,tsx,jsx}',
      'src/**/*.test.{ts,js,tsx,jsx}'
    ],
    environment: 'jsdom',
    exclude: ['node_modules', 'dist', '.turbo']
  },
  resolve: {
    alias: {
      '@necto-react-helpers': path.resolve(__dirname, 'src'),
    }
  }
});
