import fg from 'fast-glob';
import { readFileSync, writeFileSync } from 'node:fs';

const files = fg.sync('packages/**/package.json', {
  ignore: [
    '**/dist/**',
    '**/node_modules/**'
  ]
});

for (const file of files) {
  const pkg = JSON.parse(readFileSync(file, 'utf8'));

  if (!pkg.private) {
    const cleanPkgJson = Object.fromEntries(Object.entries(pkg).filter(([k]) => ![
      'scripts',
      'devDependencies',
      'funding',
      'browserslist',
      'eslintConfig',
      'prettier',
      'jest',
      'vitest',
      'lint-staged',
      'husky'
    ].includes(k)));

    writeFileSync(file, JSON.stringify(cleanPkgJson, null, 2) + '\n');
  }
}