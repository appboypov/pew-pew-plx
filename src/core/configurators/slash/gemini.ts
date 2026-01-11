import { TomlSlashCommandConfigurator } from './toml-base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.gemini/commands/plx/archive.toml',
  'complete-task': '.gemini/commands/plx/complete-task.toml',
  'copy-next-task': '.gemini/commands/plx/copy-next-task.toml',
  'copy-review-request': '.gemini/commands/plx/copy-review-request.toml',
  'copy-test-request': '.gemini/commands/plx/copy-test-request.toml',
  'get-task': '.gemini/commands/plx/get-task.toml',
  'implement': '.gemini/commands/plx/implement.toml',
  'orchestrate': '.gemini/commands/plx/orchestrate.toml',
  'parse-feedback': '.gemini/commands/plx/parse-feedback.toml',
  'plan-implementation': '.gemini/commands/plx/plan-implementation.toml',
  'plan-proposal': '.gemini/commands/plx/plan-proposal.toml',
  'plan-request': '.gemini/commands/plx/plan-request.toml',
  'prepare-compact': '.gemini/commands/plx/prepare-compact.toml',
  'prepare-release': '.gemini/commands/plx/prepare-release.toml',
  'refine-architecture': '.gemini/commands/plx/refine-architecture.toml',
  'refine-release': '.gemini/commands/plx/refine-release.toml',
  'refine-review': '.gemini/commands/plx/refine-review.toml',
  'refine-testing': '.gemini/commands/plx/refine-testing.toml',
  'review': '.gemini/commands/plx/review.toml',
  'sync-workspace': '.gemini/commands/plx/sync-workspace.toml',
  'test': '.gemini/commands/plx/test.toml',
  'undo-task': '.gemini/commands/plx/undo-task.toml'
};

const DESCRIPTIONS: Record<SlashCommandId, string> = {
  'archive': 'Archive a deployed PLX change and update specs.',
  'complete-task': 'Mark a task as done.',
  'copy-next-task': 'Copy next task or feedback block to clipboard for external agent handoff.',
  'copy-review-request': 'Copy review request block with REVIEW.md guidelines to clipboard for external agent.',
  'copy-test-request': 'Copy test request block with TESTING.md configuration to clipboard for external agent.',
  'get-task': 'Select and display the next prioritized task to work on.',
  'implement': 'Implement an approved PLX change and keep tasks in sync.',
  'orchestrate': 'Orchestrate sub-agents to complete work collaboratively.',
  'parse-feedback': 'Parse feedback markers and generate review tasks.',
  'plan-implementation': 'Generate PROGRESS.md and orchestrate multi-agent task handoff.',
  'plan-proposal': 'Scaffold a new PLX change and validate strictly. Consumes request.md when present.',
  'plan-request': 'Clarify user intent through iterative yes/no questions before proposal creation.',
  'prepare-compact': 'Preserve session progress in PROGRESS.md for context continuity.',
  'prepare-release': 'Prepare release by updating changelog, readme, and architecture documentation.',
  'refine-architecture': 'Create or update ARCHITECTURE.md with spec-ready component inventories.',
  'refine-release': 'Create or update RELEASE.md.',
  'refine-review': 'Create or update REVIEW.md.',
  'refine-testing': 'Create or update TESTING.md.',
  'review': 'Review implementations against specs, changes, or tasks.',
  'sync-workspace': 'Scan workspace state and suggest maintenance actions.',
  'test': 'Run tests based on scope (change, task, or spec) using TESTING.md configuration.',
  'undo-task': 'Revert a task to to-do.'
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
