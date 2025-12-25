import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.amazonq/prompts/plx-init-architecture.md',
  'update-architecture': '.amazonq/prompts/plx-update-architecture.md',
  'act-next': '.amazonq/prompts/plx-act-next.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
description: Generate comprehensive ARCHITECTURE.md from codebase analysis.
---

<arguments>$ARGUMENTS</arguments>`,
  'update-architecture': `---
description: Refresh ARCHITECTURE.md based on current codebase state.
---

<arguments>$ARGUMENTS</arguments>`,
  'act-next': `---
description: Select and display the next prioritized task to work on.
---

<arguments>$ARGUMENTS</arguments>`
};

export class PlxAmazonQSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'amazon-q';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
