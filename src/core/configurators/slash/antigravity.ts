import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.agent/workflows/plx-archive.md',
  'get-task': '.agent/workflows/plx-get-task.md',
  'implement': '.agent/workflows/plx-implement.md',
  'orchestrate': '.agent/workflows/plx-orchestrate.md',
  'parse-feedback': '.agent/workflows/plx-parse-feedback.md',
  'plan-proposal': '.agent/workflows/plx-plan-proposal.md',
  'plan-request': '.agent/workflows/plx-plan-request.md',
  'prepare-compact': '.agent/workflows/plx-prepare-compact.md',
  'prepare-release': '.agent/workflows/plx-prepare-release.md',
  'refine-architecture': '.agent/workflows/plx-refine-architecture.md',
  'refine-release': '.agent/workflows/plx-refine-release.md',
  'refine-review': '.agent/workflows/plx-refine-review.md',
  'review': '.agent/workflows/plx-review.md'
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

export class AntigravitySlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'antigravity';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    const description = DESCRIPTIONS[id];
    return `---\ndescription: ${description}\n---`;
  }
}
