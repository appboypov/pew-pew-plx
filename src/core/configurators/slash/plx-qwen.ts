import { PlxTomlSlashCommandConfigurator } from './plx-toml-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.qwen/commands/plx-get-task.toml',
  'compact': '.qwen/commands/plx-compact.toml',
  'review': '.qwen/commands/plx-review.toml',
  'refine-architecture': '.qwen/commands/plx-refine-architecture.toml',
  'refine-review': '.qwen/commands/plx-refine-review.toml',
  'refine-release': '.qwen/commands/plx-refine-release.toml',
  'parse-feedback': '.qwen/commands/plx-parse-feedback.toml',
  'prepare-release': '.qwen/commands/plx-prepare-release.toml'
};

const DESCRIPTIONS: Record<PlxSlashCommandId, string> = {
  'get-task': 'Select and display the next prioritized task to work on.',
  'compact': 'Preserve session progress in PROGRESS.md for context continuity.',
  'review': 'Review implementations against specs, changes, or tasks.',
  'refine-architecture': 'Create or update ARCHITECTURE.md.',
  'refine-review': 'Create or update REVIEW.md.',
  'refine-release': 'Create or update RELEASE.md.',
  'parse-feedback': 'Parse feedback markers and generate review tasks.',
  'prepare-release': 'Prepare release by updating changelog, readme, and architecture documentation.'
};

export class PlxQwenSlashCommandConfigurator extends PlxTomlSlashCommandConfigurator {
  readonly toolId = 'qwen';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getDescription(id: PlxSlashCommandId): string {
    return DESCRIPTIONS[id];
  }
}
