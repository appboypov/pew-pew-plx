import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.cursor/commands/plx-init-architecture.md',
  'update-architecture': '.cursor/commands/plx-update-architecture.md',
  'get-task': '.cursor/commands/plx-get-task.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
name: /plx-init-architecture
id: plx-init-architecture
category: PLX
description: Generate comprehensive ARCHITECTURE.md from codebase analysis.
---`,
  'update-architecture': `---
name: /plx-update-architecture
id: plx-update-architecture
category: PLX
description: Refresh ARCHITECTURE.md based on current codebase state.
---`,
  'get-task': `---
name: /plx-get-task
id: plx-get-task
category: PLX
description: Select and display the next prioritized task to work on.
---`
};

export class PlxCursorSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'cursor';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
