import { defineConfig } from 'vitest/config';
import path from 'node:path';
import fs from 'node:fs';

function getWorkspaceAliases() {
  const root = path.resolve(__dirname, '../../..');
  const aliases: Record<string, string> = {};

  for (const scope of ['@necto', '@necto-react']) {
    const scopeDir = path.join(root, 'packages', scope);
    if (!fs.existsSync(scopeDir)) continue;

    for (const pkg of fs.readdirSync(scopeDir)) {
      const srcIndex = path.join(scopeDir, pkg, 'src', 'index.ts');
      if (!fs.existsSync(srcIndex)) continue;

      const pkgJsonPath = path.join(scopeDir, pkg, 'package.json');
      if (!fs.existsSync(pkgJsonPath)) continue;

      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      aliases[pkgJson.name] = srcIndex;
    }
  }

  return aliases;
}

export default defineConfig({
  test: {
    environment: 'jsdom'
  },
  resolve: {
    alias: getWorkspaceAliases()
  }
});
