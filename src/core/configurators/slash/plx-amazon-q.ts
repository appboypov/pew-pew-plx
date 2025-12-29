import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.amazonq/prompts/plx-init-architecture.md',
  'update-architecture': '.amazonq/prompts/plx-update-architecture.md',
  'get-task': '.amazonq/prompts/plx-get-task.md',
  'compact': '.amazonq/prompts/plx-compact.md',
  'review': '.amazonq/prompts/plx-review.md',
  'refine-architecture': '.amazonq/prompts/plx-refine-architecture.md',
  'refine-review': '.amazonq/prompts/plx-refine-review.md',
  'parse-feedback': '.amazonq/prompts/plx-parse-feedback.md',
  'prepare-release': '.amazonq/prompts/plx-prepare-release.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
description: Generate comprehensive ARCHITECTURE.md from codebase analysis.
---

<arguments>$ARGUMENTS</arguments>`,
  'update-architecture': `---
description: Refresh ARCHITECTURE.md based on current codebase state.
---

<arguments>$ARGUMENTS</arguments>`,
  'get-task': `---
description: Select and display the next prioritized task to work on.
---

<arguments>$ARGUMENTS</arguments>`,
  'compact': `---
description: Preserve session progress in PROGRESS.md for context continuity.
---

<arguments>$ARGUMENTS</arguments>`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
---

<arguments>$ARGUMENTS</arguments>`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md.
---

<arguments>$ARGUMENTS</arguments>`,
  'refine-review': `---
description: Create or update REVIEW.md.
---

<arguments>$ARGUMENTS</arguments>`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
---

<arguments>$ARGUMENTS</arguments>`,
  'prepare-release': `---
description: Prepare release by updating changelog, readme, and architecture documentation.
---

<arguments>$ARGUMENTS</arguments>`
};

export class PlxAmazonQSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'amazon-q';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
