import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

/**
 * File paths for Qoder slash commands
 * Maps each PLX workflow stage to its command file location
 * Commands are stored in .qoder/commands/plx/ directory
 */
const FILE_PATHS: Record<SlashCommandId, string> = {
  // Create and validate new change proposals
  proposal: '.qoder/commands/plx/proposal.md',

  // Implement approved changes with task tracking
  apply: '.qoder/commands/plx/apply.md',

  // Archive completed changes and update specs
  archive: '.qoder/commands/plx/archive.md'
};

/**
 * YAML frontmatter for Qoder slash commands
 * Defines metadata displayed in Qoder's command palette
 * Each command is categorized and tagged for easy discovery
 */
const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: PLX: Proposal
description: Scaffold a new PLX change and validate strictly.
category: PLX
tags: [plx, change]
---`,
  apply: `---
name: PLX: Apply
description: Implement an approved PLX change and keep tasks in sync.
category: PLX
tags: [plx, apply]
---`,
  archive: `---
name: PLX: Archive
description: Archive a deployed PLX change and update specs.
category: PLX
tags: [plx, archive]
---`
};

/**
 * Qoder Slash Command Configurator
 *
 * Manages PLX slash commands for Qoder AI assistant.
 * Creates three workflow commands: proposal, apply, and archive.
 * Uses colon-separated command format (/plx:proposal).
 *
 * @extends {SlashCommandConfigurator}
 */
export class QoderSlashCommandConfigurator extends SlashCommandConfigurator {
  /** Unique identifier for Qoder tool */
  readonly toolId = 'qoder';
  
  /** Indicates slash commands are available for this tool */
  readonly isAvailable = true;

  /**
   * Get relative file path for a slash command
   * 
   * @param {SlashCommandId} id - Command identifier (proposal, apply, or archive)
   * @returns {string} Relative path from project root to command file
   */
  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  /**
   * Get YAML frontmatter for a slash command
   * 
   * Frontmatter defines how the command appears in Qoder's UI,
   * including display name, description, and categorization.
   * 
   * @param {SlashCommandId} id - Command identifier (proposal, apply, or archive)
   * @returns {string} YAML frontmatter block with command metadata
   */
  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}