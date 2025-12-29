import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.windsurf/workflows/plx-init-architecture.md',
  'update-architecture': '.windsurf/workflows/plx-update-architecture.md',
  'get-task': '.windsurf/workflows/plx-get-task.md',
  'compact': '.windsurf/workflows/plx-compact.md',
  'review': '.windsurf/workflows/plx-review.md',
  'refine-architecture': '.windsurf/workflows/plx-refine-architecture.md',
  'refine-review': '.windsurf/workflows/plx-refine-review.md',
  'parse-feedback': '.windsurf/workflows/plx-parse-feedback.md',
  'prepare-release': '.windsurf/workflows/plx-prepare-release.md'
};

const DESCRIPTIONS: Record<PlxSlashCommandId, string> = {
  'init-architecture': 'Generate comprehensive ARCHITECTURE.md from codebase analysis.',
  'update-architecture': 'Refresh ARCHITECTURE.md based on current codebase state.',
  'get-task': 'Select and display the next prioritized task to work on.',
  'compact': 'Preserve session progress in PROGRESS.md for context continuity.',
  'review': 'Review implementations against specs, changes, or tasks.',
  'refine-architecture': 'Create or update ARCHITECTURE.md.',
  'refine-review': 'Create or update REVIEW.md.',
  'parse-feedback': 'Parse feedback markers and generate review tasks.',
  'prepare-release': 'Prepare release by updating changelog, readme, and architecture documentation.'
};

export class PlxWindsurfSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'windsurf';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string | undefined {
    const description = DESCRIPTIONS[id];
    return `---\ndescription: ${description}\nauto_execution_mode: 3\n---`;
  }
}
