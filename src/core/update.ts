import path from 'path';
import chalk from 'chalk';
import { FileSystemUtils } from '../utils/file-system.js';
import { migrateOpenSpecProject } from '../utils/openspec-migration.js';
import { migrateRootFiles } from '../utils/root-files-migration.js';
import { PLX_DIR_NAME } from './config.js';
import { ToolRegistry } from './configurators/registry.js';
import { SlashCommandRegistry } from './configurators/slash/registry.js';
import { getAgentsTemplate, TemplateManager } from './templates/index.js';
import { PALETTE } from './styles/palette.js';

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
        parts.push('Migrated global config ~/.openspec/ → ~/.splx/');
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
      throw new Error(`No OpenSplx workspace directory found. Run 'splx init' first.`);
    }

    // 2. Update AGENTS.md (full replacement)
    const agentsPath = path.join(workspacePath, 'AGENTS.md');
    await FileSystemUtils.writeFile(agentsPath, getAgentsTemplate());
    console.log(`${PALETTE.white('▌')} ${PALETTE.white(`Updated ${workspaceDirName}/AGENTS.md`)}`);

    // 3. Create workspace files if not exist
    const workspaceFiles = [
      { name: 'ARCHITECTURE.md', getContent: () => TemplateManager.getArchitectureTemplate() },
      { name: 'REVIEW.md', getContent: () => TemplateManager.getReviewTemplate() },
      { name: 'RELEASE.md', getContent: () => TemplateManager.getReleaseTemplate() },
      { name: 'TESTING.md', getContent: () => TemplateManager.getTestingTemplate() },
    ];

    for (const file of workspaceFiles) {
      const filePath = path.join(workspacePath, file.name);
      const exists = await FileSystemUtils.fileExists(filePath);
      if (!exists) {
        await FileSystemUtils.writeFile(filePath, file.getContent());
        console.log(`${PALETTE.white('▌')} ${PALETTE.white(`Created ${workspaceDirName}/${file.name}`)}`);
      } else {
        console.log(`${PALETTE.midGray('▌')} ${PALETTE.midGray(`Skipped ${workspaceDirName}/${file.name} (exists)`)}`);
      }
    }

    // 7. Create templates directory and write task type templates if not exist
    const templatesDir = path.join(workspacePath, 'templates');
    await FileSystemUtils.createDirectory(templatesDir);
    const taskTypeTemplates = TemplateManager.getTaskTypeTemplates();
    let templatesCreated = 0;
    let templatesSkipped = 0;
    for (const typeTemplate of taskTypeTemplates) {
      const templatePath = path.join(templatesDir, typeTemplate.filename);
      if (!(await FileSystemUtils.fileExists(templatePath))) {
        await FileSystemUtils.writeFile(templatePath, typeTemplate.content);
        templatesCreated++;
      } else {
        templatesSkipped++;
      }
    }
    if (templatesCreated > 0) {
      console.log(`${PALETTE.white('▌')} ${PALETTE.white(`Created ${workspaceDirName}/templates/ (${templatesCreated} task type templates)`)}`);
    }
    if (templatesSkipped > 0 && templatesCreated === 0) {
      console.log(`${PALETTE.midGray('▌')} ${PALETTE.midGray(`Skipped ${workspaceDirName}/templates/ (${templatesSkipped} templates exist)`)}`);
    }

    // 8. Update existing AI tool configuration files only
    const configurators = ToolRegistry.getAll();
    const slashConfigurators = SlashCommandRegistry.getAll();
    const failedFiles: string[] = [];
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

        // Log the root AGENTS.md stub
        if (configurator.configFileName === 'AGENTS.md') {
          if (fileExists) {
            console.log(`${PALETTE.white('▌')} ${PALETTE.white('Updated AGENTS.md')}`);
          } else {
            console.log(`${PALETTE.white('▌')} ${PALETTE.white('Created AGENTS.md')}`);
          }
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
        if (updated.length > 0) {
          const firstFile = updated[0];
          const toolDir = path.relative(resolvedProjectPath, path.dirname(firstFile));
          console.log(`${PALETTE.white('▌')} ${PALETTE.white(`Updated ${toolDir}/ (${updated.length} slash commands)`)}`);
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

    // Log any failures at the end
    const failedItems = [
      ...failedFiles,
      ...failedSlashTools.map(
        (toolId) => `slash command refresh (${toolId})`
      ),
    ];

    if (failedItems.length > 0) {
      console.log(chalk.red(`Failed to update: ${failedItems.join(', ')}`));
    }
  }
}
