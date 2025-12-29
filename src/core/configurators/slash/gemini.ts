import { TomlSlashCommandConfigurator } from './toml-base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.gemini/commands/plx/proposal.toml',
  apply: '.gemini/commands/plx/apply.toml',
  archive: '.gemini/commands/plx/archive.toml'
};

const DESCRIPTIONS: Record<SlashCommandId, string> = {
  proposal: 'Scaffold a new PLX change and validate strictly.',
  apply: 'Implement an approved PLX change and keep tasks in sync.',
  archive: 'Archive a deployed PLX change and update specs.'
};

export class GeminiSlashCommandConfigurator extends TomlSlashCommandConfigurator {
  readonly toolId = 'gemini';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getDescription(id: SlashCommandId): string {
    return DESCRIPTIONS[id];
  }
}
