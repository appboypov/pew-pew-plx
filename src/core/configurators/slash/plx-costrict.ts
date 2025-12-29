import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.cospec/plx/commands/plx-init-architecture.md',
  'update-architecture': '.cospec/plx/commands/plx-update-architecture.md',
  'get-task': '.cospec/plx/commands/plx-get-task.md',
  'compact': '.cospec/plx/commands/plx-compact.md',
  'review': '.cospec/plx/commands/plx-review.md',
  'refine-architecture': '.cospec/plx/commands/plx-refine-architecture.md',
  'refine-review': '.cospec/plx/commands/plx-refine-review.md',
  'parse-feedback': '.cospec/plx/commands/plx-parse-feedback.md',
  'prepare-release': '.cospec/plx/commands/plx-prepare-release.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
description: "Generate comprehensive ARCHITECTURE.md from codebase analysis."
argument-hint: (optional context)
---`,
  'update-architecture': `---
description: "Refresh ARCHITECTURE.md based on current codebase state."
argument-hint: (optional context)
---`,
  'get-task': `---
description: "Select and display the next prioritized task to work on."
argument-hint: (optional context)
---`,
  'compact': `---
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
