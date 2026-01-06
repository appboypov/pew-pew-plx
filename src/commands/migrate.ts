import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import { FileSystemUtils } from '../utils/file-system.js';
import { buildTaskFilename, parseTaskFilename } from '../utils/task-file-parser.js';
import { MarkdownParser } from '../core/parsers/markdown-parser.js';
import { TASKS_DIR_NAME } from '../core/config.js';

interface MigrateTasksOptions {
  dryRun?: boolean;
  json?: boolean;
}

interface MigratedTask {
  from: string;
  to: string;
}

interface SkippedTask {
  from: string;
  reason: string;
}

interface TaskError {
  from: string;
  error: string;
}

interface WorkspaceMigrationResult {
  path: string;
  migrated: MigratedTask[];
  skipped: SkippedTask[];
  errors: TaskError[];
}

interface MigrationSummary {
  totalFound: number;
  migrated: number;
  skipped: number;
  errors: number;
}

interface MigrationResult {
  success: boolean;
  workspaces: WorkspaceMigrationResult[];
  summary: MigrationSummary;
}

export class MigrateCommand {
  async tasks(options: MigrateTasksOptions = {}): Promise<void> {
    const workspaces = await getFilteredWorkspaces(process.cwd());

    if (workspaces.length === 0) {
      if (options.json) {
        console.log(JSON.stringify({ error: 'No workspace found' }));
      } else {
        ora().fail('No workspace found. Run plx init first.');
      }
      process.exitCode = 1;
      return;
    }

    const result: MigrationResult = {
      success: true,
      workspaces: [],
      summary: {
        totalFound: 0,
        migrated: 0,
        skipped: 0,
        errors: 0,
      },
    };

    if (!options.json) {
      console.log(chalk.bold('\nMigrating tasks to centralized storage...\n'));
    }

    for (const workspace of workspaces) {
      const workspaceResult = await this.migrateWorkspaceTasks(
        workspace.path,
        workspace.projectName,
        options
      );
      result.workspaces.push(workspaceResult);

      result.summary.totalFound += workspaceResult.migrated.length + workspaceResult.skipped.length + workspaceResult.errors.length;
      result.summary.migrated += workspaceResult.migrated.length;
      result.summary.skipped += workspaceResult.skipped.length;
      result.summary.errors += workspaceResult.errors.length;
    }

    if (result.summary.errors > 0) {
      result.success = false;
    }

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      this.printConsoleSummary(result);
    }

    if (!result.success) {
      process.exitCode = 1;
    }
  }

  private async migrateWorkspaceTasks(
    workspacePath: string,
    projectName: string,
    options: MigrateTasksOptions
  ): Promise<WorkspaceMigrationResult> {
    const result: WorkspaceMigrationResult = {
      path: path.relative(process.cwd(), workspacePath),
      migrated: [],
      skipped: [],
      errors: [],
    };

    if (!options.json) {
      console.log(chalk.dim(`Workspace: ${result.path}`));
    }

    const changesDir = path.join(workspacePath, 'changes');
    const reviewsDir = path.join(workspacePath, 'reviews');

    if (await FileSystemUtils.directoryExists(changesDir)) {
      await this.migrateParentTypeTasks(
        changesDir,
        'change',
        workspacePath,
        result,
        options
      );
    }

    if (await FileSystemUtils.directoryExists(reviewsDir)) {
      await this.migrateParentTypeTasks(
        reviewsDir,
        'review',
        workspacePath,
        result,
        options
      );
    }

    return result;
  }

  private async migrateParentTypeTasks(
    parentTypeDir: string,
    parentType: 'change' | 'review',
    workspacePath: string,
    result: WorkspaceMigrationResult,
    options: MigrateTasksOptions
  ): Promise<void> {
    let parentDirs: string[] = [];
    try {
      const entries = await fs.readdir(parentTypeDir, { withFileTypes: true });
      parentDirs = entries.filter(e => e.isDirectory()).map(e => e.name);
    } catch {
      return;
    }

    for (const parentDirName of parentDirs) {
      const parentPath = path.join(parentTypeDir, parentDirName);
      const tasksDir = path.join(parentPath, 'tasks');

      if (!(await FileSystemUtils.directoryExists(tasksDir))) {
        continue;
      }

      let taskFiles: string[] = [];
      try {
        const files = await fs.readdir(tasksDir);
        taskFiles = files.filter(f => f.endsWith('.md') && /^\d{3}-/.test(f));
      } catch {
        continue;
      }

      for (const taskFile of taskFiles) {
        const taskPath = path.join(tasksDir, taskFile);
        await this.migrateTaskFile(
          taskPath,
          taskFile,
          parentDirName,
          parentType,
          workspacePath,
          result,
          options
        );
      }

      if (!options.dryRun && taskFiles.length > 0) {
        await this.cleanupEmptyDirectory(tasksDir);
      }
    }
  }

  private async migrateTaskFile(
    taskPath: string,
    taskFile: string,
    parentId: string,
    parentType: 'change' | 'review',
    workspacePath: string,
    result: WorkspaceMigrationResult,
    options: MigrateTasksOptions
  ): Promise<void> {
    const fromRelative = path.relative(process.cwd(), taskPath);

    try {
      const content = await FileSystemUtils.readFile(taskPath);
      const parsed = parseTaskFilename(taskFile);

      if (!parsed) {
        result.skipped.push({
          from: fromRelative,
          reason: 'Invalid task filename format',
        });
        return;
      }

      const { sequence, name } = parsed;
      const newFilename = buildTaskFilename({ sequence, parentId, name });
      const centralTasksDir = path.join(workspacePath, TASKS_DIR_NAME);
      const newTaskPath = path.join(centralTasksDir, newFilename);
      const toRelative = path.relative(process.cwd(), newTaskPath);

      if (await FileSystemUtils.fileExists(newTaskPath)) {
        result.skipped.push({
          from: fromRelative,
          reason: `Target already exists: ${toRelative}`,
        });
        return;
      }

      const updatedContent = MarkdownParser.updateFrontmatter(content, {
        parentType,
        parentId,
      });

      if (!options.dryRun) {
        await FileSystemUtils.createDirectory(centralTasksDir);
        await FileSystemUtils.writeFile(newTaskPath, updatedContent);
        await fs.unlink(taskPath);
      }

      result.migrated.push({
        from: fromRelative,
        to: toRelative,
      });

      if (!options.json) {
        console.log(chalk.green(`  ✓ ${newFilename}`) + chalk.dim(` (from ${fromRelative})`));
      }
    } catch (error) {
      result.errors.push({
        from: fromRelative,
        error: (error as Error).message,
      });

      if (!options.json) {
        console.log(chalk.red(`  ✗ ${taskFile}`) + chalk.dim(` (error: ${(error as Error).message})`));
      }
    }
  }

  private async cleanupEmptyDirectory(dirPath: string): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath);
      if (entries.length === 0) {
        await fs.rmdir(dirPath);
      }
    } catch {
      // Directory might not be empty or already deleted
    }
  }

  private printConsoleSummary(result: MigrationResult): void {
    console.log();
    console.log(chalk.bold('Migration complete:'));
    console.log(`  Total found: ${result.summary.totalFound}`);
    console.log(chalk.green(`  Migrated: ${result.summary.migrated}`));

    if (result.summary.skipped > 0) {
      console.log(chalk.yellow(`  Skipped: ${result.summary.skipped}`));
    } else {
      console.log(chalk.dim(`  Skipped: ${result.summary.skipped}`));
    }

    if (result.summary.errors > 0) {
      console.log(chalk.red(`  Errors: ${result.summary.errors}`));
    } else {
      console.log(chalk.dim(`  Errors: ${result.summary.errors}`));
    }

    console.log();
  }
}
