import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.claude/commands/plx/proposal.md',
  implement: '.claude/commands/plx/implement.md',
  archive: '.claude/commands/plx/archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: Pew Pew Plx: Proposal
description: Scaffold a new Pew Pew Plx change and validate strictly.
category: Pew Pew Plx
tags: [plx, change]
---`,
  implement: `---
name: Pew Pew Plx: Implement
description: Implement an approved Pew Pew Plx change and keep tasks in sync.
category: Pew Pew Plx
tags: [plx, implement]
---`,
  archive: `---
name: Pew Pew Plx: Archive
description: Archive a deployed Pew Pew Plx change and update specs.
category: Pew Pew Plx
tags: [plx, archive]
---`
};

export class ClaudeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'claude';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
