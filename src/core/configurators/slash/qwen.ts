/**
 * Qwen slash command configurator for PLX integration.
 * This class handles the generation of Qwen-specific slash command files
 * in the .qwen/commands directory structure.
 *
 * @implements {SlashCommandConfigurator}
 */
import { TomlSlashCommandConfigurator } from './toml-base.js';
import { SlashCommandId } from '../../templates/index.js';

/**
 * Mapping of slash command IDs to their corresponding file paths in .qwen/commands directory.
 * @type {Record<SlashCommandId, string>}
 */
const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.qwen/commands/plx-proposal.toml',
  implement: '.qwen/commands/plx-implement.toml',
  archive: '.qwen/commands/plx-archive.toml'
};

const DESCRIPTIONS: Record<SlashCommandId, string> = {
  proposal: 'Scaffold a new PLX change and validate strictly.',
  implement: 'Implement an approved PLX change and keep tasks in sync.',
  archive: 'Archive a deployed PLX change and update specs.'
};

/**
 * QwenSlashCommandConfigurator class provides integration with Qwen Code
 * by creating the necessary slash command files in the .qwen/commands directory.
 *
 * The slash commands include:
 * - /plx-proposal: Create a PLX change proposal
 * - /plx-implement: Implement an approved PLX change
 * - /plx-archive: Archive a deployed PLX change
 */
export class QwenSlashCommandConfigurator extends TomlSlashCommandConfigurator {
  /** Unique identifier for the Qwen tool */
  readonly toolId = 'qwen';

  /** Availability status for the Qwen tool */
  readonly isAvailable = true;

  /**
   * Returns the relative file path for a given slash command ID.
   * @param {SlashCommandId} id - The slash command identifier
   * @returns {string} The relative path to the command file
   */
  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getDescription(id: SlashCommandId): string {
    return DESCRIPTIONS[id];
  }
}