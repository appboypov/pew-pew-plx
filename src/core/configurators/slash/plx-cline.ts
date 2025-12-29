import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.clinerules/workflows/plx-init-architecture.md',
  'update-architecture': '.clinerules/workflows/plx-update-architecture.md',
  'get-task': '.clinerules/workflows/plx-get-task.md',
  'compact': '.clinerules/workflows/plx-compact.md',
  'review': '.clinerules/workflows/plx-review.md',
  'refine-architecture': '.clinerules/workflows/plx-refine-architecture.md',
  'refine-review': '.clinerules/workflows/plx-refine-review.md',
  'parse-feedback': '.clinerules/workflows/plx-parse-feedback.md',
  'prepare-release': '.clinerules/workflows/plx-prepare-release.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `# PLX: Init Architecture

Generate comprehensive ARCHITECTURE.md from codebase analysis.`,
  'update-architecture': `# PLX: Update Architecture

Refresh ARCHITECTURE.md based on current codebase state.`,
  'get-task': `# PLX: Get Task

Select and display the next prioritized task to work on.`,
  'compact': `# PLX: Compact

Preserve session progress in PROGRESS.md for context continuity.`,
  'review': `# PLX: Review

Review implementations against specs, changes, or tasks.`,
  'refine-architecture': `# PLX: Refine Architecture

Create or update ARCHITECTURE.md.`,
  'refine-review': `# PLX: Refine Review

Create or update REVIEW.md.`,
  'parse-feedback': `# PLX: Parse Feedback

Parse feedback markers and generate review tasks.`,
  'prepare-release': `# PLX: Prepare Release

Prepare release by updating changelog, readme, and architecture documentation.`
};

export class PlxClineSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'cline';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
