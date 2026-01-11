import path from 'path';
import chalk from 'chalk';
import { FileSystemUtils } from '../utils/file-system.js';
import { migrateOpenSpecProject } from '../utils/openspec-migration.js';
import { migrateRootFiles } from '../utils/root-files-migration.js';
import { PLX_DIR_NAME } from './config.js';
import { ToolRegistry } from './configurators/registry.js';
import { SlashCommandRegistry } from './configurators/slash/registry.js';
import { agentsTemplate } from './templates/agents-template.js';
import { TemplateManager } from './templates/index.js';

export class UpdateCommand {
  async execute(projectPath: string): Promise<void> {
    const resolvedProjectPath = path.resolve(projectPath);

    // Migrate legacy OpenSpec projects if detected
    const migrationResult = await migrateOpenSpecProject(resolvedProjectPath);
    if (migrationResult.migrated) {
      const parts: string[] = [];
      if (migrationResult.directoryMigrated) {
        parts.push('Renamed openspec/ → workspace/');
      }
      if (migrationResult.markerFilesUpdated > 0) {
        parts.push(`Updated markers in ${migrationResult.markerFilesUpdated} file${migrationResult.markerFilesUpdated === 1 ? '' : 's'}`);
      }
      if (migrationResult.globalConfigMigrated) {
        parts.push('Migrated global config ~/.openspec/ → ~/.plx/');
      }
      if (migrationResult.globalToolFilesUpdated > 0) {
        parts.push(`Updated markers in ${migrationResult.globalToolFilesUpdated} global tool file${migrationResult.globalToolFilesUpdated === 1 ? '' : 's'}`);
      }
      console.log(chalk.green('Migrated legacy OpenSpec project:'), parts.join(', '));
    }
    if (migrationResult.errors.length > 0) {
      for (const error of migrationResult.errors) {
        console.log(chalk.yellow('Migration warning:'), error);
      }
    }

    const workspaceDirName = PLX_DIR_NAME;
    const workspacePath = path.join(resolvedProjectPath, workspaceDirName);

    // Migrate root files to workspace if detected (runs before workspace check since migration creates workspace)
    const rootFilesMigrationResult = await migrateRootFiles(resolvedProjectPath, workspacePath);
    if (rootFilesMigrationResult.migratedCount > 0) {
      const fileList = rootFilesMigrationResult.migratedFiles.length > 0 
        ? ` (${rootFilesMigrationResult.migratedFiles.join(', ')})`
        : '';
      console.log(chalk.green(`Migrated ${rootFilesMigrationResult.migratedCount} root file${rootFilesMigrationResult.migratedCount === 1 ? '' : 's'} to workspace${fileList}`));
    }
    if (rootFilesMigrationResult.errors.length > 0) {
      for (const error of rootFilesMigrationResult.errors) {
        console.log(chalk.yellow('Migration warning:'), error);
      }
    }

    // 1. Check workspace directory exists (after migration which may have created it)
    if (!await FileSystemUtils.directoryExists(workspacePath)) {
      throw new Error(`No Pew Pew Plx workspace directory found. Run 'plx init' first.`);
    }

    // 2. Update AGENTS.md (full replacement)
    const agentsPath = path.join(workspacePath, 'AGENTS.md');

    await FileSystemUtils.writeFile(agentsPath, agentsTemplate);

    // 3. Create ARCHITECTURE.md if not exists
    const architecturePath = path.join(workspacePath, 'ARCHITECTURE.md');
    if (!(await FileSystemUtils.fileExists(architecturePath))) {
      const architectureContent = TemplateManager.getArchitectureTemplate();
      await FileSystemUtils.writeFile(architecturePath, architectureContent);
    }

    // 4. Create REVIEW.md if not exists
    const reviewPath = path.join(workspacePath, 'REVIEW.md');
    if (!(await FileSystemUtils.fileExists(reviewPath))) {
      const reviewContent = TemplateManager.getReviewTemplate();
      await FileSystemUtils.writeFile(reviewPath, reviewContent);
    }

    // 5. Create RELEASE.md if not exists
    const releasePath = path.join(workspacePath, 'RELEASE.md');
    if (!(await FileSystemUtils.fileExists(releasePath))) {
      const releaseContent = TemplateManager.getReleaseTemplate();
      await FileSystemUtils.writeFile(releasePath, releaseContent);
    }

    // 6. Create TESTING.md if not exists
    const testingPath = path.join(workspacePath, 'TESTING.md');
    if (!(await FileSystemUtils.fileExists(testingPath))) {
      const testingContent = TemplateManager.getTestingTemplate();
      await FileSystemUtils.writeFile(testingPath, testingContent);
    }

    // 7. Update existing AI tool configuration files only
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

    for (const slashConfigurator of slashConfigurators) {
      if (!slashConfigurator.isAvailable) {
        continue;
      }

      // Only process tools that have at least one existing slash command file
      const isConfigured = await slashConfigurator.hasAnyExisting(resolvedProjectPath);
      if (!isConfigured) {
        continue;
      }

      try {
        const updated = await slashConfigurator.generateAll(
          resolvedProjectPath
        );
        updatedSlashFiles.push(...updated);
      } catch (error) {
        failedSlashTools.push(slashConfigurator.toolId);
        console.error(
          `Failed to update slash commands for ${slashConfigurator.toolId}: ${
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
      `Updated Pew Pew Plx instructions (${instructionFiles.join(', ')})`
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
