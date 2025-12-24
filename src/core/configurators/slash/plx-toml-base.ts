import { FileSystemUtils } from '../../../utils/file-system.js';
import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';
import { OPENSPEC_MARKERS } from '../../config.js';

export abstract class PlxTomlSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  protected getFrontmatter(_id: PlxSlashCommandId): string | undefined {
    return undefined;
  }

  protected abstract getDescription(id: PlxSlashCommandId): string;

  async generateAll(projectPath: string): Promise<string[]> {
    const createdOrUpdated: string[] = [];

    for (const target of this.getTargets()) {
      const body = this.getBody(target.id);
      const filePath = FileSystemUtils.joinPath(projectPath, target.path);

      if (await FileSystemUtils.fileExists(filePath)) {
        await this.updateBody(filePath, body);
      } else {
        const tomlContent = this.generateTOML(target.id, body);
        await FileSystemUtils.writeFile(filePath, tomlContent);
      }

      createdOrUpdated.push(target.path);
    }

    return createdOrUpdated;
  }

  private generateTOML(id: PlxSlashCommandId, body: string): string {
    const description = this.getDescription(id);

    return `description = "${description}"

prompt = """
${OPENSPEC_MARKERS.start}
${body}
${OPENSPEC_MARKERS.end}
"""
`;
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
