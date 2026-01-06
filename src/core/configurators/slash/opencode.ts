import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';
import { FileSystemUtils } from '../../../utils/file-system.js';
import { PLX_MARKERS } from '../../config.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.opencode/command/plx-archive.md',
  'complete-task': '.opencode/command/plx-complete-task.md',
  'get-task': '.opencode/command/plx-get-task.md',
  'implement': '.opencode/command/plx-implement.md',
  'orchestrate': '.opencode/command/plx-orchestrate.md',
  'parse-feedback': '.opencode/command/plx-parse-feedback.md',
  'plan-proposal': '.opencode/command/plx-plan-proposal.md',
  'plan-request': '.opencode/command/plx-plan-request.md',
  'prepare-compact': '.opencode/command/plx-prepare-compact.md',
  'prepare-release': '.opencode/command/plx-prepare-release.md',
  'refine-architecture': '.opencode/command/plx-refine-architecture.md',
  'refine-release': '.opencode/command/plx-refine-release.md',
  'refine-review': '.opencode/command/plx-refine-review.md',
  'refine-testing': '.opencode/command/plx-refine-testing.md',
  'review': '.opencode/command/plx-review.md',
  'sync-workspace': '.opencode/command/plx-sync-workspace.md',
  'test': '.opencode/command/plx-test.md',
  'undo-task': '.opencode/command/plx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
description: Archive a deployed PLX change and update specs.
---
<ChangeId>
  $ARGUMENTS
</ChangeId>
`,
  'complete-task': `---
description: Mark a task as done.
argument-hint: task-id
---

$ARGUMENTS`,
  'get-task': `---
description: Select and display the next prioritized task to work on.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'implement': `---
description: Implement an approved PLX change and keep tasks in sync.
---
The user has requested to implement the following change proposal. Find the change proposal and follow the instructions below. If you're not sure or if ambiguous, ask for clarification from the user.
<UserRequest>
  $ARGUMENTS
</UserRequest>
`,
  'orchestrate': `---
description: Orchestrate sub-agents to complete work collaboratively.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'plan-proposal': `---
description: Scaffold a new PLX change and validate strictly. Consumes request.md when present.
---
The user has requested the following change proposal. Use the PLX instructions to create their change proposal.
<UserRequest>
  $ARGUMENTS
</UserRequest>
`,
  'plan-request': `---
description: Clarify user intent through iterative yes/no questions before proposal creation.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'prepare-compact': `---
description: Preserve session progress in PROGRESS.md for context continuity.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'prepare-release': `---
description: Prepare release by updating changelog, readme, and architecture documentation.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-release': `---
description: Create or update RELEASE.md.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-review': `---
description: Create or update REVIEW.md.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-testing': `---
description: Create or update TESTING.md.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'sync-workspace': `---
description: Scan workspace state and suggest maintenance actions.
argument-hint: --id <id> --parent-type change|task
---

$ARGUMENTS`,
  'test': `---
description: Run tests based on scope (change, task, or spec) using TESTING.md configuration.
argument-hint: --id <id> --parent-type change|task|spec
---

$ARGUMENTS`,
  'undo-task': `---
description: Revert a task to to-do.
argument-hint: task-id
---

$ARGUMENTS`
};

export class OpenCodeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'opencode';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    return FRONTMATTER[id];
  }

  async generateAll(projectPath: string): Promise<string[]> {
    const createdOrUpdated = await super.generateAll(projectPath);
    await this.rewriteArchiveFile(projectPath);
    return createdOrUpdated;
  }

  async updateExisting(projectPath: string): Promise<string[]> {
    const updated = await super.updateExisting(projectPath);
    const rewroteArchive = await this.rewriteArchiveFile(projectPath);
    if (rewroteArchive && !updated.includes(FILE_PATHS.archive)) {
      updated.push(FILE_PATHS.archive);
    }
    return updated;
  }

  private async rewriteArchiveFile(projectPath: string): Promise<boolean> {
    const archivePath = FileSystemUtils.joinPath(projectPath, FILE_PATHS.archive);
    if (!await FileSystemUtils.fileExists(archivePath)) {
      return false;
    }

    const body = this.getBody('archive');
    const frontmatter = this.getFrontmatter('archive');
    const sections: string[] = [];

    if (frontmatter) {
      sections.push(frontmatter.trim());
    }

    sections.push(`${PLX_MARKERS.start}\n${body}\n${PLX_MARKERS.end}`);
    await FileSystemUtils.writeFile(archivePath, sections.join('\n') + '\n');
    return true;
  }
}
