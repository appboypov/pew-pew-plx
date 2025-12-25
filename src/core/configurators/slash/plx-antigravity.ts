import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.agent/workflows/plx-init-architecture.md',
  'update-architecture': '.agent/workflows/plx-update-architecture.md',
  'act-next': '.agent/workflows/plx-act-next.md'
};

const DESCRIPTIONS: Record<PlxSlashCommandId, string> = {
  'init-architecture': 'Generate comprehensive ARCHITECTURE.md from codebase analysis.',
  'update-architecture': 'Refresh ARCHITECTURE.md based on current codebase state.',
  'act-next': 'Select and display the next prioritized task to work on.'
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
