import { FileSystemUtils } from '../../../utils/file-system.js';
import { TemplateManager, SlashCommandId } from '../../templates/index.js';
import { PLX_MARKERS } from '../../config.js';

export interface SlashCommandTarget {
  id: SlashCommandId;
  path: string;
  kind: 'slash';
}

const ALL_COMMANDS: SlashCommandId[] = [
  'archive',
  'complete-task',
  'get-task',
  'implement',
  'orchestrate',
  'parse-feedback',
  'plan-proposal',
  'plan-request',
  'prepare-compact',
  'prepare-release',
  'refine-architecture',
  'refine-release',
  'refine-review',
  'refine-testing',
  'review',
  'sync-workspace',
  'test',
  'undo-task'
];

export abstract class SlashCommandConfigurator {
  abstract readonly toolId: string;
  abstract readonly isAvailable: boolean;

  getTargets(): SlashCommandTarget[] {
    return ALL_COMMANDS.map((id) => ({
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
        await this.updateFullFile(filePath, target.id, body);
      } else {
        const frontmatter = this.getFrontmatter(target.id);
        const sections: string[] = [];
        if (frontmatter) {
          sections.push(frontmatter.trim());
        }
        sections.push(`${PLX_MARKERS.start}\n${body}\n${PLX_MARKERS.end}`);
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
        await this.updateFullFile(filePath, target.id, body);
        updated.push(target.path);
      }
    }

    return updated;
  }

  async hasAnyExisting(projectPath: string): Promise<boolean> {
    for (const target of this.getTargets()) {
      const filePath = FileSystemUtils.joinPath(projectPath, target.path);
      if (await FileSystemUtils.fileExists(filePath)) {
        return true;
      }
    }
    return false;
  }

  protected abstract getRelativePath(id: SlashCommandId): string;
  protected abstract getFrontmatter(id: SlashCommandId): string | undefined;

  protected getBody(id: SlashCommandId): string {
    return TemplateManager.getSlashCommandBody(id).trim();
  }

  // Resolve absolute path for a given slash command target. Subclasses may override
  // to redirect to tool-specific locations (e.g., global directories).
  resolveAbsolutePath(projectPath: string, id: SlashCommandId): string {
    const rel = this.getRelativePath(id);
    return FileSystemUtils.joinPath(projectPath, rel);
  }

  protected async updateFullFile(filePath: string, id: SlashCommandId, body: string): Promise<void> {
    const content = await FileSystemUtils.readFile(filePath);
    const startIndex = content.indexOf(PLX_MARKERS.start);
    const endIndex = content.indexOf(PLX_MARKERS.end);

    if (startIndex === -1 || endIndex === -1) {
      throw new Error(`Missing PLX markers in ${filePath}`);
    }

    // Parse existing content structure
    const beforeMarker = content.slice(0, startIndex);
    const afterMarker = content.slice(endIndex + PLX_MARKERS.end.length);

    // Detect and strip existing YAML frontmatter from beforeMarker
    let customPreContent = beforeMarker;
    const frontmatterMatch = beforeMarker.match(/^---\n[\s\S]*?\n---\n?/);
    if (frontmatterMatch) {
      customPreContent = beforeMarker.slice(frontmatterMatch[0].length);
    }

    // Build new content: new frontmatter + preserved pre-content + new body + preserved post-content
    const newFrontmatter = this.getFrontmatter(id);
    const sections: string[] = [];
    if (newFrontmatter) sections.push(newFrontmatter.trim());
    if (customPreContent.trim()) sections.push(customPreContent.trimEnd());
    sections.push(`${PLX_MARKERS.start}\n${body}\n${PLX_MARKERS.end}`);

    let result = sections.join('\n');
    if (afterMarker.trim()) {
      result += afterMarker;
    } else {
      result += '\n';
    }

    await FileSystemUtils.writeFile(filePath, result);
  }
}
