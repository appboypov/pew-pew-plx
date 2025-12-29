import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS = {
  proposal: '.cospec/plx/commands/plx-proposal.md',
  implement: '.cospec/plx/commands/plx-implement.md',
  archive: '.cospec/plx/commands/plx-archive.md',
} as const satisfies Record<SlashCommandId, string>;

const FRONTMATTER = {
  proposal: `---
description: "Scaffold a new PLX change and validate strictly."
argument-hint: feature description or request
---`,
  implement: `---
description: "Implement an approved PLX change and keep tasks in sync."
argument-hint: change-id
---`,
  archive: `---
description: "Archive a deployed PLX change and update specs."
argument-hint: change-id
---`
} as const satisfies Record<SlashCommandId, string>;

export class CostrictSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'costrict';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    return FRONTMATTER[id];
  }
}