import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { getTaskProgressForChange } from '../utils/task-progress.js';
import { MarkdownParser } from './parsers/markdown-parser.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import { isMultiWorkspace, DiscoveredWorkspace } from '../utils/workspace-discovery.js';

interface ChangeData {
  name: string;
  displayName: string;
  progress: { total: number; completed: number };
  projectName?: string;
}

interface SpecData {
  name: string;
  displayName: string;
  requirementCount: number;
  projectName?: string;
}

export class ViewCommand {
  async execute(targetPath: string = '.'): Promise<void> {
    const resolvedPath = path.resolve(targetPath);
    const workspaces = await getFilteredWorkspaces(resolvedPath);
    const isMulti = isMultiWorkspace(workspaces);

    if (workspaces.length === 0) {
      console.error(chalk.red('No workspace directory found'));
      process.exit(1);
    }

    console.log(chalk.bold('\nPew Pew Plx Dashboard\n'));
    console.log('═'.repeat(60));

    // Get changes and specs data across all workspaces
    const changesData = await this.getChangesData(workspaces, isMulti);
    const specsData = await this.getSpecsData(workspaces, isMulti);

    // Display summary metrics
    this.displaySummary(changesData, specsData);

    // Display active changes
    if (changesData.active.length > 0) {
      console.log(chalk.bold.cyan('\nActive Changes'));
      console.log('─'.repeat(60));
      changesData.active.forEach(change => {
        const progressBar = this.createProgressBar(change.progress.completed, change.progress.total);
        const percentage = change.progress.total > 0
          ? Math.round((change.progress.completed / change.progress.total) * 100)
          : 0;

        console.log(
          `  ${chalk.yellow('◉')} ${chalk.bold(change.displayName.padEnd(30))} ${progressBar} ${chalk.dim(`${percentage}%`)}`
        );
      });
    }

    // Display completed changes
    if (changesData.completed.length > 0) {
      console.log(chalk.bold.green('\nCompleted Changes'));
      console.log('─'.repeat(60));
      changesData.completed.forEach(change => {
        console.log(`  ${chalk.green('✓')} ${change.displayName}`);
      });
    }

    // Display specifications
    if (specsData.length > 0) {
      console.log(chalk.bold.blue('\nSpecifications'));
      console.log('─'.repeat(60));

      // Sort specs by requirement count (descending)
      specsData.sort((a, b) => b.requirementCount - a.requirementCount);

      specsData.forEach(spec => {
        const reqLabel = spec.requirementCount === 1 ? 'requirement' : 'requirements';
        console.log(
          `  ${chalk.blue('▪')} ${chalk.bold(spec.displayName.padEnd(30))} ${chalk.dim(`${spec.requirementCount} ${reqLabel}`)}`
        );
      });
    }

    console.log('\n' + '═'.repeat(60));
    console.log(chalk.dim(`\nUse ${chalk.white('plx get changes')} or ${chalk.white('plx get specs')} for detailed views`));
  }

  private async getChangesData(
    workspaces: DiscoveredWorkspace[],
    isMulti: boolean
  ): Promise<{
    active: ChangeData[];
    completed: Array<{ name: string; displayName: string }>;
  }> {
    const active: ChangeData[] = [];
    const completed: Array<{ name: string; displayName: string }> = [];

    // Scan each workspace for changes directories
    for (const workspace of workspaces) {
      const changesDir = path.join(workspace.path, 'changes');

      if (!fs.existsSync(changesDir)) {
        continue;
      }

      const entries = fs.readdirSync(changesDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'archive') {
          const progress = await getTaskProgressForChange(changesDir, entry.name);
          const displayName = isMulti && workspace.projectName
            ? `${workspace.projectName}/${entry.name}`
            : entry.name;

          if (progress.total === 0 || progress.completed === progress.total) {
            completed.push({ name: entry.name, displayName });
          } else {
            active.push({
              name: entry.name,
              displayName,
              progress,
              projectName: workspace.projectName,
            });
          }
        }
      }
    }

    // Sort active changes by completion percentage (ascending) and then by name for deterministic ordering
    active.sort((a, b) => {
      const percentageA = a.progress.total > 0 ? a.progress.completed / a.progress.total : 0;
      const percentageB = b.progress.total > 0 ? b.progress.completed / b.progress.total : 0;

      if (percentageA < percentageB) return -1;
      if (percentageA > percentageB) return 1;
      return a.displayName.localeCompare(b.displayName);
    });
    completed.sort((a, b) => a.displayName.localeCompare(b.displayName));

    return { active, completed };
  }

  private async getSpecsData(
    workspaces: DiscoveredWorkspace[],
    isMulti: boolean
  ): Promise<SpecData[]> {
    const specs: SpecData[] = [];

    // Scan each workspace for specs directories
    for (const workspace of workspaces) {
      const specsDir = path.join(workspace.path, 'specs');

      if (!fs.existsSync(specsDir)) {
        continue;
      }

      const entries = fs.readdirSync(specsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const specFile = path.join(specsDir, entry.name, 'spec.md');
          const displayName = isMulti && workspace.projectName
            ? `${workspace.projectName}/${entry.name}`
            : entry.name;

          if (fs.existsSync(specFile)) {
            try {
              const content = fs.readFileSync(specFile, 'utf-8');
              const parser = new MarkdownParser(content);
              const spec = parser.parseSpec(entry.name);
              specs.push({
                name: entry.name,
                displayName,
                requirementCount: spec.requirements.length,
                projectName: workspace.projectName,
              });
            } catch {
              specs.push({
                name: entry.name,
                displayName,
                requirementCount: 0,
                projectName: workspace.projectName,
              });
            }
          }
        }
      }
    }

    return specs;
  }

  private displaySummary(
    changesData: { active: ChangeData[]; completed: Array<{ name: string; displayName: string }> },
    specsData: SpecData[]
  ): void {
    const totalChanges = changesData.active.length + changesData.completed.length;
    const totalSpecs = specsData.length;
    const totalRequirements = specsData.reduce((sum, spec) => sum + spec.requirementCount, 0);
    
    // Calculate total task progress
    let totalTasks = 0;
    let completedTasks = 0;
    
    changesData.active.forEach(change => {
      totalTasks += change.progress.total;
      completedTasks += change.progress.completed;
    });
    
    changesData.completed.forEach(() => {
      // Completed changes count as 100% done (we don't know exact task count)
      // This is a simplification
    });

    console.log(chalk.bold('Summary:'));
    console.log(`  ${chalk.cyan('●')} Specifications: ${chalk.bold(totalSpecs)} specs, ${chalk.bold(totalRequirements)} requirements`);
    console.log(`  ${chalk.yellow('●')} Active Changes: ${chalk.bold(changesData.active.length)} in progress`);
    console.log(`  ${chalk.green('●')} Completed Changes: ${chalk.bold(changesData.completed.length)}`);
    
    if (totalTasks > 0) {
      const overallProgress = Math.round((completedTasks / totalTasks) * 100);
      console.log(`  ${chalk.magenta('●')} Task Progress: ${chalk.bold(`${completedTasks}/${totalTasks}`)} (${overallProgress}% complete)`);
    }
  }

  private createProgressBar(completed: number, total: number, width: number = 20): string {
    if (total === 0) return chalk.dim('─'.repeat(width));
    
    const percentage = completed / total;
    const filled = Math.round(percentage * width);
    const empty = width - filled;
    
    const filledBar = chalk.green('█'.repeat(filled));
    const emptyBar = chalk.dim('░'.repeat(empty));
    
    return `[${filledBar}${emptyBar}]`;
  }
}