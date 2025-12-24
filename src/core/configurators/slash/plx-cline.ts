import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.clinerules/workflows/plx-init-architecture.md',
  'update-architecture': '.clinerules/workflows/plx-update-architecture.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `# PLX: Init Architecture

Generate comprehensive ARCHITECTURE.md from codebase analysis.`,
  'update-architecture': `# PLX: Update Architecture

Refresh ARCHITECTURE.md based on current codebase state.`
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
