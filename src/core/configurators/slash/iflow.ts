import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.iflow/commands/plx-archive.md',
  'get-task': '.iflow/commands/plx-get-task.md',
  'implement': '.iflow/commands/plx-implement.md',
  'orchestrate': '.iflow/commands/plx-orchestrate.md',
  'parse-feedback': '.iflow/commands/plx-parse-feedback.md',
  'plan-proposal': '.iflow/commands/plx-plan-proposal.md',
  'plan-request': '.iflow/commands/plx-plan-request.md',
  'prepare-compact': '.iflow/commands/plx-prepare-compact.md',
  'prepare-release': '.iflow/commands/plx-prepare-release.md',
  'refine-architecture': '.iflow/commands/plx-refine-architecture.md',
  'refine-release': '.iflow/commands/plx-refine-release.md',
  'refine-review': '.iflow/commands/plx-refine-review.md',
  'review': '.iflow/commands/plx-review.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
name: /plx-archive
id: plx-archive
category: Pew Pew Plx
description: Archive a deployed Pew Pew Plx change and update specs.
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
description: Implement an approved Pew Pew Plx change and keep tasks in sync.
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
  'plan-proposal': `---
name: /plx-plan-proposal
id: plx-plan-proposal
category: Pew Pew Plx
description: Scaffold a new Pew Pew Plx change and validate strictly. Consumes request.md when present.
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
description: Create or update ARCHITECTURE.md.
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
  'review': `---
name: /plx-review
id: plx-review
category: Pew Pew Plx
description: Review implementations against specs, changes, or tasks.
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
