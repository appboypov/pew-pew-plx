import { PlxTomlSlashCommandConfigurator } from './plx-toml-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.gemini/commands/plx/get-task.toml',
  'prepare-compact': '.gemini/commands/plx/prepare-compact.toml',
  'review': '.gemini/commands/plx/review.toml',
  'refine-architecture': '.gemini/commands/plx/refine-architecture.toml',
  'refine-review': '.gemini/commands/plx/refine-review.toml',
  'refine-release': '.gemini/commands/plx/refine-release.toml',
  'parse-feedback': '.gemini/commands/plx/parse-feedback.toml',
  'prepare-release': '.gemini/commands/plx/prepare-release.toml'
};

const DESCRIPTIONS: Record<PlxSlashCommandId, string> = {
  'get-task': 'Select and display the next prioritized task to work on.',
  'prepare-compact': 'Preserve session progress in PROGRESS.md for context continuity.',
  'review': 'Review implementations against specs, changes, or tasks.',
  'refine-architecture': 'Create or update ARCHITECTURE.md.',
  'refine-review': 'Create or update REVIEW.md.',
  'refine-release': 'Create or update RELEASE.md.',
  'parse-feedback': 'Parse feedback markers and generate review tasks.',
  'prepare-release': 'Prepare release by updating changelog, readme, and architecture documentation.'
};

export class PlxGeminiSlashCommandConfigurator extends PlxTomlSlashCommandConfigurator {
  readonly toolId = 'gemini';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getDescription(id: PlxSlashCommandId): string {
    return DESCRIPTIONS[id];
  }
}
