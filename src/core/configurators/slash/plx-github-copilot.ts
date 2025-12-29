import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.github/prompts/plx-init-architecture.prompt.md',
  'update-architecture': '.github/prompts/plx-update-architecture.prompt.md',
  'get-task': '.github/prompts/plx-get-task.prompt.md',
  'compact': '.github/prompts/plx-compact.prompt.md',
  'review': '.github/prompts/plx-review.prompt.md',
  'refine-architecture': '.github/prompts/plx-refine-architecture.prompt.md',
  'refine-review': '.github/prompts/plx-refine-review.prompt.md',
  'parse-feedback': '.github/prompts/plx-parse-feedback.prompt.md',
  'prepare-release': '.github/prompts/plx-prepare-release.prompt.md'
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
  'get-task': `---
description: Select and display the next prioritized task to work on.
---

$ARGUMENTS`,
  'compact': `---
description: Preserve session progress in PROGRESS.md for context continuity.
---

$ARGUMENTS`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
---

$ARGUMENTS`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md.
---

$ARGUMENTS`,
  'refine-review': `---
description: Create or update REVIEW.md.
---

$ARGUMENTS`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
---

$ARGUMENTS`,
  'prepare-release': `---
description: Prepare release by updating changelog, readme, and architecture documentation.
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
