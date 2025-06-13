import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'src/**/*.test.{ts,js,tsx,jsx}'
    ],
    environment: 'jsdom',
    exclude: ['node_modules', 'dist', '.turbo']
  },
  resolve: {
    alias: {
      '@necto-react-hooks': path.resolve(__dirname, 'src')
    }
  }
});
