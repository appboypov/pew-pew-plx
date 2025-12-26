import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.clinerules/workflows/plx-init-architecture.md',
  'update-architecture': '.clinerules/workflows/plx-update-architecture.md',
  'get-task': '.clinerules/workflows/plx-get-task.md',
  'compact': '.clinerules/workflows/plx-compact.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `# PLX: Init Architecture

Generate comprehensive ARCHITECTURE.md from codebase analysis.`,
  'update-architecture': `# PLX: Update Architecture

Refresh ARCHITECTURE.md based on current codebase state.`,
  'get-task': `# PLX: Get Task

Select and display the next prioritized task to work on.`,
  'compact': `# PLX: Compact

Preserve session progress in PROGRESS.md for context continuity.`
};

export class PlxClineSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'cline';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
