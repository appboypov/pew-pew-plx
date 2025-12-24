import { FileSystemUtils } from '../../../utils/file-system.js';
import { OPENSPEC_MARKERS } from '../../config.js';
import { TemplateManager, PlxSlashCommandId } from '../../templates/index.js';

export interface PlxSlashCommandTarget {
  id: PlxSlashCommandId;
  path: string;
  kind: 'slash';
}

export const ALL_PLX_COMMANDS: PlxSlashCommandId[] = ['init-architecture', 'update-architecture'];

export abstract class PlxSlashCommandConfigurator {
  abstract readonly toolId: string;
  abstract readonly isAvailable: boolean;

  getTargets(): PlxSlashCommandTarget[] {
    return ALL_PLX_COMMANDS.map((id) => ({
      id,
      path: this.getRelativePath(id),
      kind: 'slash'
    }));
  }

  async generateAll(projectPath: string): Promise<string[]> {
    const createdOrUpdated: string[] = [];

    for (const target of this.getTargets()) {
      const body = this.getBody(target.id);
      const filePath = FileSystemUtils.joinPath(projectPath, target.path);

      if (await FileSystemUtils.fileExists(filePath)) {
        await this.updateBody(filePath, body);
      } else {
        const frontmatter = this.getFrontmatter(target.id);
        const sections: string[] = [];
        if (frontmatter) {
          sections.push(frontmatter.trim());
        }
        sections.push(`${OPENSPEC_MARKERS.start}\n${body}\n${OPENSPEC_MARKERS.end}`);
        const content = sections.join('\n') + '\n';
        await FileSystemUtils.writeFile(filePath, content);
      }

      createdOrUpdated.push(target.path);
    }

    return createdOrUpdated;
  }

  async updateExisting(projectPath: string): Promise<string[]> {
    const updated: string[] = [];

    for (const target of this.getTargets()) {
      const filePath = FileSystemUtils.joinPath(projectPath, target.path);
      if (await FileSystemUtils.fileExists(filePath)) {
        const body = this.getBody(target.id);
        await this.updateBody(filePath, body);
        updated.push(target.path);
      }
    }

    return updated;
  }

  resolveAbsolutePath(projectPath: string, id: PlxSlashCommandId): string {
    const rel = this.getRelativePath(id);
    return FileSystemUtils.joinPath(projectPath, rel);
  }

  protected abstract getRelativePath(id: PlxSlashCommandId): string;
  protected abstract getFrontmatter(id: PlxSlashCommandId): string | undefined;

  protected getBody(id: PlxSlashCommandId): string {
    return TemplateManager.getPlxSlashCommandBody(id).trim();
  }

  protected async updateBody(filePath: string, body: string): Promise<void> {
    const content = await FileSystemUtils.readFile(filePath);
    const startIndex = content.indexOf(OPENSPEC_MARKERS.start);
    const endIndex = content.indexOf(OPENSPEC_MARKERS.end);

    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      throw new Error(`Missing OpenSpec markers in ${filePath}`);
    }

    const before = content.slice(0, startIndex + OPENSPEC_MARKERS.start.length);
    const after = content.slice(endIndex);
    const updatedContent = `${before}\n${body}\n${after}`;

    await FileSystemUtils.writeFile(filePath, updatedContent);
  }
}
