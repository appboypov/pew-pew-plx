import { TomlSlashCommandConfigurator } from './toml-base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.gemini/commands/plx/archive.toml',
  'get-task': '.gemini/commands/plx/get-task.toml',
  'implement': '.gemini/commands/plx/implement.toml',
  'orchestrate': '.gemini/commands/plx/orchestrate.toml',
  'parse-feedback': '.gemini/commands/plx/parse-feedback.toml',
  'plan-proposal': '.gemini/commands/plx/plan-proposal.toml',
  'plan-request': '.gemini/commands/plx/plan-request.toml',
  'prepare-compact': '.gemini/commands/plx/prepare-compact.toml',
  'prepare-release': '.gemini/commands/plx/prepare-release.toml',
  'refine-architecture': '.gemini/commands/plx/refine-architecture.toml',
  'refine-release': '.gemini/commands/plx/refine-release.toml',
  'refine-review': '.gemini/commands/plx/refine-review.toml',
  'review': '.gemini/commands/plx/review.toml'
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
