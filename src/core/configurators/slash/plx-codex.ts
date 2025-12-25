import path from 'path';
import os from 'os';
import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId, TemplateManager } from '../../templates/index.js';
import { FileSystemUtils } from '../../../utils/file-system.js';
import { OPENSPEC_MARKERS } from '../../config.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.codex/prompts/plx-init-architecture.md',
  'update-architecture': '.codex/prompts/plx-update-architecture.md',
  'act-next': '.codex/prompts/plx-act-next.md'
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
  'act-next': `---
description: Select and display the next prioritized task to work on.
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
        sections.push(`${OPENSPEC_MARKERS.start}\n${body}\n${OPENSPEC_MARKERS.end}`);
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
    const startIndex = content.indexOf(OPENSPEC_MARKERS.start);
    const endIndex = content.indexOf(OPENSPEC_MARKERS.end);

    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      throw new Error(`Missing OpenSpec markers in ${filePath}`);
    }

    const frontmatter = this.getFrontmatter(id);
    const sections: string[] = [];
    if (frontmatter) sections.push(frontmatter.trim());
    sections.push(`${OPENSPEC_MARKERS.start}\n${body}\n${OPENSPEC_MARKERS.end}`);

    await FileSystemUtils.writeFile(filePath, sections.join('\n') + '\n');
  }

  resolveAbsolutePath(_projectPath: string, id: PlxSlashCommandId): string {
    const promptsDir = this.getGlobalPromptsDir();
    const fileName = path.basename(FILE_PATHS[id]);
    return FileSystemUtils.joinPath(promptsDir, fileName);
  }
}
