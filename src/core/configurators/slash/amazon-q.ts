import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.amazonq/prompts/plx-archive.md',
  'complete-task': '.amazonq/prompts/plx-complete-task.md',
  'get-task': '.amazonq/prompts/plx-get-task.md',
  'implement': '.amazonq/prompts/plx-implement.md',
  'orchestrate': '.amazonq/prompts/plx-orchestrate.md',
  'parse-feedback': '.amazonq/prompts/plx-parse-feedback.md',
  'plan-proposal': '.amazonq/prompts/plx-plan-proposal.md',
  'plan-request': '.amazonq/prompts/plx-plan-request.md',
  'prepare-compact': '.amazonq/prompts/plx-prepare-compact.md',
  'prepare-release': '.amazonq/prompts/plx-prepare-release.md',
  'refine-architecture': '.amazonq/prompts/plx-refine-architecture.md',
  'refine-release': '.amazonq/prompts/plx-refine-release.md',
  'refine-review': '.amazonq/prompts/plx-refine-review.md',
  'refine-testing': '.amazonq/prompts/plx-refine-testing.md',
  'review': '.amazonq/prompts/plx-review.md',
  'sync-workspace': '.amazonq/prompts/plx-sync-workspace.md',
  'test': '.amazonq/prompts/plx-test.md',
  'undo-task': '.amazonq/prompts/plx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
description: Archive a deployed PLX change and update specs.
---

The user wants to archive the following deployed change. Use the PLX instructions to archive the change and update specs.

<ChangeId>
  $ARGUMENTS
</ChangeId>`,
  'complete-task': `---
description: Mark a task as done.
---

<arguments>$ARGUMENTS</arguments>`,
  'get-task': `---
description: Select and display the next prioritized task to work on.
---

<arguments>$ARGUMENTS</arguments>`,
  'implement': `---
description: Implement an approved PLX change and keep tasks in sync.
---

The user wants to implement the following change. Use the PLX instructions to implement the approved change.

<ChangeId>
  $ARGUMENTS
</ChangeId>`,
  'orchestrate': `---
description: Orchestrate sub-agents to complete work collaboratively.
---

<arguments>$ARGUMENTS</arguments>`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
---

<arguments>$ARGUMENTS</arguments>`,
  'plan-proposal': `---
description: Scaffold a new PLX change and validate strictly. Consumes request.md when present.
---

The user has requested the following change proposal. Use the PLX instructions to create their change proposal.

<UserRequest>
  $ARGUMENTS
</UserRequest>`,
  'plan-request': `---
description: Clarify user intent through iterative yes/no questions before proposal creation.
---

<arguments>$ARGUMENTS</arguments>`,
  'prepare-compact': `---
description: Preserve session progress in PROGRESS.md for context continuity.
---

<arguments>$ARGUMENTS</arguments>`,
  'prepare-release': `---
description: Prepare release by updating changelog, readme, and architecture documentation.
---

<arguments>$ARGUMENTS</arguments>`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md with spec-ready component inventories.
---

<arguments>$ARGUMENTS</arguments>`,
  'refine-release': `---
description: Create or update RELEASE.md.
---

<arguments>$ARGUMENTS</arguments>`,
  'refine-review': `---
description: Create or update REVIEW.md.
---

<arguments>$ARGUMENTS</arguments>`,
  'refine-testing': `---
description: Create or update TESTING.md.
---

<arguments>$ARGUMENTS</arguments>`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
---

<arguments>$ARGUMENTS</arguments>`,
  'sync-workspace': `---
description: Scan workspace state and suggest maintenance actions.
---

<arguments>$ARGUMENTS</arguments>`,
  'test': `---
description: Run tests based on scope (change, task, or spec) using TESTING.md configuration.
---

<arguments>$ARGUMENTS</arguments>`,
  'undo-task': `---
description: Revert a task to to-do.
---

<arguments>$ARGUMENTS</arguments>`
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
