import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.factory/commands/plx-init-architecture.md',
  'update-architecture': '.factory/commands/plx-update-architecture.md',
  'get-task': '.factory/commands/plx-get-task.md'
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

$ARGUMENTS`
};

export class PlxFactorySlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'factory';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
