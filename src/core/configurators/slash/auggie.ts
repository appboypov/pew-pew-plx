import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.augment/commands/plx-archive.md',
  'complete-task': '.augment/commands/plx-complete-task.md',
  'copy-next-task': '.augment/commands/plx-copy-next-task.md',
  'copy-review-request': '.augment/commands/plx-copy-review-request.md',
  'copy-test-request': '.augment/commands/plx-copy-test-request.md',
  'get-task': '.augment/commands/plx-get-task.md',
  'implement': '.augment/commands/plx-implement.md',
  'orchestrate': '.augment/commands/plx-orchestrate.md',
  'parse-feedback': '.augment/commands/plx-parse-feedback.md',
  'plan-implementation': '.augment/commands/plx-plan-implementation.md',
  'plan-proposal': '.augment/commands/plx-plan-proposal.md',
  'plan-request': '.augment/commands/plx-plan-request.md',
  'prepare-compact': '.augment/commands/plx-prepare-compact.md',
  'prepare-release': '.augment/commands/plx-prepare-release.md',
  'refine-architecture': '.augment/commands/plx-refine-architecture.md',
  'refine-release': '.augment/commands/plx-refine-release.md',
  'refine-review': '.augment/commands/plx-refine-review.md',
  'refine-testing': '.augment/commands/plx-refine-testing.md',
  'review': '.augment/commands/plx-review.md',
  'sync-workspace': '.augment/commands/plx-sync-workspace.md',
  'test': '.augment/commands/plx-test.md',
  'undo-task': '.augment/commands/plx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
description: Archive a deployed change and update specs.
argument-hint: change-id
---`,
  'complete-task': `---
description: Mark a task as done.
argument-hint: task-id
---`,
  'copy-next-task': `---
description: Copy next task or feedback block to clipboard for external agent handoff.
argument-hint: (optional context)
---`,
  'copy-review-request': `---
description: Copy review request block with REVIEW.md guidelines to clipboard for external agent.
argument-hint: (optional context)
---`,
  'copy-test-request': `---
description: Copy test request block with TESTING.md configuration to clipboard for external agent.
argument-hint: (optional context)
---`,
  'get-task': `---
description: Select and display the next prioritized task to work on.
argument-hint: (optional context)
---`,
  'implement': `---
description: Implement an approved change and keep tasks in sync.
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
  'plan-implementation': `---
description: Generate PROGRESS.md and orchestrate multi-agent task handoff.
argument-hint: (optional context)
---`,
  'plan-proposal': `---
description: Scaffold a new change and validate strictly. Consumes request.md when present.
argument-hint: feature description or request
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
description: Create or update ARCHITECTURE.md with spec-ready component inventories.
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
  'refine-testing': `---
description: Create or update TESTING.md.
argument-hint: (optional context)
---`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
argument-hint: (optional context)
---`,
  'sync-workspace': `---
description: Scan workspace state and suggest maintenance actions.
argument-hint: --id <id> --parent-type change|task
---`,
  'test': `---
description: Run tests based on scope (change, task, or spec) using TESTING.md configuration.
argument-hint: --id <id> --parent-type change|task|spec
---`,
  'undo-task': `---
description: Revert a task to to-do.
argument-hint: task-id
---`
};

export class AuggieSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'auggie';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
