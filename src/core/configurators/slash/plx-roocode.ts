import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.roo/commands/plx-get-task.md',
  'prepare-compact': '.roo/commands/plx-prepare-compact.md',
  'review': '.roo/commands/plx-review.md',
  'refine-architecture': '.roo/commands/plx-refine-architecture.md',
  'refine-review': '.roo/commands/plx-refine-review.md',
  'refine-release': '.roo/commands/plx-refine-release.md',
  'parse-feedback': '.roo/commands/plx-parse-feedback.md',
  'prepare-release': '.roo/commands/plx-prepare-release.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'get-task': `# PLX: Get Task

Select and display the next prioritized task to work on.`,
  'prepare-compact': `# PLX: Prepare Compact

Preserve session progress in PROGRESS.md for context continuity.`,
  'review': `# PLX: Review

Review implementations against specs, changes, or tasks.`,
  'refine-architecture': `# PLX: Refine Architecture

Create or update ARCHITECTURE.md.`,
  'refine-review': `# PLX: Refine Review

Create or update REVIEW.md.`,
  'refine-release': `# PLX: Refine Release

Create or update RELEASE.md.`,
  'parse-feedback': `# PLX: Parse Feedback

Parse feedback markers and generate review tasks.`,
  'prepare-release': `# PLX: Prepare Release

Prepare release by updating changelog, readme, and architecture documentation.`
};

export class PlxRooCodeSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'roocode';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
