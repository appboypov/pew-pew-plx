import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.claude/commands/plx/init-architecture.md',
  'update-architecture': '.claude/commands/plx/update-architecture.md',
  'get-task': '.claude/commands/plx/get-task.md',
  'compact': '.claude/commands/plx/compact.md',
  'review': '.claude/commands/plx/review.md',
  'refine-architecture': '.claude/commands/plx/refine-architecture.md',
  'refine-review': '.claude/commands/plx/refine-review.md',
  'parse-feedback': '.claude/commands/plx/parse-feedback.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
name: Pew Pew Plx: Init Architecture
description: Generate comprehensive ARCHITECTURE.md from codebase analysis.
category: Pew Pew Plx
tags: [plx, architecture, documentation]
---`,
  'update-architecture': `---
name: Pew Pew Plx: Update Architecture
description: Refresh ARCHITECTURE.md based on current codebase state.
category: Pew Pew Plx
tags: [plx, architecture, documentation]
---`,
  'get-task': `---
name: Pew Pew Plx: Get Task
description: Select and display the next prioritized task to work on.
category: Pew Pew Plx
tags: [plx, task, workflow]
---`,
  'compact': `---
name: Pew Pew Plx: Compact
description: Preserve session progress in PROGRESS.md for context continuity.
category: Pew Pew Plx
tags: [plx, context, session]
---`,
  'review': `---
name: Pew Pew Plx: Review
description: Review implementations against specs, changes, or tasks.
category: Pew Pew Plx
tags: [plx, review, workflow]
---`,
  'refine-architecture': `---
name: Pew Pew Plx: Refine Architecture
description: Create or update ARCHITECTURE.md.
category: Pew Pew Plx
tags: [plx, architecture, documentation]
---`,
  'refine-review': `---
name: Pew Pew Plx: Refine Review
description: Create or update REVIEW.md.
category: Pew Pew Plx
tags: [plx, review, documentation]
---`,
  'parse-feedback': `---
name: Pew Pew Plx: Parse Feedback
description: Parse feedback markers and generate review tasks.
category: Pew Pew Plx
tags: [plx, review, workflow]
---`
};

export class PlxClaudeSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'claude';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
