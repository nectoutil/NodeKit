import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  minify: true,
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    /^react-aria/,
    /^@react-aria/,
    /^@react-stately/,
    /^@internationalized/,
  ],
});
