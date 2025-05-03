import swc from "@rollup/plugin-swc";
import { defineConfig } from "rollup";
import { dts } from "rollup-plugin-dts";
import terser from '@rollup/plugin-terser';
import banner2 from 'rollup-plugin-banner2';
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";

const COPYRIGHT_BLOCK = `Copyright (c) Corinvo, LLC. and affiliates. \n\nThis source code is licensed under the MIT license found in the \nLICENSE file in the root directory of this source tree.\n`

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
      external(),
      resolve({
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
      }),
      commonjs(),
      swc(),
      terser(),
      banner2(
        () => COPYRIGHT_BLOCK,
        {
          formatter: 'docBlockAndGap'
        }
      ),
    ],
  },
  {
    input: './src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [
      dts({
        compilerOptions: {
          stripInternal: true,
          removeComments: true,
        }
      }),
      banner2(
        () => COPYRIGHT_BLOCK,
        {
          formatter: 'docBlockAndGap'
        }
      ),
    ],
  },
]);
