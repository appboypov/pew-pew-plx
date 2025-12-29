import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.augment/commands/plx-get-task.md',
  'compact': '.augment/commands/plx-compact.md',
  'review': '.augment/commands/plx-review.md',
  'refine-architecture': '.augment/commands/plx-refine-architecture.md',
  'refine-review': '.augment/commands/plx-refine-review.md',
  'refine-release': '.augment/commands/plx-refine-release.md',
  'parse-feedback': '.augment/commands/plx-parse-feedback.md',
  'prepare-release': '.augment/commands/plx-prepare-release.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'get-task': `---
description: Select and display the next prioritized task to work on.
argument-hint: (optional context)
---`,
  'compact': `---
description: Preserve session progress in PROGRESS.md for context continuity.
argument-hint: (optional context)
---`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
argument-hint: (optional context)
---`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md.
argument-hint: (optional context)
---`,
  'refine-review': `---
description: Create or update REVIEW.md.
argument-hint: (optional context)
---`,
  'refine-release': `---
description: Create or update RELEASE.md.
argument-hint: (optional context)
---`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
argument-hint: (optional context)
---`,
  'prepare-release': `---
description: Prepare release by updating changelog, readme, and architecture documentation.
argument-hint: (optional context)
---`
};

export class PlxAuggieSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'auggie';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
