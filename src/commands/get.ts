import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import {
  getPrioritizedChange,
  PrioritizedChange,
} from '../utils/change-prioritization.js';
import {
  parseStatus,
  parseSkillLevel,
  setTaskStatus,
  TaskStatus,
  SkillLevel,
  completeTaskFully,
} from '../utils/task-status.js';
import { TaskFileInfo, countTasksFromContent } from '../utils/task-progress.js';
import { ItemRetrievalService, OpenTaskInfo } from '../services/item-retrieval.js';
import { ContentFilterService } from '../services/content-filter.js';
import { getTaskId } from '../services/task-id.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import {
  isMultiWorkspace,
  DiscoveredWorkspace,
} from '../utils/workspace-discovery.js';

interface TaskOptions {
  id?: string;
  didCompletePrevious?: boolean;
  constraints?: boolean;
  acceptanceCriteria?: boolean;
  json?: boolean;
}

interface ChangeOptions {
  id: string;
  json?: boolean;
}

interface SpecOptions {
  id: string;
  json?: boolean;
}

interface TasksOptions {
  id?: string;
  json?: boolean;
}

interface CompletedTaskInfo {
  id: string;
  completedItems: string[];
}

interface JsonOutput {
  changeId: string;
  workspacePath?: string;
  projectName?: string;
  displayId?: string;
  task: {
    id: string;
    filename: string;
    filepath: string;
    sequence: number;
    status: TaskStatus;
    skillLevel?: SkillLevel;
  } | null;
  taskContent: string | null;
  changeDocuments?: {
    proposal: string;
    design?: string;
  };
  completedTask?: CompletedTaskInfo;
  autoCompletedTask?: { id: string };
  transitionedToInProgress?: boolean;
  warning?: string;
}

export class GetCommand {
  private itemRetrievalService: ItemRetrievalService | null = null;
  private contentFilterService: ContentFilterService;
  private workspaces: DiscoveredWorkspace[] = [];
  private isMulti: boolean = false;

  constructor() {
    this.contentFilterService = new ContentFilterService();
  }

  private async ensureInitialized(): Promise<void> {
    if (this.itemRetrievalService) return;

    this.workspaces = await getFilteredWorkspaces(process.cwd());
    this.isMulti = isMultiWorkspace(this.workspaces);
    this.itemRetrievalService = await ItemRetrievalService.create(
      process.cwd(),
      this.workspaces
    );
  }

  private getDisplayId(projectName: string, itemId: string): string {
    if (!this.isMulti || !projectName) {
      return itemId;
    }
    return `${projectName}/${itemId}`;
  }

  async task(options: TaskOptions = {}): Promise<void> {
    await this.ensureInitialized();

    // Handle ID-based retrieval
    if (options.id) {
      await this.taskById(options);
      return;
    }

    // Find best prioritized change across all workspaces
    let prioritizedChange: PrioritizedChange | null = null;
    let currentWorkspace: DiscoveredWorkspace | null = null;

    for (const workspace of this.workspaces) {
      const changesPath = path.join(workspace.path, 'changes');
      const change = await getPrioritizedChange(changesPath);

      if (
        change &&
        (!prioritizedChange ||
          change.completionPercentage > prioritizedChange.completionPercentage)
      ) {
        prioritizedChange = change;
        currentWorkspace = workspace;
      }
    }

    if (!prioritizedChange || !currentWorkspace) {
      if (options.json) {
        console.log(JSON.stringify({ error: 'No active changes found' }));
      } else {
        ora().info('No active changes found');
      }
      return;
    }

    // Check if all tasks are complete
    if (!prioritizedChange.nextTask) {
      if (options.json) {
        console.log(
          JSON.stringify({
            changeId: prioritizedChange.id,
            workspacePath: currentWorkspace.path,
            projectName: currentWorkspace.projectName,
            displayId: this.getDisplayId(
              currentWorkspace.projectName,
              prioritizedChange.id
            ),
            task: null,
            taskContent: null,
            message: 'All tasks complete',
          })
        );
      } else {
        ora().succeed('All tasks complete');
      }
      return;
    }

    let warning: string | undefined;
    let nextTask: TaskFileInfo | null = prioritizedChange.nextTask;
    let completedTaskInfo: CompletedTaskInfo | undefined;
    let autoCompletedTaskInfo: { id: string } | undefined;

    // Check for auto-completion of in-progress task
    if (prioritizedChange.inProgressTask) {
      const inProgressContent = await fs.readFile(
        prioritizedChange.inProgressTask.filepath,
        'utf-8'
      );
      const progress = countTasksFromContent(inProgressContent);

      // Auto-complete if all checklist items are checked AND there's at least one item
      if (progress.total > 0 && progress.completed === progress.total) {
        // Mark in-progress task as done (checkboxes already checked)
        await setTaskStatus(prioritizedChange.inProgressTask.filepath, 'done');
        autoCompletedTaskInfo = {
          id: getTaskId(prioritizedChange.inProgressTask),
        };

        // Find and mark next to-do task as in-progress
        nextTask = await this.findNextTodoTask(prioritizedChange);
        if (nextTask) {
          await setTaskStatus(nextTask.filepath, 'in-progress');
        }
      }
    }

    if (options.didCompletePrevious) {
      // Handle --did-complete-previous flag
      if (prioritizedChange.inProgressTask) {
        // Complete the in-progress task with checkbox marking
        const completedItems = await completeTaskFully(
          prioritizedChange.inProgressTask.filepath
        );
        completedTaskInfo = {
          id: getTaskId(prioritizedChange.inProgressTask),
          completedItems,
        };

        // Find the next to-do task
        nextTask = await this.findNextTodoTask(prioritizedChange);

        if (nextTask) {
          // Mark next task as in-progress
          await setTaskStatus(nextTask.filepath, 'in-progress');
        }
      } else {
        // No in-progress task found
        warning = 'No in-progress task found';

        // Mark next to-do task as in-progress
        if (nextTask) {
          await setTaskStatus(nextTask.filepath, 'in-progress');
        }
      }
    }

    // Check again if we have a next task after transitions
    if (!nextTask) {
      // Current change is complete - check for other actionable changes across all workspaces
      let nextPrioritizedChange: PrioritizedChange | null = null;
      let nextWorkspace: DiscoveredWorkspace | null = null;

      for (const workspace of this.workspaces) {
        const changesPath = path.join(workspace.path, 'changes');
        const change = await getPrioritizedChange(changesPath);

        if (
          change &&
          change.nextTask &&
          (!nextPrioritizedChange ||
            change.completionPercentage > nextPrioritizedChange.completionPercentage)
        ) {
          nextPrioritizedChange = change;
          nextWorkspace = workspace;
        }
      }

      if (nextPrioritizedChange && nextWorkspace && nextPrioritizedChange.nextTask) {
        // Another change has pending work - update to use it
        prioritizedChange = nextPrioritizedChange;
        currentWorkspace = nextWorkspace;
        nextTask = nextPrioritizedChange.nextTask;
        // Continue to task output logic below (auto-transition handled there)
      } else {
        // Truly all tasks complete
        if (options.json) {
          const output: JsonOutput = {
            changeId: prioritizedChange.id,
            workspacePath: currentWorkspace.path,
            projectName: currentWorkspace.projectName,
            displayId: this.getDisplayId(
              currentWorkspace.projectName,
              prioritizedChange.id
            ),
            task: null,
            taskContent: null,
          };
          if (completedTaskInfo) {
            output.completedTask = completedTaskInfo;
          }
          if (autoCompletedTaskInfo) {
            output.autoCompletedTask = autoCompletedTaskInfo;
          }
          if (warning) {
            output.warning = warning;
          }
          console.log(
            JSON.stringify({ ...output, message: 'All tasks complete' }, null, 2)
          );
        } else {
          if (completedTaskInfo) {
            this.printCompletedTaskInfo(completedTaskInfo);
          }
          if (autoCompletedTaskInfo) {
            console.log(
              chalk.green(`\n✓ Auto-completed task: ${autoCompletedTaskInfo.id}\n`)
            );
          }
          if (warning) {
            ora().warn(warning);
          }
          ora().succeed('All tasks complete');
        }
        return;
      }
    }

    // Read task content and check status
    let taskContent = await fs.readFile(nextTask.filepath, 'utf-8');
    let taskStatus = parseStatus(taskContent);
    const skillLevel = parseSkillLevel(taskContent);
    let transitionedToInProgress = false;

    // Auto-transition to-do tasks to in-progress when retrieved
    if (taskStatus === 'to-do') {
      await setTaskStatus(nextTask.filepath, 'in-progress');
      taskStatus = 'in-progress';
      transitionedToInProgress = true;
      // Re-read content after status change
      taskContent = await fs.readFile(nextTask.filepath, 'utf-8');
    }

    // Apply content filtering if requested
    taskContent = this.applyContentFiltering(taskContent, options);

    const taskDisplayId = this.getDisplayId(
      currentWorkspace.projectName,
      `${prioritizedChange.id}/${getTaskId(nextTask)}`
    );

    if (options.json) {
      const output: JsonOutput = {
        changeId: prioritizedChange.id,
        workspacePath: currentWorkspace.path,
        projectName: currentWorkspace.projectName,
        displayId: this.getDisplayId(
          currentWorkspace.projectName,
          prioritizedChange.id
        ),
        task: {
          id: getTaskId(nextTask),
          filename: nextTask.filename,
          filepath: nextTask.filepath,
          sequence: nextTask.sequence,
          status: taskStatus,
          ...(skillLevel && { skillLevel }),
        },
        taskContent,
      };

      // Include change documents unless --did-complete-previous or auto-completed
      if (!options.didCompletePrevious && !autoCompletedTaskInfo) {
        output.changeDocuments = await this.readChangeDocuments(
          prioritizedChange.id,
          currentWorkspace.path
        );
      }

      if (completedTaskInfo) {
        output.completedTask = completedTaskInfo;
      }

      if (autoCompletedTaskInfo) {
        output.autoCompletedTask = autoCompletedTaskInfo;
      }

      if (transitionedToInProgress) {
        output.transitionedToInProgress = true;
      }

      if (warning) {
        output.warning = warning;
      }

      console.log(JSON.stringify(output, null, 2));
    } else {
      // Text output
      if (completedTaskInfo) {
        this.printCompletedTaskInfo(completedTaskInfo);
      }

      if (autoCompletedTaskInfo) {
        console.log(
          chalk.green(`\n✓ Auto-completed task: ${autoCompletedTaskInfo.id}\n`)
        );
      }

      if (transitionedToInProgress) {
        console.log(chalk.blue(`→ Transitioned to in-progress: ${taskDisplayId}`));
      }

      if (warning) {
        ora().warn(warning);
        console.log();
      }

      // Show change documents unless --did-complete-previous or auto-completed
      if (!options.didCompletePrevious && !autoCompletedTaskInfo) {
        await this.printChangeDocuments(prioritizedChange.id, currentWorkspace.path);
      }

      // Print task header with display ID in multi-workspace mode
      const headerTaskId = this.isMulti ? taskDisplayId : getTaskId(nextTask);
      const skillBadge = skillLevel ? ` [${this.formatSkillLevel(skillLevel)}]` : '';
      console.log(
        chalk.bold.cyan(`\n═══ Task ${nextTask.sequence}: ${headerTaskId}${skillBadge} ═══\n`)
      );
      console.log(taskContent);
    }
  }

  private formatSkillLevel(level: SkillLevel): string {
    switch (level) {
      case 'junior':
        return chalk.cyan('junior');
      case 'medior':
        return chalk.yellow('medior');
      case 'senior':
        return chalk.magenta('senior');
    }
  }

  private async taskById(options: TaskOptions): Promise<void> {
    const result = await this.itemRetrievalService!.getTaskById(options.id!);

    if (!result) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Task not found: ${options.id}` }));
      } else {
        ora().fail(`Task not found: ${options.id}`);
      }
      process.exitCode = 1;
      return;
    }

    const { task, content, changeId, workspacePath, projectName, displayId } =
      result;
    let taskStatus = parseStatus(content);
    let transitionedToInProgress = false;

    // Auto-transition to-do tasks to in-progress when retrieved
    if (taskStatus === 'to-do') {
      await setTaskStatus(task.filepath, 'in-progress');
      taskStatus = 'in-progress';
      transitionedToInProgress = true;
    }

    // Re-read content after potential status change
    const updatedContent = transitionedToInProgress
      ? await fs.readFile(task.filepath, 'utf-8')
      : content;

    const skillLevel = parseSkillLevel(updatedContent);

    // Apply content filtering if requested
    const filteredContent = this.applyContentFiltering(updatedContent, options);

    if (options.json) {
      const output: JsonOutput = {
        changeId,
        workspacePath,
        projectName,
        displayId,
        task: {
          id: getTaskId(task),
          filename: task.filename,
          filepath: task.filepath,
          sequence: task.sequence,
          status: taskStatus,
          ...(skillLevel && { skillLevel }),
        },
        taskContent: filteredContent,
      };
      if (transitionedToInProgress) {
        output.transitionedToInProgress = true;
      }
      console.log(JSON.stringify(output, null, 2));
    } else {
      const taskDisplayId = this.isMulti ? displayId : getTaskId(task);
      if (transitionedToInProgress) {
        console.log(chalk.blue(`\n→ Transitioned to in-progress: ${taskDisplayId}`));
      }
      const skillBadge = skillLevel ? ` [${this.formatSkillLevel(skillLevel)}]` : '';
      console.log(
        chalk.bold.cyan(`\n═══ Task ${task.sequence}: ${taskDisplayId}${skillBadge} ═══\n`)
      );
      console.log(filteredContent);
    }
  }

  private applyContentFiltering(content: string, options: TaskOptions): string {
    const sections: string[] = [];

    if (options.constraints) {
      sections.push('Constraints');
    }
    if (options.acceptanceCriteria) {
      sections.push('Acceptance Criteria');
    }

    if (sections.length === 0) {
      return content;
    }

    const filtered = this.contentFilterService.filterSections(content, sections);
    return filtered || content;
  }

  private printCompletedTaskInfo(info: CompletedTaskInfo): void {
    console.log(chalk.green(`\n✓ Completed task: ${info.id}`));
    if (info.completedItems.length > 0) {
      console.log(chalk.dim('  Marked complete:'));
      for (const item of info.completedItems) {
        console.log(chalk.dim(`    • ${item}`));
      }
    }
    console.log();
  }

  private async findNextTodoTask(
    change: PrioritizedChange
  ): Promise<TaskFileInfo | null> {
    for (const taskFile of change.taskFiles) {
      const content = await fs.readFile(taskFile.filepath, 'utf-8');
      const status = parseStatus(content);
      if (status === 'to-do') {
        return taskFile;
      }
    }
    return null;
  }

  private async readChangeDocuments(
    changeId: string,
    workspacePath?: string
  ): Promise<{ proposal: string; design?: string }> {
    const changesPath = workspacePath
      ? path.join(workspacePath, 'changes')
      : path.join(process.cwd(), 'workspace', 'changes');
    const changeDir = path.join(changesPath, changeId);
    const proposalPath = path.join(changeDir, 'proposal.md');
    const designPath = path.join(changeDir, 'design.md');

    const proposal = await fs.readFile(proposalPath, 'utf-8');

    let design: string | undefined;
    try {
      design = await fs.readFile(designPath, 'utf-8');
    } catch {
      // design.md is optional
    }

    return { proposal, design };
  }

  private async printChangeDocuments(
    changeId: string,
    workspacePath?: string
  ): Promise<void> {
    const docs = await this.readChangeDocuments(changeId, workspacePath);

    console.log(chalk.bold.blue(`\n═══ Proposal: ${changeId} ═══\n`));
    console.log(docs.proposal);

    if (docs.design) {
      console.log(chalk.bold.blue(`\n═══ Design ═══\n`));
      console.log(docs.design);
    }
  }

  async change(options: ChangeOptions): Promise<void> {
    await this.ensureInitialized();
    const result = await this.itemRetrievalService!.getChangeById(options.id);

    if (!result) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Change not found: ${options.id}` }));
      } else {
        ora().fail(`Change not found: ${options.id}`);
      }
      process.exitCode = 1;
      return;
    }

    const { proposal, design, tasks, workspacePath, projectName, displayId } =
      result;

    if (options.json) {
      console.log(
        JSON.stringify(
          {
            changeId: options.id,
            workspacePath,
            projectName,
            displayId,
            proposal,
            design,
            tasks: tasks.map((t) => ({
              id: getTaskId(t),
              filename: t.filename,
              sequence: t.sequence,
            })),
          },
          null,
          2
        )
      );
    } else {
      const headerId = this.isMulti ? displayId : options.id;
      console.log(chalk.bold.blue(`\n═══ Proposal: ${headerId} ═══\n`));
      console.log(proposal);

      if (design) {
        console.log(chalk.bold.blue(`\n═══ Design ═══\n`));
        console.log(design);
      }

      if (tasks.length > 0) {
        console.log(chalk.bold.blue(`\n═══ Tasks ═══\n`));
        for (const task of tasks) {
          console.log(`  ${task.sequence}. ${getTaskId(task)}`);
        }
      }
    }
  }

  async spec(options: SpecOptions): Promise<void> {
    await this.ensureInitialized();
    const result = await this.itemRetrievalService!.getSpecById(options.id);

    if (!result) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Spec not found: ${options.id}` }));
      } else {
        ora().fail(`Spec not found: ${options.id}`);
      }
      process.exitCode = 1;
      return;
    }

    const { content, workspacePath, projectName, displayId } = result;

    if (options.json) {
      console.log(
        JSON.stringify(
          {
            specId: options.id,
            workspacePath,
            projectName,
            displayId,
            content,
          },
          null,
          2
        )
      );
    } else {
      const headerId = this.isMulti ? displayId : options.id;
      console.log(chalk.bold.magenta(`\n═══ Spec: ${headerId} ═══\n`));
      console.log(content);
    }
  }

  async tasks(options: TasksOptions = {}): Promise<void> {
    await this.ensureInitialized();

    if (options.id) {
      // List tasks for a specific change
      const tasks = await this.itemRetrievalService!.getTasksForChange(
        options.id
      );

      if (tasks.length === 0) {
        if (options.json) {
          console.log(JSON.stringify({ changeId: options.id, tasks: [] }));
        } else {
          ora().info(`No tasks found for change: ${options.id}`);
        }
        return;
      }

      if (options.json) {
        const taskData = [];
        for (const task of tasks) {
          const content = await fs.readFile(task.filepath, 'utf-8');
          const status = parseStatus(content);
          const skillLevel = parseSkillLevel(content);
          taskData.push({
            id: getTaskId(task),
            status,
            changeId: options.id,
            ...(skillLevel && { skillLevel }),
          });
        }
        console.log(
          JSON.stringify({ changeId: options.id, tasks: taskData }, null, 2)
        );
      } else {
        console.log(chalk.bold.cyan(`\n═══ Tasks for: ${options.id} ═══\n`));
        await this.printTaskTable(tasks, options.id);
      }
    } else {
      // List all open tasks
      const openTasks = await this.itemRetrievalService!.getAllOpenTasks();

      if (openTasks.length === 0) {
        if (options.json) {
          console.log(JSON.stringify({ tasks: [] }));
        } else {
          ora().info('No open tasks found');
        }
        return;
      }

      if (options.json) {
        const taskData = [];
        for (const t of openTasks) {
          const content = await fs.readFile(t.task.filepath, 'utf-8');
          const skillLevel = parseSkillLevel(content);
          taskData.push({
            id: t.taskId,
            status: t.status,
            changeId: t.changeId,
            workspacePath: t.workspacePath,
            projectName: t.projectName,
            displayId: t.displayId,
            ...(skillLevel && { skillLevel }),
          });
        }
        console.log(
          JSON.stringify({ tasks: taskData }, null, 2)
        );
      } else {
        console.log(chalk.bold.cyan('\n═══ Open Tasks ═══\n'));
        await this.printOpenTaskTable(openTasks);
      }
    }
  }

  private async printTaskTable(tasks: TaskFileInfo[], changeId: string): Promise<void> {
    // Header
    console.log(
      chalk.dim('  ') +
      chalk.bold.white('ID'.padEnd(30)) +
      chalk.bold.white('Status'.padEnd(15)) +
      chalk.bold.white('Skill')
    );
    console.log(chalk.dim('  ' + '─'.repeat(55)));

    for (const task of tasks) {
      const content = await fs.readFile(task.filepath, 'utf-8');
      const status = parseStatus(content);
      const skillLevel = parseSkillLevel(content);
      const taskId = task.filename.replace('.md', '');
      const statusColor = status === 'in-progress' ? chalk.yellow : status === 'done' ? chalk.green : chalk.gray;
      const skillDisplay = skillLevel ? this.formatSkillLevel(skillLevel) : chalk.dim('-');

      console.log(
        chalk.dim('  ') +
        chalk.white(taskId.padEnd(30)) +
        statusColor(status.padEnd(15)) +
        skillDisplay
      );
    }
  }

  private async printOpenTaskTable(tasks: OpenTaskInfo[]): Promise<void> {
    // Header
    console.log(
      chalk.dim('  ') +
        chalk.bold.white('ID'.padEnd(50)) +
        chalk.bold.white('Status'.padEnd(15)) +
        chalk.bold.white('Skill'.padEnd(10)) +
        chalk.bold.white('Change')
    );
    console.log(chalk.dim('  ' + '─'.repeat(95)));

    for (const { taskId, status, changeId, displayId, task } of tasks) {
      const content = await fs.readFile(task.filepath, 'utf-8');
      const skillLevel = parseSkillLevel(content);
      const statusColor = status === 'in-progress' ? chalk.yellow : chalk.gray;
      const displayTaskId = this.isMulti && displayId ? displayId : taskId;
      const skillDisplay = skillLevel ? this.formatSkillLevel(skillLevel) : chalk.dim('-');
      const skillPadding = ' '.repeat(Math.max(0, 10 - (skillLevel?.length ?? 1)));

      console.log(
        chalk.dim('  ') +
          chalk.white(displayTaskId.padEnd(50)) +
          statusColor(status.padEnd(15)) +
          skillDisplay + skillPadding +
          chalk.blue(changeId)
      );
    }
  }
}
