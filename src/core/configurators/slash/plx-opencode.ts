import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.opencode/command/plx-init-architecture.md',
  'update-architecture': '.opencode/command/plx-update-architecture.md',
  'get-task': '.opencode/command/plx-get-task.md',
  'compact': '.opencode/command/plx-compact.md',
  'review': '.opencode/command/plx-review.md',
  'refine-architecture': '.opencode/command/plx-refine-architecture.md',
  'refine-review': '.opencode/command/plx-refine-review.md',
  'parse-feedback': '.opencode/command/plx-parse-feedback.md',
  'prepare-release': '.opencode/command/plx-prepare-release.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
description: Generate comprehensive ARCHITECTURE.md from codebase analysis.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'update-architecture': `---
description: Refresh ARCHITECTURE.md based on current codebase state.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'get-task': `---
description: Select and display the next prioritized task to work on.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'compact': `---
description: Preserve session progress in PROGRESS.md for context continuity.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-review': `---
description: Create or update REVIEW.md.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'prepare-release': `---
description: Prepare release by updating changelog, readme, and architecture documentation.
argument-hint: (optional context)
---

$ARGUMENTS`
};

export class PlxOpenCodeSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'opencode';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
