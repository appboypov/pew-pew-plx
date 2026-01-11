import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.github/prompts/plx-archive.prompt.md',
  'complete-task': '.github/prompts/plx-complete-task.prompt.md',
  'copy-next-task': '.github/prompts/plx-copy-next-task.prompt.md',
  'copy-review-request': '.github/prompts/plx-copy-review-request.prompt.md',
  'copy-test-request': '.github/prompts/plx-copy-test-request.prompt.md',
  'get-task': '.github/prompts/plx-get-task.prompt.md',
  'implement': '.github/prompts/plx-implement.prompt.md',
  'orchestrate': '.github/prompts/plx-orchestrate.prompt.md',
  'parse-feedback': '.github/prompts/plx-parse-feedback.prompt.md',
  'plan-implementation': '.github/prompts/plx-plan-implementation.prompt.md',
  'plan-proposal': '.github/prompts/plx-plan-proposal.prompt.md',
  'plan-request': '.github/prompts/plx-plan-request.prompt.md',
  'prepare-compact': '.github/prompts/plx-prepare-compact.prompt.md',
  'prepare-release': '.github/prompts/plx-prepare-release.prompt.md',
  'refine-architecture': '.github/prompts/plx-refine-architecture.prompt.md',
  'refine-release': '.github/prompts/plx-refine-release.prompt.md',
  'refine-review': '.github/prompts/plx-refine-review.prompt.md',
  'refine-testing': '.github/prompts/plx-refine-testing.prompt.md',
  'review': '.github/prompts/plx-review.prompt.md',
  'sync-workspace': '.github/prompts/plx-sync-workspace.prompt.md',
  'test': '.github/prompts/plx-test.prompt.md',
  'undo-task': '.github/prompts/plx-undo-task.prompt.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
description: Archive a deployed PLX change and update specs.
---

$ARGUMENTS`,
  'complete-task': `---
description: Mark a task as done.
---

$ARGUMENTS`,
  'copy-next-task': `---
description: Copy next task or feedback block to clipboard for external agent handoff.
---

$ARGUMENTS`,
  'copy-review-request': `---
description: Copy review request block with REVIEW.md guidelines to clipboard for external agent.
---

$ARGUMENTS`,
  'copy-test-request': `---
description: Copy test request block with TESTING.md configuration to clipboard for external agent.
---

$ARGUMENTS`,
  'get-task': `---
description: Select and display the next prioritized task to work on.
---

$ARGUMENTS`,
  'implement': `---
description: Implement an approved PLX change and keep tasks in sync.
---

$ARGUMENTS`,
  'orchestrate': `---
description: Orchestrate sub-agents to complete work collaboratively.
---

$ARGUMENTS`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
---

$ARGUMENTS`,
  'plan-implementation': `---
description: Generate PROGRESS.md and orchestrate multi-agent task handoff.
---

$ARGUMENTS`,
  'plan-proposal': `---
description: Scaffold a new PLX change and validate strictly. Consumes request.md when present.
---

$ARGUMENTS`,
  'plan-request': `---
description: Clarify user intent through iterative yes/no questions before proposal creation.
---

$ARGUMENTS`,
  'prepare-compact': `---
description: Preserve session progress in PROGRESS.md for context continuity.
---

$ARGUMENTS`,
  'prepare-release': `---
description: Prepare release by updating changelog, readme, and architecture documentation.
---

$ARGUMENTS`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md with spec-ready component inventories.
---

$ARGUMENTS`,
  'refine-release': `---
description: Create or update RELEASE.md.
---

$ARGUMENTS`,
  'refine-review': `---
description: Create or update REVIEW.md.
---

$ARGUMENTS`,
  'refine-testing': `---
description: Create or update TESTING.md.
---

$ARGUMENTS`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
---

$ARGUMENTS`,
  'sync-workspace': `---
description: Scan workspace state and suggest maintenance actions.
---

$ARGUMENTS`,
  'test': `---
description: Run tests based on scope (change, task, or spec) using TESTING.md configuration.
---

$ARGUMENTS`,
  'undo-task': `---
description: Revert a task to to-do.
---

$ARGUMENTS`
};

export class GitHubCopilotSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'github-copilot';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
