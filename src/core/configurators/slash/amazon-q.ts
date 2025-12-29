import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.amazonq/prompts/plx-proposal.md',
  implement: '.amazonq/prompts/plx-implement.md',
  archive: '.amazonq/prompts/plx-archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
description: Scaffold a new PLX change and validate strictly.
---

The user has requested the following change proposal. Use the PLX instructions to create their change proposal.

<UserRequest>
  $ARGUMENTS
</UserRequest>`,
  implement: `---
description: Implement an approved PLX change and keep tasks in sync.
---

The user wants to implement the following change. Use the PLX instructions to implement the approved change.

<ChangeId>
  $ARGUMENTS
</ChangeId>`,
  archive: `---
description: Archive a deployed PLX change and update specs.
---

The user wants to archive the following deployed change. Use the PLX instructions to archive the change and update specs.

<ChangeId>
  $ARGUMENTS
</ChangeId>`
};

export class AmazonQSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'amazon-q';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}