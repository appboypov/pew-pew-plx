import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.kilocode/workflows/plx-init-architecture.md',
  'update-architecture': '.kilocode/workflows/plx-update-architecture.md'
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
