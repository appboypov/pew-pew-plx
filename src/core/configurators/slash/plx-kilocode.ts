import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.kilocode/workflows/plx-get-task.md',
  'compact': '.kilocode/workflows/plx-compact.md',
  'review': '.kilocode/workflows/plx-review.md',
  'refine-architecture': '.kilocode/workflows/plx-refine-architecture.md',
  'refine-review': '.kilocode/workflows/plx-refine-review.md',
  'refine-release': '.kilocode/workflows/plx-refine-release.md',
  'parse-feedback': '.kilocode/workflows/plx-parse-feedback.md',
  'prepare-release': '.kilocode/workflows/plx-prepare-release.md'
};

export class PlxKiloCodeSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'kilocode';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(_id: PlxSlashCommandId): string | undefined {
    return undefined;
  }
}
