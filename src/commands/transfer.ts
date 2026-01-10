import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import {
  TransferService,
  TransferPlan,
  TransferResult,
  TransferEntityType,
} from '../services/transfer-service.js';
import {
  discoverWorkspaces,
  DiscoveredWorkspace,
} from '../utils/workspace-discovery.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';

interface TransferOptions {
  id: string;
  source?: string;
  target?: string;
  targetName?: string;
  dryRun?: boolean;
  yes?: boolean;
  json?: boolean;
  noInteractive?: boolean;
  interactive?: boolean;
}

interface TransferJsonOutput {
  entityType: TransferEntityType;
  entityId: string;
  targetName: string;
  sourcePath: string;
  targetPath: string;
  requiresInit: boolean;
  filesToMove: Array<{ source: string; target: string; type: string }>;
  tasksToRenumber: Array<{
    oldFilename: string;
    newFilename: string;
    oldSequence: number;
    newSequence: number;
    parentIdUpdate?: { old: string; new: string };
  }>;
  conflicts: Array<{ type: string; id: string; existingPath: string }>;
  dryRun: boolean;
  result?: {
    success: boolean;
    movedFiles: string[];
    renamedTasks: string[];
    errors: string[];
  };
}

export class TransferCommand {
  private isInteractive(options: TransferOptions): boolean {
    if (options.noInteractive === true || options.interactive === false) {
      return false;
    }
    return process.stdin.isTTY !== false;
  }

  async transferChange(options: TransferOptions): Promise<void> {
    await this.executeTransfer('change', options);
  }

  async transferSpec(options: TransferOptions): Promise<void> {
    await this.executeTransfer('spec', options);
  }

  async transferTask(options: TransferOptions): Promise<void> {
    await this.executeTransfer('task', options);
  }

  async transferReview(options: TransferOptions): Promise<void> {
    await this.executeTransfer('review', options);
  }

  async transferRequest(options: TransferOptions): Promise<void> {
    await this.executeTransfer('request', options);
  }

  private async executeTransfer(
    entityType: TransferEntityType,
    options: TransferOptions
  ): Promise<void> {
    const spinner = ora();
    const interactive = this.isInteractive(options);

    try {
      // Resolve source workspace
      let sourcePath = options.source;
      if (!sourcePath) {
        sourcePath = process.cwd();
      }

      // Resolve target workspace
      let targetPath = options.target;
      if (!targetPath) {
        if (!interactive) {
          this.outputError(options.json, 'Target workspace path is required in non-interactive mode. Use --target <path>.');
          process.exitCode = 1;
          return;
        }

        // Interactive workspace selection
        const availableWorkspaces = await this.discoverTargetWorkspaces(sourcePath);
        if (availableWorkspaces.length === 0) {
          this.outputError(options.json, 'No other workspaces found. Use --target <path> to specify target.');
          process.exitCode = 1;
          return;
        }

        targetPath = await this.promptWorkspaceSelection(availableWorkspaces, 'Select target workspace:');
      }

      // Create transfer service and configure workspaces
      const service = await TransferService.create();
      await service.setSourceWorkspace(sourcePath);
      const { requiresInit } = await service.setTargetWorkspace(targetPath);

      // Build transfer plan
      if (!options.json) {
        spinner.start('Building transfer plan...');
      }

      const plan = await service.buildTransferPlan(
        entityType,
        options.id,
        options.targetName
      );

      if (!options.json) {
        spinner.stop();
      }

      // Check for conflicts
      if (plan.conflicts.length > 0) {
        this.outputConflicts(plan, options.json);
        process.exitCode = 1;
        return;
      }

      // Output plan
      if (options.dryRun || !options.yes) {
        this.outputPlan(plan, options.json, options.dryRun || false);
      }

      if (options.dryRun) {
        return;
      }

      // Confirm if not --yes
      if (!options.yes && interactive) {
        const confirmed = await this.confirmTransfer(plan);
        if (!confirmed) {
          if (!options.json) {
            console.log(chalk.yellow('Transfer cancelled.'));
          }
          return;
        }
      }

      // Initialize target workspace if needed
      if (plan.requiresInit) {
        if (!options.json) {
          spinner.start('Initializing target workspace...');
        }

        try {
          const sourceTools = await service.extractSourceToolConfig();
          await service.initializeTargetWorkspace(sourceTools);

          if (!options.json) {
            spinner.succeed('Target workspace initialized');
          }
        } catch (initError) {
          if (!options.json) {
            spinner.fail('Failed to initialize target workspace');
          }
          this.outputError(options.json, `Workspace initialization failed: ${(initError as Error).message}`);
          process.exitCode = 1;
          return;
        }
      }

      // Execute transfer
      if (!options.json) {
        spinner.start('Executing transfer...');
      }

      const result = await service.executeTransfer(plan, false);

      if (!options.json) {
        spinner.stop();
      }

      this.outputResult(plan, result, options.json);

      if (!result.success) {
        process.exitCode = 1;
      }
    } catch (error) {
      spinner.stop();
      this.outputError(options.json, (error as Error).message);
      process.exitCode = 1;
    }
  }

  private async discoverTargetWorkspaces(sourcePath: string): Promise<DiscoveredWorkspace[]> {
    const workspaces = await discoverWorkspaces(path.resolve(sourcePath));
    // Filter out the source workspace
    const sourceWorkspace = workspaces.find(w => w.isRoot);
    return workspaces.filter(w => w !== sourceWorkspace);
  }

  private async promptWorkspaceSelection(
    workspaces: DiscoveredWorkspace[],
    message: string
  ): Promise<string> {
    const { select } = await import('@inquirer/prompts');

    const choice = await select({
      message,
      choices: workspaces.map(w => ({
        name: w.projectName || w.relativePath,
        value: path.dirname(w.path), // Return parent directory (project root)
      })),
    });

    return choice;
  }

  private async confirmTransfer(plan: TransferPlan): Promise<boolean> {
    const { confirm } = await import('@inquirer/prompts');

    return confirm({
      message: `Transfer ${plan.entityType} "${plan.entityId}" to ${plan.targetPath}?`,
      default: true,
    });
  }

  private outputPlan(plan: TransferPlan, json: boolean | undefined, dryRun: boolean): void {
    if (json) {
      const output = this.buildJsonOutput(plan, dryRun);
      console.log(JSON.stringify(output, null, 2));
    } else {
      console.log(chalk.bold.cyan(`\n═══ Transfer Plan ═══\n`));
      console.log(`Entity: ${chalk.yellow(plan.entityType)} "${chalk.bold(plan.entityId)}"`);
      if (plan.targetName !== plan.entityId) {
        console.log(`Target name: ${chalk.bold(plan.targetName)}`);
      }
      console.log(`Source: ${chalk.dim(plan.sourcePath)}`);
      console.log(`Target: ${chalk.dim(plan.targetPath)}`);

      if (plan.requiresInit) {
        console.log(chalk.blue(`\n→ Target workspace will be initialized`));
      }

      if (plan.filesToMove.length > 0) {
        console.log(chalk.bold(`\nFiles to move (${plan.filesToMove.length}):`));
        for (const file of plan.filesToMove) {
          const relSource = path.relative(process.cwd(), file.sourcePath);
          const relTarget = path.relative(process.cwd(), file.targetPath);
          console.log(`  ${chalk.red('- ' + relSource)}`);
          console.log(`  ${chalk.green('+ ' + relTarget)}`);
        }
      }

      if (plan.tasksToRenumber.length > 0) {
        console.log(chalk.bold(`\nTasks to transfer (${plan.tasksToRenumber.length}):`));
        for (const task of plan.tasksToRenumber) {
          console.log(`  ${chalk.red(task.oldFilename)} → ${chalk.green(task.newFilename)}`);
          if (task.parentIdUpdate) {
            console.log(chalk.dim(`    parent-id: ${task.parentIdUpdate.old} → ${task.parentIdUpdate.new}`));
          }
        }
      }

      if (dryRun) {
        console.log(chalk.yellow('\n[Dry run - no changes made]'));
      }
      console.log();
    }
  }

  private outputConflicts(plan: TransferPlan, json: boolean | undefined): void {
    if (json) {
      const output = this.buildJsonOutput(plan, false);
      console.log(JSON.stringify(output, null, 2));
    } else {
      console.log(chalk.red.bold(`\n═══ Transfer Blocked: Conflicts Detected ═══\n`));

      for (const conflict of plan.conflicts) {
        if (conflict.type === 'entity') {
          console.log(chalk.red(`✗ Entity conflict: "${conflict.id}" already exists at ${conflict.existingPath}`));
        } else {
          console.log(chalk.red(`✗ Task conflict: "${conflict.id}" already exists at ${conflict.existingPath}`));
        }
      }

      console.log(chalk.yellow(`\nTo resolve:`));
      console.log(`  • Use ${chalk.bold('--target-name <name>')} to rename the entity`);
      console.log(`  • Or manually rename/remove conflicting items in target workspace`);
      console.log();
    }
  }

  private outputResult(
    plan: TransferPlan,
    result: TransferResult,
    json: boolean | undefined
  ): void {
    if (json) {
      const output = this.buildJsonOutput(plan, false, result);
      console.log(JSON.stringify(output, null, 2));
    } else {
      if (result.success) {
        console.log(chalk.green.bold(`\n✓ Transfer complete\n`));

        if (result.movedFiles.length > 0) {
          console.log(`Moved ${result.movedFiles.length} file(s)/directory(s)`);
        }
        if (result.renamedTasks.length > 0) {
          console.log(`Transferred ${result.renamedTasks.length} task(s)`);
        }
      } else {
        console.log(chalk.red.bold(`\n✗ Transfer failed\n`));
        for (const error of result.errors) {
          console.log(chalk.red(`  ${error}`));
        }
      }
      console.log();
    }
  }

  private outputError(json: boolean | undefined, message: string): void {
    if (json) {
      console.log(JSON.stringify({ error: message }, null, 2));
    } else {
      ora().fail(message);
    }
  }

  private buildJsonOutput(
    plan: TransferPlan,
    dryRun: boolean,
    result?: TransferResult
  ): TransferJsonOutput {
    const output: TransferJsonOutput = {
      entityType: plan.entityType,
      entityId: plan.entityId,
      targetName: plan.targetName,
      sourcePath: plan.sourcePath,
      targetPath: plan.targetPath,
      requiresInit: plan.requiresInit,
      filesToMove: plan.filesToMove.map(f => ({
        source: f.sourcePath,
        target: f.targetPath,
        type: f.type,
      })),
      tasksToRenumber: plan.tasksToRenumber.map(t => ({
        oldFilename: t.oldFilename,
        newFilename: t.newFilename,
        oldSequence: t.oldSequence,
        newSequence: t.newSequence,
        ...(t.parentIdUpdate && { parentIdUpdate: t.parentIdUpdate }),
      })),
      conflicts: plan.conflicts.map(c => ({
        type: c.type,
        id: c.id,
        existingPath: c.existingPath,
      })),
      dryRun,
    };

    if (result) {
      output.result = {
        success: result.success,
        movedFiles: result.movedFiles,
        renamedTasks: result.renamedTasks,
        errors: result.errors,
      };
    }

    return output;
  }
}
