import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.cospec/plx/commands/plx-get-task.md',
  'prepare-compact': '.cospec/plx/commands/plx-prepare-compact.md',
  'review': '.cospec/plx/commands/plx-review.md',
  'refine-architecture': '.cospec/plx/commands/plx-refine-architecture.md',
  'refine-review': '.cospec/plx/commands/plx-refine-review.md',
  'refine-release': '.cospec/plx/commands/plx-refine-release.md',
  'parse-feedback': '.cospec/plx/commands/plx-parse-feedback.md',
  'prepare-release': '.cospec/plx/commands/plx-prepare-release.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'get-task': `---
description: "Select and display the next prioritized task to work on."
argument-hint: (optional context)
---`,
  'prepare-compact': `---
description: "Preserve session progress in PROGRESS.md for context continuity."
argument-hint: (optional context)
---`,
  'review': `---
description: "Review implementations against specs, changes, or tasks."
argument-hint: (optional context)
---`,
  'refine-architecture': `---
description: "Create or update ARCHITECTURE.md."
argument-hint: (optional context)
---`,
  'refine-review': `---
description: "Create or update REVIEW.md."
argument-hint: (optional context)
---`,
  'refine-release': `---
description: "Create or update RELEASE.md."
argument-hint: (optional context)
---`,
  'parse-feedback': `---
description: "Parse feedback markers and generate review tasks."
argument-hint: (optional context)
---`,
  'prepare-release': `---
description: "Prepare release by updating changelog, readme, and architecture documentation."
argument-hint: (optional context)
---`
};

export class PlxCostrictSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'costrict';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
