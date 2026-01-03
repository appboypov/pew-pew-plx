import path from 'path';
import os from 'os';
import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId, TemplateManager } from '../../templates/index.js';
import { FileSystemUtils } from '../../../utils/file-system.js';
import { PLX_MARKERS } from '../../config.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.codex/prompts/plx-archive.md',
  'complete-task': '.codex/prompts/plx-complete-task.md',
  'get-task': '.codex/prompts/plx-get-task.md',
  'implement': '.codex/prompts/plx-implement.md',
  'orchestrate': '.codex/prompts/plx-orchestrate.md',
  'parse-feedback': '.codex/prompts/plx-parse-feedback.md',
  'plan-proposal': '.codex/prompts/plx-plan-proposal.md',
  'plan-request': '.codex/prompts/plx-plan-request.md',
  'prepare-compact': '.codex/prompts/plx-prepare-compact.md',
  'prepare-release': '.codex/prompts/plx-prepare-release.md',
  'refine-architecture': '.codex/prompts/plx-refine-architecture.md',
  'refine-release': '.codex/prompts/plx-refine-release.md',
  'refine-review': '.codex/prompts/plx-refine-review.md',
  'review': '.codex/prompts/plx-review.md',
  'sync-workspace': '.codex/prompts/plx-sync-workspace.md',
  'undo-task': '.codex/prompts/plx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
description: Archive a deployed PLX change and update specs.
argument-hint: change-id
---

$ARGUMENTS`,
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
argument-hint: change-id
---

$ARGUMENTS`,
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
argument-hint: request or feature description
---

$ARGUMENTS`,
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
  'review': `---
description: Review implementations against specs, changes, or tasks.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'sync-workspace': `---
description: Scan workspace state and suggest maintenance actions.
argument-hint: (optional change-id or task-id)
---

$ARGUMENTS`,
  'undo-task': `---
description: Revert a task to to-do.
argument-hint: task-id
---

$ARGUMENTS`
};

export class CodexSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'codex';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    return FRONTMATTER[id];
  }

  private getGlobalPromptsDir(): string {
    const home = (process.env.CODEX_HOME && process.env.CODEX_HOME.trim())
      ? process.env.CODEX_HOME.trim()
      : FileSystemUtils.joinPath(os.homedir(), '.codex');
    return FileSystemUtils.joinPath(home, 'prompts');
  }

  async generateAll(projectPath: string): Promise<string[]> {
    const createdOrUpdated: string[] = [];
    for (const target of this.getTargets()) {
      const body = TemplateManager.getSlashCommandBody(target.id).trim();
      const promptsDir = this.getGlobalPromptsDir();
      const filePath = FileSystemUtils.joinPath(
        promptsDir,
        path.basename(target.path)
      );

      await FileSystemUtils.createDirectory(path.dirname(filePath));

      if (await FileSystemUtils.fileExists(filePath)) {
        await this.updateFullFile(filePath, target.id, body);
      } else {
        const frontmatter = this.getFrontmatter(target.id);
        const sections: string[] = [];
        if (frontmatter) sections.push(frontmatter.trim());
        sections.push(`${PLX_MARKERS.start}\n${body}\n${PLX_MARKERS.end}`);
        await FileSystemUtils.writeFile(filePath, sections.join('\n') + '\n');
      }

      createdOrUpdated.push(target.path);
    }
    return createdOrUpdated;
  }

  async updateExisting(projectPath: string): Promise<string[]> {
    const updated: string[] = [];
    for (const target of this.getTargets()) {
      const promptsDir = this.getGlobalPromptsDir();
      const filePath = FileSystemUtils.joinPath(
        promptsDir,
        path.basename(target.path)
      );
      if (await FileSystemUtils.fileExists(filePath)) {
        const body = TemplateManager.getSlashCommandBody(target.id).trim();
        await this.updateFullFile(filePath, target.id, body);
        updated.push(target.path);
      }
    }
    return updated;
  }

  private async updateFullFile(filePath: string, id: SlashCommandId, body: string): Promise<void> {
    const content = await FileSystemUtils.readFile(filePath);
    const startIndex = content.indexOf(PLX_MARKERS.start);

    if (startIndex === -1) {
      throw new Error(`Missing PLX start marker in ${filePath}`);
    }

    const frontmatter = this.getFrontmatter(id);
    const sections: string[] = [];
    if (frontmatter) sections.push(frontmatter.trim());
    sections.push(`${PLX_MARKERS.start}\n${body}\n${PLX_MARKERS.end}`);

    await FileSystemUtils.writeFile(filePath, sections.join('\n') + '\n');
  }

  resolveAbsolutePath(_projectPath: string, id: SlashCommandId): string {
    const promptsDir = this.getGlobalPromptsDir();
    const fileName = path.basename(FILE_PATHS[id]);
    return FileSystemUtils.joinPath(promptsDir, fileName);
  }
}
