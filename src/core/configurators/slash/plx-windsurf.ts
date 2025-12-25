import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.windsurf/workflows/plx-init-architecture.md',
  'update-architecture': '.windsurf/workflows/plx-update-architecture.md',
  'get-task': '.windsurf/workflows/plx-get-task.md'
};

const DESCRIPTIONS: Record<PlxSlashCommandId, string> = {
  'init-architecture': 'Generate comprehensive ARCHITECTURE.md from codebase analysis.',
  'update-architecture': 'Refresh ARCHITECTURE.md based on current codebase state.',
  'get-task': 'Select and display the next prioritized task to work on.'
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
