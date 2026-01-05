import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.windsurf/workflows/plx-archive.md',
  'complete-task': '.windsurf/workflows/plx-complete-task.md',
  'get-task': '.windsurf/workflows/plx-get-task.md',
  'implement': '.windsurf/workflows/plx-implement.md',
  'orchestrate': '.windsurf/workflows/plx-orchestrate.md',
  'parse-feedback': '.windsurf/workflows/plx-parse-feedback.md',
  'plan-proposal': '.windsurf/workflows/plx-plan-proposal.md',
  'plan-request': '.windsurf/workflows/plx-plan-request.md',
  'prepare-compact': '.windsurf/workflows/plx-prepare-compact.md',
  'prepare-release': '.windsurf/workflows/plx-prepare-release.md',
  'refine-architecture': '.windsurf/workflows/plx-refine-architecture.md',
  'refine-release': '.windsurf/workflows/plx-refine-release.md',
  'refine-review': '.windsurf/workflows/plx-refine-review.md',
  'refine-testing': '.windsurf/workflows/plx-refine-testing.md',
  'review': '.windsurf/workflows/plx-review.md',
  'sync-workspace': '.windsurf/workflows/plx-sync-workspace.md',
  'test': '.windsurf/workflows/plx-test.md',
  'undo-task': '.windsurf/workflows/plx-undo-task.md'
};

const DESCRIPTIONS: Record<SlashCommandId, string> = {
  'archive': 'Archive a deployed PLX change and update specs.',
  'complete-task': 'Mark a task as done.',
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
  'refine-testing': 'Create or update TESTING.md.',
  'review': 'Review implementations against specs, changes, or tasks.',
  'sync-workspace': 'Scan workspace state and suggest maintenance actions.',
  'test': 'Run tests based on scope (change, task, or spec) using TESTING.md configuration.',
  'undo-task': 'Revert a task to to-do.'
};

export class WindsurfSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'windsurf';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    const description = DESCRIPTIONS[id];
    return `---\ndescription: ${description}\nauto_execution_mode: 3\n---`;
  }
}
