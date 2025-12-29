import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.codebuddy/commands/plx/proposal.md',
  apply: '.codebuddy/commands/plx/apply.md',
  archive: '.codebuddy/commands/plx/archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: PLX: Proposal
description: Scaffold a new PLX change and validate strictly.
category: PLX
tags: [plx, change]
---`,
  apply: `---
name: PLX: Apply
description: Implement an approved PLX change and keep tasks in sync.
category: PLX
tags: [plx, apply]
---`,
  archive: `---
name: PLX: Archive
description: Archive a deployed PLX change and update specs.
category: PLX
tags: [plx, archive]
---`
};

export class CodeBuddySlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'codebuddy';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}

