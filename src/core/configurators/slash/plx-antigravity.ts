import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.agent/workflows/plx-init-architecture.md',
  'update-architecture': '.agent/workflows/plx-update-architecture.md',
  'get-task': '.agent/workflows/plx-get-task.md',
  'compact': '.agent/workflows/plx-compact.md',
  'review': '.agent/workflows/plx-review.md',
  'refine-architecture': '.agent/workflows/plx-refine-architecture.md',
  'refine-review': '.agent/workflows/plx-refine-review.md',
  'parse-feedback': '.agent/workflows/plx-parse-feedback.md',
  'prepare-release': '.agent/workflows/plx-prepare-release.md'
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

export class PlxAntigravitySlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'antigravity';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string | undefined {
    const description = DESCRIPTIONS[id];
    return `---\ndescription: ${description}\n---`;
  }
}
