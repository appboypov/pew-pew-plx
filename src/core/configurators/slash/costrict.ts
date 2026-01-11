import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.cospec/plx/commands/plx-archive.md',
  'complete-task': '.cospec/plx/commands/plx-complete-task.md',
  'copy-next-task': '.cospec/plx/commands/plx-copy-next-task.md',
  'copy-review-request': '.cospec/plx/commands/plx-copy-review-request.md',
  'copy-test-request': '.cospec/plx/commands/plx-copy-test-request.md',
  'get-task': '.cospec/plx/commands/plx-get-task.md',
  'implement': '.cospec/plx/commands/plx-implement.md',
  'orchestrate': '.cospec/plx/commands/plx-orchestrate.md',
  'parse-feedback': '.cospec/plx/commands/plx-parse-feedback.md',
  'plan-implementation': '.cospec/plx/commands/plx-plan-implementation.md',
  'plan-proposal': '.cospec/plx/commands/plx-plan-proposal.md',
  'plan-request': '.cospec/plx/commands/plx-plan-request.md',
  'prepare-compact': '.cospec/plx/commands/plx-prepare-compact.md',
  'prepare-release': '.cospec/plx/commands/plx-prepare-release.md',
  'refine-architecture': '.cospec/plx/commands/plx-refine-architecture.md',
  'refine-release': '.cospec/plx/commands/plx-refine-release.md',
  'refine-review': '.cospec/plx/commands/plx-refine-review.md',
  'refine-testing': '.cospec/plx/commands/plx-refine-testing.md',
  'review': '.cospec/plx/commands/plx-review.md',
  'sync-workspace': '.cospec/plx/commands/plx-sync-workspace.md',
  'test': '.cospec/plx/commands/plx-test.md',
  'undo-task': '.cospec/plx/commands/plx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
description: "Archive a deployed PLX change and update specs."
argument-hint: change-id
---`,
  'complete-task': `---
description: "Mark a task as done."
argument-hint: task-id
---`,
  'copy-next-task': `---
description: "Copy next task or feedback block to clipboard for external agent handoff."
argument-hint: (optional context)
---`,
  'copy-review-request': `---
description: "Copy review request block with REVIEW.md guidelines to clipboard for external agent."
argument-hint: (optional context)
---`,
  'copy-test-request': `---
description: "Copy test request block with TESTING.md configuration to clipboard for external agent."
argument-hint: (optional context)
---`,
  'get-task': `---
description: "Select and display the next prioritized task to work on."
argument-hint: (optional context)
---`,
  'implement': `---
description: "Implement an approved PLX change and keep tasks in sync."
argument-hint: change-id
---`,
  'orchestrate': `---
description: "Orchestrate sub-agents to complete work collaboratively."
argument-hint: (optional context)
---`,
  'parse-feedback': `---
description: "Parse feedback markers and generate review tasks."
argument-hint: (optional context)
---`,
  'plan-implementation': `---
description: "Generate PROGRESS.md and orchestrate multi-agent task handoff."
argument-hint: (optional context)
---`,
  'plan-proposal': `---
description: "Scaffold a new PLX change and validate strictly. Consumes request.md when present."
argument-hint: feature description or request
---`,
  'plan-request': `---
description: "Clarify user intent through iterative yes/no questions before proposal creation."
argument-hint: (optional context)
---`,
  'prepare-compact': `---
description: "Preserve session progress in PROGRESS.md for context continuity."
argument-hint: (optional context)
---`,
  'prepare-release': `---
description: "Prepare release by updating changelog, readme, and architecture documentation."
argument-hint: (optional context)
---`,
  'refine-architecture': `---
description: "Create or update ARCHITECTURE.md."
argument-hint: (optional context)
---`,
  'refine-release': `---
description: "Create or update RELEASE.md."
argument-hint: (optional context)
---`,
  'refine-review': `---
description: "Create or update REVIEW.md."
argument-hint: (optional context)
---`,
  'refine-testing': `---
description: "Create or update TESTING.md."
argument-hint: (optional context)
---`,
  'review': `---
description: "Review implementations against specs, changes, or tasks."
argument-hint: (optional context)
---`,
  'sync-workspace': `---
description: "Scan workspace state and suggest maintenance actions."
argument-hint: --id <id> --parent-type change|task
---`,
  'test': `---
description: "Run tests based on scope (change, task, or spec) using TESTING.md configuration."
argument-hint: --id <id> --parent-type change|task|spec
---`,
  'undo-task': `---
description: "Revert a task to to-do."
argument-hint: task-id
---`
};

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
