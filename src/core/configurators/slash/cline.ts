import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.clinerules/workflows/plx-archive.md',
  'complete-task': '.clinerules/workflows/plx-complete-task.md',
  'get-task': '.clinerules/workflows/plx-get-task.md',
  'implement': '.clinerules/workflows/plx-implement.md',
  'orchestrate': '.clinerules/workflows/plx-orchestrate.md',
  'parse-feedback': '.clinerules/workflows/plx-parse-feedback.md',
  'plan-proposal': '.clinerules/workflows/plx-plan-proposal.md',
  'plan-request': '.clinerules/workflows/plx-plan-request.md',
  'prepare-compact': '.clinerules/workflows/plx-prepare-compact.md',
  'prepare-release': '.clinerules/workflows/plx-prepare-release.md',
  'refine-architecture': '.clinerules/workflows/plx-refine-architecture.md',
  'refine-release': '.clinerules/workflows/plx-refine-release.md',
  'refine-review': '.clinerules/workflows/plx-refine-review.md',
  'refine-testing': '.clinerules/workflows/plx-refine-testing.md',
  'review': '.clinerules/workflows/plx-review.md',
  'sync-workspace': '.clinerules/workflows/plx-sync-workspace.md',
  'test': '.clinerules/workflows/plx-test.md',
  'undo-task': '.clinerules/workflows/plx-undo-task.md'
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

export class ClineSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'cline';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
