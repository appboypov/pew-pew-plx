import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxClaudeSlashCommandConfigurator } from './plx-claude.js';

export class PlxSlashCommandRegistry {
  private static configurators: Map<string, PlxSlashCommandConfigurator> = new Map();

  static {
    const claude = new PlxClaudeSlashCommandConfigurator();
    this.configurators.set(claude.toolId, claude);
  }

  static get(toolId: string): PlxSlashCommandConfigurator | undefined {
    return this.configurators.get(toolId);
  }

  static getAll(): PlxSlashCommandConfigurator[] {
    return Array.from(this.configurators.values());
  }
}
