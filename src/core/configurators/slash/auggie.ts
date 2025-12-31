import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.augment/commands/plx-archive.md',
  'get-task': '.augment/commands/plx-get-task.md',
  'implement': '.augment/commands/plx-implement.md',
  'orchestrate': '.augment/commands/plx-orchestrate.md',
  'parse-feedback': '.augment/commands/plx-parse-feedback.md',
  'plan-proposal': '.augment/commands/plx-plan-proposal.md',
  'plan-request': '.augment/commands/plx-plan-request.md',
  'prepare-compact': '.augment/commands/plx-prepare-compact.md',
  'prepare-release': '.augment/commands/plx-prepare-release.md',
  'refine-architecture': '.augment/commands/plx-refine-architecture.md',
  'refine-release': '.augment/commands/plx-refine-release.md',
  'refine-review': '.augment/commands/plx-refine-review.md',
  'review': '.augment/commands/plx-review.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
description: Archive a deployed Pew Pew Plx change and update specs.
argument-hint: change-id
---`,
  'get-task': `---
description: Select and display the next prioritized task to work on.
argument-hint: (optional context)
---`,
  'implement': `---
description: Implement an approved Pew Pew Plx change and keep tasks in sync.
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
description: Scaffold a new Pew Pew Plx change and validate strictly. Consumes request.md when present.
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
