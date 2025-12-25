import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.github/prompts/plx-init-architecture.prompt.md',
  'update-architecture': '.github/prompts/plx-update-architecture.prompt.md',
  'act-next': '.github/prompts/plx-act-next.prompt.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
description: Generate comprehensive ARCHITECTURE.md from codebase analysis.
---

$ARGUMENTS`,
  'update-architecture': `---
description: Refresh ARCHITECTURE.md based on current codebase state.
---

$ARGUMENTS`,
  'act-next': `---
description: Select and display the next prioritized task to work on.
---

$ARGUMENTS`
};

export class PlxGitHubCopilotSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'github-copilot';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
