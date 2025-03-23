import packageJson from './package.json' with { type: 'json' };

import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';
import { dts } from "rollup-plugin-dts";
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { apiExtractor } from "rollup-plugin-api-extractor";

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.min.js',
      format: 'esm',
      sourcemap: false,
    },
    external: ['style-dictionary', '@necto/color'],
    plugins: [
      replace({
        preventAssignment: true,
        __PACKAGE_NAME__: () => JSON.stringify(packageJson.name),
      }),
      json(),
      terser(),
      resolve(),
      typescript(),
      apiExtractor({
        configFile: "./api-extractor.json",
      }),
    ]
  },
  {
    input: 'dist/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts(),
      del({
        verbose: true,
        targets: 'dist/tsdoc-metadata.json'
      })
    ],
  },
]
