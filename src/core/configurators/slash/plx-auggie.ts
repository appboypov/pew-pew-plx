import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.augment/commands/plx-init-architecture.md',
  'update-architecture': '.augment/commands/plx-update-architecture.md',
  'act-next': '.augment/commands/plx-act-next.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
description: Generate comprehensive ARCHITECTURE.md from codebase analysis.
argument-hint: (optional context)
---`,
  'update-architecture': `---
description: Refresh ARCHITECTURE.md based on current codebase state.
argument-hint: (optional context)
---`,
  'act-next': `---
description: Select and display the next prioritized task to work on.
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
