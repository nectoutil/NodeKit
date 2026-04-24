/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import dedent from 'dedent';
import lint from '@commitlint/lint';
import load from '@commitlint/load';
import { danger, fail, warn, message, schedule } from 'danger';

schedule(async () => {
  const { rules, parserPreset } = await load({
    extends: ['@commitlint/config-conventional'],
  });

  const report = await lint(
    danger.github.pr.title,
    rules,
    parserPreset ? { parserOpts: parserPreset.parserOpts } : {},
  );

  if (!report.valid) {
    const errors = report.errors.map(e => `- ${e.message}`).join('\n');
    fail(dedent`
      **PR title doesn't follow conventional commits.**

      ${errors}

      Since NodeKit squash-merges, the PR title becomes the commit message.
      Examples:
      - \`feat(hooks): add usePress\`
      - \`fix(popper): correct arrow offset on flip\`
      - \`chore(deps): bump vitest\`
    `);
  }

  report.warnings.forEach(w => warn(`PR title: ${w.message}`));
});

const isFirstTimer = ['FIRST_TIME_CONTRIBUTOR', 'FIRST_TIMER', 'NONE'].includes(
  danger.github.pr.author_association,
);

if (isFirstTimer) {
  message(dedent`
    👋 **Thanks for your first contribution to NodeKit, @${danger.github.pr.user.login}!**

    Quick checklist so reviewers can merge faster:
    - [ ] Tests live in \`__tests__/\`, not \`src/\`
    - [ ] Ran \`pnpm changeset\` if this changes behavior
    - [ ] Linked the related issue with \`Fixes #123\`
    - [ ] \`pnpm test\` passed via manual or pre-commit run

    One of our maintainers will take a look soon. If you get stuck, ping us in the PR — we're happy to help!

    ---

    <sub>**Note:** You must have a Corinvo account in order to commit to this repo. If you don't have one, a bot will ping you and you'll need to create one ASAP. It's required to sign our CLA and commit. If you don't, this PR will be closed automatically after 3 days.</sub>
  `);
}