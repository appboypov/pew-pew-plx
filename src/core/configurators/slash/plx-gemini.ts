import { PlxTomlSlashCommandConfigurator } from './plx-toml-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.gemini/commands/plx/init-architecture.toml',
  'update-architecture': '.gemini/commands/plx/update-architecture.toml'
};

const DESCRIPTIONS: Record<PlxSlashCommandId, string> = {
  'init-architecture': 'Generate comprehensive ARCHITECTURE.md from codebase analysis.',
  'update-architecture': 'Refresh ARCHITECTURE.md based on current codebase state.'
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
