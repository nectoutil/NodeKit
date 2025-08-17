import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['__tests__/**/*.test.{ts,js,tsx,jsx}'],
    environment: 'jsdom',
    exclude: ['node_modules', 'dist', '.turbo']
  },
  resolve: {
    alias: [
      {
        find: /^@necto-react\/hooks\/(.*)$/,
        replacement: path.resolve(__dirname, 'src/$1')
      },
      {
        find: '@necto-react/hooks',
        replacement: path.resolve(__dirname, 'src/index.ts')
      }
    ]
  }
});
