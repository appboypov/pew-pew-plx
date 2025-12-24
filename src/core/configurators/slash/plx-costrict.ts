import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.cospec/plx/commands/plx-init-architecture.md',
  'update-architecture': '.cospec/plx/commands/plx-update-architecture.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
description: "Generate comprehensive ARCHITECTURE.md from codebase analysis."
argument-hint: (optional context)
---`,
  'update-architecture': `---
description: "Refresh ARCHITECTURE.md based on current codebase state."
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
