import path from 'path';
import { FileSystemUtils } from '../utils/file-system.js';
import { PLX_DIR_NAME } from './config.js';
import { ToolRegistry } from './configurators/registry.js';
import { SlashCommandRegistry } from './configurators/slash/registry.js';
import { PlxSlashCommandRegistry } from './configurators/slash/plx-registry.js';
import { agentsTemplate } from './templates/agents-template.js';
import { TemplateManager } from './templates/index.js';

export class UpdateCommand {
  async execute(projectPath: string): Promise<void> {
    const resolvedProjectPath = path.resolve(projectPath);
    const workspaceDirName = PLX_DIR_NAME;
    const workspacePath = path.join(resolvedProjectPath, workspaceDirName);

    // 1. Check workspace directory exists
    if (!await FileSystemUtils.directoryExists(workspacePath)) {
      throw new Error(`No PLX workspace directory found. Run 'plx init' first.`);
    }

    // 2. Update AGENTS.md (full replacement)
    const agentsPath = path.join(workspacePath, 'AGENTS.md');

    await FileSystemUtils.writeFile(agentsPath, agentsTemplate);

    // 3. Create REVIEW.md if not exists
    const reviewPath = path.join(resolvedProjectPath, 'REVIEW.md');
    if (!(await FileSystemUtils.fileExists(reviewPath))) {
      const reviewContent = TemplateManager.getReviewTemplate();
      await FileSystemUtils.writeFile(reviewPath, reviewContent);
    }

    // 4. Update existing AI tool configuration files only
    const configurators = ToolRegistry.getAll();
    const slashConfigurators = SlashCommandRegistry.getAll();
    const updatedFiles: string[] = [];
    const createdFiles: string[] = [];
    const failedFiles: string[] = [];
    const updatedSlashFiles: string[] = [];
    const failedSlashTools: string[] = [];

    for (const configurator of configurators) {
      const configFilePath = path.join(
        resolvedProjectPath,
        configurator.configFileName
      );
      const fileExists = await FileSystemUtils.fileExists(configFilePath);
      const shouldConfigure =
        fileExists || configurator.configFileName === 'AGENTS.md';

      if (!shouldConfigure) {
        continue;
      }

      try {
        if (fileExists && !await FileSystemUtils.canWriteFile(configFilePath)) {
          throw new Error(
            `Insufficient permissions to modify ${configurator.configFileName}`
          );
        }

        await configurator.configure(resolvedProjectPath, workspacePath);
        updatedFiles.push(configurator.configFileName);

        if (!fileExists) {
          createdFiles.push(configurator.configFileName);
        }
      } catch (error) {
        failedFiles.push(configurator.configFileName);
        console.error(
          `Failed to update ${configurator.configFileName}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    const updatedToolIds = new Set<string>();

    for (const slashConfigurator of slashConfigurators) {
      if (!slashConfigurator.isAvailable) {
        continue;
      }

      try {
        const updated = await slashConfigurator.updateExisting(
          resolvedProjectPath,
          workspacePath
        );
        updatedSlashFiles.push(...updated);
        if (updated.length > 0) {
          updatedToolIds.add(slashConfigurator.toolId);
        }
      } catch (error) {
        failedSlashTools.push(slashConfigurator.toolId);
        console.error(
          `Failed to update slash commands for ${slashConfigurator.toolId}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    for (const plxConfigurator of PlxSlashCommandRegistry.getAll()) {
      if (!plxConfigurator.isAvailable) {
        continue;
      }
      if (!updatedToolIds.has(plxConfigurator.toolId)) {
        continue;
      }

      try {
        const updated = await plxConfigurator.generateAll(resolvedProjectPath);
        updatedSlashFiles.push(...updated);
      } catch (error) {
        failedSlashTools.push(plxConfigurator.toolId);
        console.error(
          `Failed to generate PLX commands for ${plxConfigurator.toolId}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    const summaryParts: string[] = [];
    const instructionFiles: string[] = ['workspace/AGENTS.md'];

    if (updatedFiles.includes('AGENTS.md')) {
      instructionFiles.push(
        createdFiles.includes('AGENTS.md') ? 'AGENTS.md (created)' : 'AGENTS.md'
      );
    }

    summaryParts.push(
      `Updated PLX instructions (${instructionFiles.join(', ')})`
    );

    const aiToolFiles = updatedFiles.filter((file) => file !== 'AGENTS.md');
    if (aiToolFiles.length > 0) {
      summaryParts.push(`Updated AI tool files: ${aiToolFiles.join(', ')}`);
    }

    if (updatedSlashFiles.length > 0) {
      // Normalize to forward slashes for cross-platform log consistency
      const normalized = updatedSlashFiles.map((p) => p.replace(/\\/g, '/'));
      summaryParts.push(`Updated slash commands: ${normalized.join(', ')}`);
    }

    const failedItems = [
      ...failedFiles,
      ...failedSlashTools.map(
        (toolId) => `slash command refresh (${toolId})`
      ),
    ];

    if (failedItems.length > 0) {
      summaryParts.push(`Failed to update: ${failedItems.join(', ')}`);
    }

    console.log(summaryParts.join(' | '));

    // No additional notes
  }
}
