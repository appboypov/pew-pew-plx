import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.github/prompts/plx-proposal.prompt.md',
  implement: '.github/prompts/plx-implement.prompt.md',
  archive: '.github/prompts/plx-archive.prompt.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
description: Scaffold a new PLX change and validate strictly.
---

$ARGUMENTS`,
  implement: `---
description: Implement an approved PLX change and keep tasks in sync.
---

$ARGUMENTS`,
  archive: `---
description: Archive a deployed PLX change and update specs.
---

$ARGUMENTS`
};

export class GitHubCopilotSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'github-copilot';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
