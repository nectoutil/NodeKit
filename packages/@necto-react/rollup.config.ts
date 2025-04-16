import swc from "@rollup/plugin-swc";
import { defineConfig } from "rollup";
import terser from '@rollup/plugin-terser';
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        exports: 'named',
        sourcemap: true,
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [
      swc(),
      terser(),
      resolve(),
      external(),
      commonjs()
    ],
  },
]);
