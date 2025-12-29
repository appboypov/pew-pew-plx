import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.iflow/commands/plx-init-architecture.md',
  'update-architecture': '.iflow/commands/plx-update-architecture.md',
  'get-task': '.iflow/commands/plx-get-task.md',
  'compact': '.iflow/commands/plx-compact.md',
  'review': '.iflow/commands/plx-review.md',
  'refine-architecture': '.iflow/commands/plx-refine-architecture.md',
  'refine-review': '.iflow/commands/plx-refine-review.md',
  'parse-feedback': '.iflow/commands/plx-parse-feedback.md',
  'prepare-release': '.iflow/commands/plx-prepare-release.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
name: /plx-init-architecture
id: plx-init-architecture
category: Pew Pew Plx
description: Generate comprehensive ARCHITECTURE.md from codebase analysis.
---`,
  'update-architecture': `---
name: /plx-update-architecture
id: plx-update-architecture
category: Pew Pew Plx
description: Refresh ARCHITECTURE.md based on current codebase state.
---`,
  'get-task': `---
name: /plx-get-task
id: plx-get-task
category: Pew Pew Plx
description: Select and display the next prioritized task to work on.
---`,
  'compact': `---
name: /plx-compact
id: plx-compact
category: Pew Pew Plx
description: Preserve session progress in PROGRESS.md for context continuity.
---`,
  'review': `---
name: /plx-review
id: plx-review
category: Pew Pew Plx
description: Review implementations against specs, changes, or tasks.
---`,
  'refine-architecture': `---
name: /plx-refine-architecture
id: plx-refine-architecture
category: Pew Pew Plx
description: Create or update ARCHITECTURE.md.
---`,
  'refine-review': `---
name: /plx-refine-review
id: plx-refine-review
category: Pew Pew Plx
description: Create or update REVIEW.md.
---`,
  'parse-feedback': `---
name: /plx-parse-feedback
id: plx-parse-feedback
category: Pew Pew Plx
description: Parse feedback markers and generate review tasks.
---`,
  'prepare-release': `---
name: /plx-prepare-release
id: plx-prepare-release
category: Pew Pew Plx
description: Prepare release by updating changelog, readme, and architecture documentation.
---`
};

export class PlxIflowSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'iflow';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
