import { TomlSlashCommandConfigurator } from './toml-base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.qwen/commands/plx-archive.toml',
  'get-task': '.qwen/commands/plx-get-task.toml',
  'implement': '.qwen/commands/plx-implement.toml',
  'orchestrate': '.qwen/commands/plx-orchestrate.toml',
  'parse-feedback': '.qwen/commands/plx-parse-feedback.toml',
  'plan-proposal': '.qwen/commands/plx-plan-proposal.toml',
  'plan-request': '.qwen/commands/plx-plan-request.toml',
  'prepare-compact': '.qwen/commands/plx-prepare-compact.toml',
  'prepare-release': '.qwen/commands/plx-prepare-release.toml',
  'refine-architecture': '.qwen/commands/plx-refine-architecture.toml',
  'refine-release': '.qwen/commands/plx-refine-release.toml',
  'refine-review': '.qwen/commands/plx-refine-review.toml',
  'review': '.qwen/commands/plx-review.toml'
};

const DESCRIPTIONS: Record<SlashCommandId, string> = {
  'archive': 'Archive a deployed PLX change and update specs.',
  'get-task': 'Select and display the next prioritized task to work on.',
  'implement': 'Implement an approved PLX change and keep tasks in sync.',
  'orchestrate': 'Orchestrate sub-agents to complete work collaboratively.',
  'parse-feedback': 'Parse feedback markers and generate review tasks.',
  'plan-proposal': 'Scaffold a new PLX change and validate strictly. Consumes request.md when present.',
  'plan-request': 'Clarify user intent through iterative yes/no questions before proposal creation.',
  'prepare-compact': 'Preserve session progress in PROGRESS.md for context continuity.',
  'prepare-release': 'Prepare release by updating changelog, readme, and architecture documentation.',
  'refine-architecture': 'Create or update ARCHITECTURE.md.',
  'refine-release': 'Create or update RELEASE.md.',
  'refine-review': 'Create or update REVIEW.md.',
  'review': 'Review implementations against specs, changes, or tasks.'
};

export class QwenSlashCommandConfigurator extends TomlSlashCommandConfigurator {
  readonly toolId = 'qwen';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getDescription(id: SlashCommandId): string {
    return DESCRIPTIONS[id];
  }
}
