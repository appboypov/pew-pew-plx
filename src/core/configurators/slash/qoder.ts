import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.qoder/commands/plx/archive.md',
  'get-task': '.qoder/commands/plx/get-task.md',
  'implement': '.qoder/commands/plx/implement.md',
  'orchestrate': '.qoder/commands/plx/orchestrate.md',
  'parse-feedback': '.qoder/commands/plx/parse-feedback.md',
  'plan-proposal': '.qoder/commands/plx/plan-proposal.md',
  'plan-request': '.qoder/commands/plx/plan-request.md',
  'prepare-compact': '.qoder/commands/plx/prepare-compact.md',
  'prepare-release': '.qoder/commands/plx/prepare-release.md',
  'refine-architecture': '.qoder/commands/plx/refine-architecture.md',
  'refine-release': '.qoder/commands/plx/refine-release.md',
  'refine-review': '.qoder/commands/plx/refine-review.md',
  'review': '.qoder/commands/plx/review.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
name: Pew Pew Plx: Archive
description: Archive a deployed Pew Pew Plx change and update specs.
category: Pew Pew Plx
tags: [plx, archive]
---`,
  'get-task': `---
name: Pew Pew Plx: Get Task
description: Select and display the next prioritized task to work on.
category: Pew Pew Plx
tags: [plx, task, workflow]
---`,
  'implement': `---
name: Pew Pew Plx: Implement
description: Implement an approved Pew Pew Plx change and keep tasks in sync.
category: Pew Pew Plx
tags: [plx, implement]
---`,
  'orchestrate': `---
name: Pew Pew Plx: Orchestrate
description: Orchestrate sub-agents to complete work collaboratively.
category: Pew Pew Plx
tags: [plx, orchestrate, sub-agents]
---`,
  'parse-feedback': `---
name: Pew Pew Plx: Parse Feedback
description: Parse feedback markers and generate review tasks.
category: Pew Pew Plx
tags: [plx, review, workflow]
---`,
  'plan-proposal': `---
name: Pew Pew Plx: Plan Proposal
description: Scaffold a new Pew Pew Plx change and validate strictly. Consumes request.md when present.
category: Pew Pew Plx
tags: [plx, change]
---`,
  'plan-request': `---
name: Pew Pew Plx: Plan Request
description: Clarify user intent through iterative yes/no questions before proposal creation.
category: Pew Pew Plx
tags: [plx, change, planning]
---`,
  'prepare-compact': `---
name: Pew Pew Plx: Prepare Compact
description: Preserve session progress in PROGRESS.md for context continuity.
category: Pew Pew Plx
tags: [plx, context, session]
---`,
  'prepare-release': `---
name: Pew Pew Plx: Prepare Release
description: Prepare release by updating changelog, readme, and architecture documentation.
category: Pew Pew Plx
tags: [plx, release, documentation]
---`,
  'refine-architecture': `---
name: Pew Pew Plx: Refine Architecture
description: Create or update ARCHITECTURE.md.
category: Pew Pew Plx
tags: [plx, architecture, documentation]
---`,
  'refine-release': `---
name: Pew Pew Plx: Refine Release
description: Create or update RELEASE.md.
category: Pew Pew Plx
tags: [plx, release, documentation]
---`,
  'refine-review': `---
name: Pew Pew Plx: Refine Review
description: Create or update REVIEW.md.
category: Pew Pew Plx
tags: [plx, review, documentation]
---`,
  'review': `---
name: Pew Pew Plx: Review
description: Review implementations against specs, changes, or tasks.
category: Pew Pew Plx
tags: [plx, review, workflow]
---`
};

export class QoderSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'qoder';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
