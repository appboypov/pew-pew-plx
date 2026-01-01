import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.factory/commands/plx-archive.md',
  'complete-task': '.factory/commands/plx-complete-task.md',
  'get-task': '.factory/commands/plx-get-task.md',
  'implement': '.factory/commands/plx-implement.md',
  'orchestrate': '.factory/commands/plx-orchestrate.md',
  'parse-feedback': '.factory/commands/plx-parse-feedback.md',
  'plan-proposal': '.factory/commands/plx-plan-proposal.md',
  'plan-request': '.factory/commands/plx-plan-request.md',
  'prepare-compact': '.factory/commands/plx-prepare-compact.md',
  'prepare-release': '.factory/commands/plx-prepare-release.md',
  'refine-architecture': '.factory/commands/plx-refine-architecture.md',
  'refine-release': '.factory/commands/plx-refine-release.md',
  'refine-review': '.factory/commands/plx-refine-review.md',
  'review': '.factory/commands/plx-review.md',
  'sync-workspace': '.factory/commands/plx-sync-workspace.md',
  'undo-task': '.factory/commands/plx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
description: Archive a deployed PLX change and update specs.
argument-hint: change-id
---`,
  'complete-task': `---
description: Mark a task as done.
argument-hint: task-id
---`,
  'get-task': `---
description: Select and display the next prioritized task to work on.
argument-hint: (optional context)
---`,
  'implement': `---
description: Implement an approved PLX change and keep tasks in sync.
argument-hint: change-id
---`,
  'orchestrate': `---
description: Orchestrate sub-agents to complete work collaboratively.
argument-hint: (optional context)
---`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
argument-hint: (optional context)
---`,
  'plan-proposal': `---
description: Scaffold a new PLX change and validate strictly. Consumes request.md when present.
argument-hint: request or feature description
---`,
  'plan-request': `---
description: Clarify user intent through iterative yes/no questions before proposal creation.
argument-hint: (optional context)
---`,
  'prepare-compact': `---
description: Preserve session progress in PROGRESS.md for context continuity.
argument-hint: (optional context)
---`,
  'prepare-release': `---
description: Prepare release by updating changelog, readme, and architecture documentation.
argument-hint: (optional context)
---`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md.
argument-hint: (optional context)
---`,
  'refine-release': `---
description: Create or update RELEASE.md.
argument-hint: (optional context)
---`,
  'refine-review': `---
description: Create or update REVIEW.md.
argument-hint: (optional context)
---`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
argument-hint: (optional context)
---`,
  'sync-workspace': `---
description: Scan workspace state and suggest maintenance actions.
argument-hint: (optional change-id or task-id)
---`,
  'undo-task': `---
description: Revert a task to to-do.
argument-hint: task-id
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
