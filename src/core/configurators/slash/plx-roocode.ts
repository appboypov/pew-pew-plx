import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.roo/commands/plx-init-architecture.md',
  'update-architecture': '.roo/commands/plx-update-architecture.md',
  'act-next': '.roo/commands/plx-act-next.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `# PLX: Init Architecture

Generate comprehensive ARCHITECTURE.md from codebase analysis.`,
  'update-architecture': `# PLX: Update Architecture

Refresh ARCHITECTURE.md based on current codebase state.`,
  'act-next': `# PLX: Act Next

Select and display the next prioritized task to work on.`
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
