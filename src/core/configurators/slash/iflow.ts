import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.iflow/commands/plx-proposal.md',
  apply: '.iflow/commands/plx-apply.md',
  archive: '.iflow/commands/plx-archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: /plx-proposal
id: plx-proposal
category: Pew Pew Plx
description: Scaffold a new Pew Pew Plx change and validate strictly.
---`,
  apply: `---
name: /plx-apply
id: plx-apply
category: Pew Pew Plx
description: Implement an approved Pew Pew Plx change and keep tasks in sync.
---`,
  archive: `---
name: /plx-archive
id: plx-archive
category: Pew Pew Plx
description: Archive a deployed Pew Pew Plx change and update specs.
---`
};

export class IflowSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'iflow';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
