import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.crush/commands/plx/archive.md',
  'complete-task': '.crush/commands/plx/complete-task.md',
  'get-task': '.crush/commands/plx/get-task.md',
  'implement': '.crush/commands/plx/implement.md',
  'orchestrate': '.crush/commands/plx/orchestrate.md',
  'parse-feedback': '.crush/commands/plx/parse-feedback.md',
  'plan-proposal': '.crush/commands/plx/plan-proposal.md',
  'plan-request': '.crush/commands/plx/plan-request.md',
  'prepare-compact': '.crush/commands/plx/prepare-compact.md',
  'prepare-release': '.crush/commands/plx/prepare-release.md',
  'refine-architecture': '.crush/commands/plx/refine-architecture.md',
  'refine-release': '.crush/commands/plx/refine-release.md',
  'refine-review': '.crush/commands/plx/refine-review.md',
  'refine-testing': '.crush/commands/plx/refine-testing.md',
  'review': '.crush/commands/plx/review.md',
  'sync-workspace': '.crush/commands/plx/sync-workspace.md',
  'test': '.crush/commands/plx/test.md',
  'undo-task': '.crush/commands/plx/undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
name: Archive
description: Archive a deployed change and update specs.
category: Pew Pew Plx
tags: [plx, archive]
---`,
  'complete-task': `---
name: Complete Task
description: Mark a task as done.
category: Pew Pew Plx
tags: [plx, task, workflow]
---`,
  'get-task': `---
name: Get Task
description: Select and display the next prioritized task to work on.
category: Pew Pew Plx
tags: [plx, task, workflow]
---`,
  'implement': `---
name: Implement
description: Implement an approved change and keep tasks in sync.
category: Pew Pew Plx
tags: [plx, implement]
---`,
  'orchestrate': `---
name: Orchestrate
description: Orchestrate sub-agents to complete work collaboratively.
category: Pew Pew Plx
tags: [plx, orchestrate, sub-agents]
---`,
  'parse-feedback': `---
name: Parse Feedback
description: Parse feedback markers and generate review tasks.
category: Pew Pew Plx
tags: [plx, review, workflow]
---`,
  'plan-proposal': `---
name: Plan Proposal
description: Scaffold a new change and validate strictly. Consumes request.md when present.
category: Pew Pew Plx
tags: [plx, change]
---`,
  'plan-request': `---
name: Plan Request
description: Clarify user intent through iterative yes/no questions before proposal creation.
category: Pew Pew Plx
tags: [plx, change, planning]
---`,
  'prepare-compact': `---
name: Prepare Compact
description: Preserve session progress in PROGRESS.md for context continuity.
category: Pew Pew Plx
tags: [plx, context, session]
---`,
  'prepare-release': `---
name: Prepare Release
description: Prepare release by updating changelog, readme, and architecture documentation.
category: Pew Pew Plx
tags: [plx, release, documentation]
---`,
  'refine-architecture': `---
name: Refine Architecture
description: Create or update ARCHITECTURE.md with spec-ready component inventories.
category: Pew Pew Plx
tags: [plx, architecture, documentation]
---`,
  'refine-release': `---
name: Refine Release
description: Create or update RELEASE.md.
category: Pew Pew Plx
tags: [plx, release, documentation]
---`,
  'refine-review': `---
name: Refine Review
description: Create or update REVIEW.md.
category: Pew Pew Plx
tags: [plx, review, documentation]
---`,
  'refine-testing': `---
name: Refine Testing
description: Create or update TESTING.md.
category: Pew Pew Plx
tags: [plx, testing, documentation]
---`,
  'review': `---
name: Review
description: Review implementations against specs, changes, or tasks.
category: Pew Pew Plx
tags: [plx, review, workflow]
---`,
  'sync-workspace': `---
name: Sync Workspace
description: Scan workspace state and suggest maintenance actions.
category: Pew Pew Plx
tags: [plx, workspace, maintenance]
---`,
  'test': `---
name: Test
description: Run tests based on scope (change, task, or spec) using TESTING.md configuration.
category: Pew Pew Plx
tags: [plx, testing, workflow]
---`,
  'undo-task': `---
name: Undo Task
description: Revert a task to to-do.
category: Pew Pew Plx
tags: [plx, task, workflow]
---`
};

export class CrushSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'crush';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
