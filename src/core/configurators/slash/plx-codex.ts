import path from 'path';
import os from 'os';
import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId, TemplateManager } from '../../templates/index.js';
import { FileSystemUtils } from '../../../utils/file-system.js';
import { PLX_MARKERS } from '../../config.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.codex/prompts/plx-init-architecture.md',
  'update-architecture': '.codex/prompts/plx-update-architecture.md',
  'get-task': '.codex/prompts/plx-get-task.md',
  'compact': '.codex/prompts/plx-compact.md',
  'review': '.codex/prompts/plx-review.md',
  'refine-architecture': '.codex/prompts/plx-refine-architecture.md',
  'refine-review': '.codex/prompts/plx-refine-review.md',
  'parse-feedback': '.codex/prompts/plx-parse-feedback.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
description: Generate comprehensive ARCHITECTURE.md from codebase analysis.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'update-architecture': `---
description: Refresh ARCHITECTURE.md based on current codebase state.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'get-task': `---
description: Select and display the next prioritized task to work on.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'compact': `---
description: Preserve session progress in PROGRESS.md for context continuity.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-review': `---
description: Create or update REVIEW.md.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
argument-hint: (optional context)
---

$ARGUMENTS`
};

export class PlxCodexSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'codex';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }

  private getGlobalPromptsDir(): string {
    const home = (process.env.CODEX_HOME && process.env.CODEX_HOME.trim())
      ? process.env.CODEX_HOME.trim()
      : FileSystemUtils.joinPath(os.homedir(), '.codex');
    return FileSystemUtils.joinPath(home, 'prompts');
  }

  async generateAll(_projectPath: string): Promise<string[]> {
    const createdOrUpdated: string[] = [];
    for (const target of this.getTargets()) {
      const body = TemplateManager.getPlxSlashCommandBody(target.id).trim();
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

  async updateExisting(_projectPath: string): Promise<string[]> {
    const updated: string[] = [];
    for (const target of this.getTargets()) {
      const promptsDir = this.getGlobalPromptsDir();
      const filePath = FileSystemUtils.joinPath(
        promptsDir,
        path.basename(target.path)
      );
      if (await FileSystemUtils.fileExists(filePath)) {
        const body = TemplateManager.getPlxSlashCommandBody(target.id).trim();
        await this.updateFullFile(filePath, target.id, body);
        updated.push(target.path);
      }
    }
    return updated;
  }

  private async updateFullFile(filePath: string, id: PlxSlashCommandId, body: string): Promise<void> {
    const content = await FileSystemUtils.readFile(filePath);
    const startIndex = content.indexOf(PLX_MARKERS.start);
    const endIndex = content.indexOf(PLX_MARKERS.end);

    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      throw new Error(`Missing PLX markers in ${filePath}`);
    }

    const frontmatter = this.getFrontmatter(id);
    const sections: string[] = [];
    if (frontmatter) sections.push(frontmatter.trim());
    sections.push(`${PLX_MARKERS.start}\n${body}\n${PLX_MARKERS.end}`);

    await FileSystemUtils.writeFile(filePath, sections.join('\n') + '\n');
  }

  resolveAbsolutePath(_projectPath: string, id: PlxSlashCommandId): string {
    const promptsDir = this.getGlobalPromptsDir();
    const fileName = path.basename(FILE_PATHS[id]);
    return FileSystemUtils.joinPath(promptsDir, fileName);
  }
}
