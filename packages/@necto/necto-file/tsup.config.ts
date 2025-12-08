import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.cjs' };
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  clean: true
});
