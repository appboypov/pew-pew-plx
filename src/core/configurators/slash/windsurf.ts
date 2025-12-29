import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.windsurf/workflows/plx-proposal.md',
  apply: '.windsurf/workflows/plx-apply.md',
  archive: '.windsurf/workflows/plx-archive.md'
};

export class WindsurfSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'windsurf';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    const descriptions: Record<SlashCommandId, string> = {
      proposal: 'Scaffold a new PLX change and validate strictly.',
      apply: 'Implement an approved PLX change and keep tasks in sync.',
      archive: 'Archive a deployed PLX change and update specs.'
    };
    const description = descriptions[id];
    return `---\ndescription: ${description}\nauto_execution_mode: 3\n---`;
  }
}
