import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.kilocode/workflows/plx-archive.md',
  'complete-task': '.kilocode/workflows/plx-complete-task.md',
  'get-task': '.kilocode/workflows/plx-get-task.md',
  'implement': '.kilocode/workflows/plx-implement.md',
  'orchestrate': '.kilocode/workflows/plx-orchestrate.md',
  'parse-feedback': '.kilocode/workflows/plx-parse-feedback.md',
  'plan-proposal': '.kilocode/workflows/plx-plan-proposal.md',
  'plan-request': '.kilocode/workflows/plx-plan-request.md',
  'prepare-compact': '.kilocode/workflows/plx-prepare-compact.md',
  'prepare-release': '.kilocode/workflows/plx-prepare-release.md',
  'refine-architecture': '.kilocode/workflows/plx-refine-architecture.md',
  'refine-release': '.kilocode/workflows/plx-refine-release.md',
  'refine-review': '.kilocode/workflows/plx-refine-review.md',
  'refine-testing': '.kilocode/workflows/plx-refine-testing.md',
  'review': '.kilocode/workflows/plx-review.md',
  'sync-workspace': '.kilocode/workflows/plx-sync-workspace.md',
  'test': '.kilocode/workflows/plx-test.md',
  'undo-task': '.kilocode/workflows/plx-undo-task.md'
};

export class KiloCodeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'kilocode';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(_id: SlashCommandId): string | undefined {
    return undefined;
  }
}
