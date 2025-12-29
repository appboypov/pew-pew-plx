import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.cursor/commands/plx-proposal.md',
  apply: '.cursor/commands/plx-apply.md',
  archive: '.cursor/commands/plx-archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: /plx-proposal
id: plx-proposal
category: PLX
description: Scaffold a new PLX change and validate strictly.
---`,
  apply: `---
name: /plx-apply
id: plx-apply
category: PLX
description: Implement an approved PLX change and keep tasks in sync.
---`,
  archive: `---
name: /plx-archive
id: plx-archive
category: PLX
description: Archive a deployed PLX change and update specs.
---`
};

export class CursorSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'cursor';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
