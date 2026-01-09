import { FileSystemUtils } from '../../../utils/file-system.js';
import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';
import { PLX_MARKERS } from '../../config.js';

export abstract class TomlSlashCommandConfigurator extends SlashCommandConfigurator {
  protected getFrontmatter(_id: SlashCommandId): string | undefined {
    // TOML doesn't use separate frontmatter - it's all in one structure
    return undefined;
  }

  protected abstract getDescription(id: SlashCommandId): string;

  async generateAll(projectPath: string): Promise<string[]> {
    const createdOrUpdated: string[] = [];

    for (const target of this.getTargets()) {
      const body = this.getBody(target.id);
      const filePath = FileSystemUtils.joinPath(projectPath, target.path);

      if (await FileSystemUtils.fileExists(filePath)) {
        await this.updateFullFile(filePath, target.id, body);
      } else {
        const tomlContent = this.generateTOML(target.id, body);
        await FileSystemUtils.writeFile(filePath, tomlContent);
      }

      createdOrUpdated.push(target.path);
    }

    return createdOrUpdated;
  }

  private generateTOML(id: SlashCommandId, body: string): string {
    const description = this.getDescription(id);

    // TOML format with triple-quoted string for multi-line prompt
    // Markers are inside the prompt value
    return `description = "${description}"

prompt = """
${PLX_MARKERS.start}
${body}
${PLX_MARKERS.end}
"""
`;
  }

  // Override to regenerate full TOML content (description + body)
  protected async updateFullFile(filePath: string, id: SlashCommandId, body: string): Promise<void> {
    const content = await FileSystemUtils.readFile(filePath);
    const startIndex = content.indexOf(PLX_MARKERS.start);

    if (startIndex === -1) {
      throw new Error(`Missing PLX start marker in ${filePath}`);
    }

    const tomlContent = this.generateTOML(id, body);
    await FileSystemUtils.writeFile(filePath, tomlContent);
  }
}
