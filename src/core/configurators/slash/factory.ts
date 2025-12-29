import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.factory/commands/plx-proposal.md',
  implement: '.factory/commands/plx-implement.md',
  archive: '.factory/commands/plx-archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
description: Scaffold a new PLX change and validate strictly.
argument-hint: request or feature description
---`,
  implement: `---
description: Implement an approved PLX change and keep tasks in sync.
argument-hint: change-id
---`,
  archive: `---
description: Archive a deployed PLX change and update specs.
argument-hint: change-id
---`
};

export class FactorySlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'factory';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }

  protected getBody(id: SlashCommandId): string {
    const baseBody = super.getBody(id);
    return `${baseBody}\n\n$ARGUMENTS`;
  }
}
