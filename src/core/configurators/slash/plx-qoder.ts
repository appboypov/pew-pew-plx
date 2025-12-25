import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.qoder/commands/plx/init-architecture.md',
  'update-architecture': '.qoder/commands/plx/update-architecture.md',
  'act-next': '.qoder/commands/plx/act-next.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
name: PLX: Init Architecture
description: Generate comprehensive ARCHITECTURE.md from codebase analysis.
category: PLX
tags: [plx, architecture, documentation]
---`,
  'update-architecture': `---
name: PLX: Update Architecture
description: Refresh ARCHITECTURE.md based on current codebase state.
category: PLX
tags: [plx, architecture, documentation]
---`,
  'act-next': `---
name: PLX: Act Next
description: Select and display the next prioritized task to work on.
category: PLX
tags: [plx, task, workflow]
---`
};

export class PlxQoderSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'qoder';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
