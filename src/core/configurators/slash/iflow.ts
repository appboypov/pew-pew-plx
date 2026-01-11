import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.iflow/commands/plx-archive.md',
  'complete-task': '.iflow/commands/plx-complete-task.md',
  'copy-next-task': '.iflow/commands/plx-copy-next-task.md',
  'copy-review-request': '.iflow/commands/plx-copy-review-request.md',
  'copy-test-request': '.iflow/commands/plx-copy-test-request.md',
  'get-task': '.iflow/commands/plx-get-task.md',
  'implement': '.iflow/commands/plx-implement.md',
  'orchestrate': '.iflow/commands/plx-orchestrate.md',
  'parse-feedback': '.iflow/commands/plx-parse-feedback.md',
  'plan-implementation': '.iflow/commands/plx-plan-implementation.md',
  'plan-proposal': '.iflow/commands/plx-plan-proposal.md',
  'plan-request': '.iflow/commands/plx-plan-request.md',
  'prepare-compact': '.iflow/commands/plx-prepare-compact.md',
  'prepare-release': '.iflow/commands/plx-prepare-release.md',
  'refine-architecture': '.iflow/commands/plx-refine-architecture.md',
  'refine-release': '.iflow/commands/plx-refine-release.md',
  'refine-review': '.iflow/commands/plx-refine-review.md',
  'refine-testing': '.iflow/commands/plx-refine-testing.md',
  'review': '.iflow/commands/plx-review.md',
  'sync-workspace': '.iflow/commands/plx-sync-workspace.md',
  'test': '.iflow/commands/plx-test.md',
  'undo-task': '.iflow/commands/plx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
name: /plx-archive
id: plx-archive
category: Pew Pew Plx
description: Archive a deployed change and update specs.
---`,
  'complete-task': `---
name: /plx-complete-task
id: plx-complete-task
category: Pew Pew Plx
description: Mark a task as done.
---`,
  'copy-next-task': `---
name: /plx-copy-next-task
id: plx-copy-next-task
category: Pew Pew Plx
description: Copy next task or feedback block to clipboard for external agent handoff.
---`,
  'copy-review-request': `---
name: /plx-copy-review-request
id: plx-copy-review-request
category: Pew Pew Plx
description: Copy review request block with REVIEW.md guidelines to clipboard for external agent.
---`,
  'copy-test-request': `---
name: /plx-copy-test-request
id: plx-copy-test-request
category: Pew Pew Plx
description: Copy test request block with TESTING.md configuration to clipboard for external agent.
---`,
  'get-task': `---
name: /plx-get-task
id: plx-get-task
category: Pew Pew Plx
description: Select and display the next prioritized task to work on.
---`,
  'implement': `---
name: /plx-implement
id: plx-implement
category: Pew Pew Plx
description: Implement an approved change and keep tasks in sync.
---`,
  'orchestrate': `---
name: /plx-orchestrate
id: plx-orchestrate
category: Pew Pew Plx
description: Orchestrate sub-agents to complete work collaboratively.
---`,
  'parse-feedback': `---
name: /plx-parse-feedback
id: plx-parse-feedback
category: Pew Pew Plx
description: Parse feedback markers and generate review tasks.
---`,
  'plan-implementation': `---
name: /plx-plan-implementation
id: plx-plan-implementation
category: Pew Pew Plx
description: Generate PROGRESS.md and orchestrate multi-agent task handoff.
---`,
  'plan-proposal': `---
name: /plx-plan-proposal
id: plx-plan-proposal
category: Pew Pew Plx
description: Scaffold a new change and validate strictly. Consumes request.md when present.
---`,
  'plan-request': `---
name: /plx-plan-request
id: plx-plan-request
category: Pew Pew Plx
description: Clarify user intent through iterative yes/no questions before proposal creation.
---`,
  'prepare-compact': `---
name: /plx-prepare-compact
id: plx-prepare-compact
category: Pew Pew Plx
description: Preserve session progress in PROGRESS.md for context continuity.
---`,
  'prepare-release': `---
name: /plx-prepare-release
id: plx-prepare-release
category: Pew Pew Plx
description: Prepare release by updating changelog, readme, and architecture documentation.
---`,
  'refine-architecture': `---
name: /plx-refine-architecture
id: plx-refine-architecture
category: Pew Pew Plx
description: Create or update ARCHITECTURE.md with spec-ready component inventories.
---`,
  'refine-release': `---
name: /plx-refine-release
id: plx-refine-release
category: Pew Pew Plx
description: Create or update RELEASE.md.
---`,
  'refine-review': `---
name: /plx-refine-review
id: plx-refine-review
category: Pew Pew Plx
description: Create or update REVIEW.md.
---`,
  'refine-testing': `---
name: /plx-refine-testing
id: plx-refine-testing
category: Pew Pew Plx
description: Create or update TESTING.md.
---`,
  'review': `---
name: /plx-review
id: plx-review
category: Pew Pew Plx
description: Review implementations against specs, changes, or tasks.
---`,
  'sync-workspace': `---
name: /plx-sync-workspace
id: plx-sync-workspace
category: Pew Pew Plx
description: Scan workspace state and suggest maintenance actions.
---`,
  'test': `---
name: /plx-test
id: plx-test
category: Pew Pew Plx
description: Run tests based on scope (change, task, or spec) using TESTING.md configuration.
---`,
  'undo-task': `---
name: /plx-undo-task
id: plx-undo-task
category: Pew Pew Plx
description: Revert a task to to-do.
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
