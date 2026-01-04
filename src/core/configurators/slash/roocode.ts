import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.roo/commands/plx-archive.md',
  'complete-task': '.roo/commands/plx-complete-task.md',
  'get-task': '.roo/commands/plx-get-task.md',
  'implement': '.roo/commands/plx-implement.md',
  'orchestrate': '.roo/commands/plx-orchestrate.md',
  'parse-feedback': '.roo/commands/plx-parse-feedback.md',
  'plan-proposal': '.roo/commands/plx-plan-proposal.md',
  'plan-request': '.roo/commands/plx-plan-request.md',
  'prepare-compact': '.roo/commands/plx-prepare-compact.md',
  'prepare-release': '.roo/commands/plx-prepare-release.md',
  'refine-architecture': '.roo/commands/plx-refine-architecture.md',
  'refine-release': '.roo/commands/plx-refine-release.md',
  'refine-review': '.roo/commands/plx-refine-review.md',
  'refine-testing': '.roo/commands/plx-refine-testing.md',
  'review': '.roo/commands/plx-review.md',
  'sync-workspace': '.roo/commands/plx-sync-workspace.md',
  'test': '.roo/commands/plx-test.md',
  'undo-task': '.roo/commands/plx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `# PLX: Archive

Archive a deployed PLX change and update specs.`,
  'complete-task': `# PLX: Complete Task

Mark a task as done.`,
  'get-task': `# PLX: Get Task

Select and display the next prioritized task to work on.`,
  'implement': `# PLX: Implement

Implement an approved PLX change and keep tasks in sync.`,
  'orchestrate': `# PLX: Orchestrate

Orchestrate sub-agents to complete work collaboratively.`,
  'parse-feedback': `# PLX: Parse Feedback

Parse feedback markers and generate review tasks.`,
  'plan-proposal': `# PLX: Plan Proposal

Scaffold a new PLX change and validate strictly. Consumes request.md when present.`,
  'plan-request': `# PLX: Plan Request

Clarify user intent through iterative yes/no questions before proposal creation.`,
  'prepare-compact': `# PLX: Prepare Compact

Preserve session progress in PROGRESS.md for context continuity.`,
  'prepare-release': `# PLX: Prepare Release

Prepare release by updating changelog, readme, and architecture documentation.`,
  'refine-architecture': `# PLX: Refine Architecture

Create or update ARCHITECTURE.md.`,
  'refine-release': `# PLX: Refine Release

Create or update RELEASE.md.`,
  'refine-review': `# PLX: Refine Review

Create or update REVIEW.md.`,
  'refine-testing': `# PLX: Refine Testing

Create or update TESTING.md.`,
  'review': `# PLX: Review

Review implementations against specs, changes, or tasks.`,
  'sync-workspace': `# PLX: Sync Workspace

Scan workspace state and suggest maintenance actions.`,
  'test': `# PLX: Test

Run tests based on scope (change, task, or spec) using TESTING.md configuration.`,
  'undo-task': `# PLX: Undo Task

Revert a task to to-do.`
};

export class RooCodeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'roocode';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    return FRONTMATTER[id];
  }
}
