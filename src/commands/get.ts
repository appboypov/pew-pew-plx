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
  setTaskStatus,
  TaskStatus,
  completeTaskFully,
} from '../utils/task-status.js';
import { TaskFileInfo, countTasksFromContent } from '../utils/task-progress.js';
import { ItemRetrievalService } from '../services/item-retrieval.js';
import { ContentFilterService } from '../services/content-filter.js';

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
  name: string;
  completedItems: string[];
}

interface JsonOutput {
  changeId: string;
  task: {
    filename: string;
    filepath: string;
    sequence: number;
    name: string;
    status: TaskStatus;
  } | null;
  taskContent: string | null;
  changeDocuments?: {
    proposal: string;
    design?: string;
  };
  completedTask?: CompletedTaskInfo;
  autoCompletedTask?: { name: string };
  transitionedToInProgress?: boolean;
  warning?: string;
}

export class GetCommand {
  private changesPath: string;
  private itemRetrievalService: ItemRetrievalService;
  private contentFilterService: ContentFilterService;

  constructor() {
    this.changesPath = path.join(process.cwd(), 'openspec', 'changes');
    this.itemRetrievalService = new ItemRetrievalService();
    this.contentFilterService = new ContentFilterService();
  }

  async task(options: TaskOptions = {}): Promise<void> {
    // Handle ID-based retrieval
    if (options.id) {
      await this.taskById(options);
      return;
    }

    // Original prioritization-based flow
    const prioritizedChange = await getPrioritizedChange(this.changesPath);

    if (!prioritizedChange) {
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
    let autoCompletedTaskInfo: { name: string } | undefined;

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
        autoCompletedTaskInfo = { name: prioritizedChange.inProgressTask.name };

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
          name: prioritizedChange.inProgressTask.name,
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
      if (options.json) {
        const output: JsonOutput = {
          changeId: prioritizedChange.id,
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
        console.log(JSON.stringify({ ...output, message: 'All tasks complete' }, null, 2));
      } else {
        if (completedTaskInfo) {
          this.printCompletedTaskInfo(completedTaskInfo);
        }
        if (autoCompletedTaskInfo) {
          console.log(chalk.green(`\n✓ Auto-completed task: ${autoCompletedTaskInfo.name}\n`));
        }
        if (warning) {
          ora().warn(warning);
        }
        ora().succeed('All tasks complete');
      }
      return;
    }

    // Read task content and check status
    let taskContent = await fs.readFile(nextTask.filepath, 'utf-8');
    let taskStatus = parseStatus(taskContent);
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

    if (options.json) {
      const output: JsonOutput = {
        changeId: prioritizedChange.id,
        task: {
          filename: nextTask.filename,
          filepath: nextTask.filepath,
          sequence: nextTask.sequence,
          name: nextTask.name,
          status: taskStatus,
        },
        taskContent,
      };

      // Include change documents unless --did-complete-previous or auto-completed
      if (!options.didCompletePrevious && !autoCompletedTaskInfo) {
        output.changeDocuments = await this.readChangeDocuments(
          prioritizedChange.id
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
        console.log(chalk.green(`\n✓ Auto-completed task: ${autoCompletedTaskInfo.name}\n`));
      }

      if (transitionedToInProgress) {
        console.log(chalk.blue(`→ Transitioned to in-progress: ${nextTask.name}`));
      }

      if (warning) {
        ora().warn(warning);
        console.log();
      }

      // Show change documents unless --did-complete-previous or auto-completed
      if (!options.didCompletePrevious && !autoCompletedTaskInfo) {
        await this.printChangeDocuments(prioritizedChange.id);
      }

      // Print task header
      console.log(
        chalk.bold.cyan(`\n═══ Task ${nextTask.sequence}: ${nextTask.name} ═══\n`)
      );
      console.log(taskContent);
    }
  }

  private async taskById(options: TaskOptions): Promise<void> {
    const result = await this.itemRetrievalService.getTaskById(options.id!);

    if (!result) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Task not found: ${options.id}` }));
      } else {
        ora().fail(`Task not found: ${options.id}`);
      }
      process.exitCode = 1;
      return;
    }

    const { task, content, changeId } = result;
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

    // Apply content filtering if requested
    const filteredContent = this.applyContentFiltering(updatedContent, options);

    if (options.json) {
      const output: any = {
        changeId,
        task: {
          filename: task.filename,
          filepath: task.filepath,
          sequence: task.sequence,
          name: task.name,
          status: taskStatus,
        },
        taskContent: filteredContent,
      };
      if (transitionedToInProgress) {
        output.transitionedToInProgress = true;
      }
      console.log(JSON.stringify(output, null, 2));
    } else {
      if (transitionedToInProgress) {
        console.log(chalk.blue(`\n→ Transitioned to in-progress: ${task.name}`));
      }
      console.log(
        chalk.bold.cyan(`\n═══ Task ${task.sequence}: ${task.name} ═══\n`)
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
    console.log(chalk.green(`\n✓ Completed task: ${info.name}`));
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
    changeId: string
  ): Promise<{ proposal: string; design?: string }> {
    const changeDir = path.join(this.changesPath, changeId);
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

  private async printChangeDocuments(changeId: string): Promise<void> {
    const docs = await this.readChangeDocuments(changeId);

    console.log(chalk.bold.blue(`\n═══ Proposal: ${changeId} ═══\n`));
    console.log(docs.proposal);

    if (docs.design) {
      console.log(chalk.bold.blue(`\n═══ Design ═══\n`));
      console.log(docs.design);
    }
  }

  async change(options: ChangeOptions): Promise<void> {
    const result = await this.itemRetrievalService.getChangeById(options.id);

    if (!result) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Change not found: ${options.id}` }));
      } else {
        ora().fail(`Change not found: ${options.id}`);
      }
      process.exitCode = 1;
      return;
    }

    const { proposal, design, tasks } = result;

    if (options.json) {
      console.log(JSON.stringify({
        changeId: options.id,
        proposal,
        design,
        tasks: tasks.map(t => ({
          filename: t.filename,
          sequence: t.sequence,
          name: t.name,
        })),
      }, null, 2));
    } else {
      console.log(chalk.bold.blue(`\n═══ Proposal: ${options.id} ═══\n`));
      console.log(proposal);

      if (design) {
        console.log(chalk.bold.blue(`\n═══ Design ═══\n`));
        console.log(design);
      }

      if (tasks.length > 0) {
        console.log(chalk.bold.blue(`\n═══ Tasks ═══\n`));
        for (const task of tasks) {
          console.log(`  ${task.sequence}. ${task.name}`);
        }
      }
    }
  }

  async spec(options: SpecOptions): Promise<void> {
    const content = await this.itemRetrievalService.getSpecById(options.id);

    if (!content) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Spec not found: ${options.id}` }));
      } else {
        ora().fail(`Spec not found: ${options.id}`);
      }
      process.exitCode = 1;
      return;
    }

    if (options.json) {
      console.log(JSON.stringify({
        specId: options.id,
        content,
      }, null, 2));
    } else {
      console.log(chalk.bold.magenta(`\n═══ Spec: ${options.id} ═══\n`));
      console.log(content);
    }
  }

  async tasks(options: TasksOptions = {}): Promise<void> {
    if (options.id) {
      // List tasks for a specific change
      const tasks = await this.itemRetrievalService.getTasksForChange(options.id);

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
          taskData.push({
            id: `${options.id}/${task.name}`,
            name: task.name,
            status,
            changeId: options.id,
          });
        }
        console.log(JSON.stringify({ changeId: options.id, tasks: taskData }, null, 2));
      } else {
        console.log(chalk.bold.cyan(`\n═══ Tasks for: ${options.id} ═══\n`));
        this.printTaskTable(tasks, options.id);
      }
    } else {
      // List all open tasks
      const openTasks = await this.itemRetrievalService.getAllOpenTasks();

      if (openTasks.length === 0) {
        if (options.json) {
          console.log(JSON.stringify({ tasks: [] }));
        } else {
          ora().info('No open tasks found');
        }
        return;
      }

      if (options.json) {
        console.log(JSON.stringify({
          tasks: openTasks.map(t => ({
            id: t.taskId,
            name: t.task.name,
            status: t.status,
            changeId: t.changeId,
          })),
        }, null, 2));
      } else {
        console.log(chalk.bold.cyan('\n═══ Open Tasks ═══\n'));
        this.printOpenTaskTable(openTasks);
      }
    }
  }

  private async printTaskTable(tasks: TaskFileInfo[], changeId: string): Promise<void> {
    // Header
    console.log(
      chalk.dim('  ') +
      chalk.bold.white('ID'.padEnd(30)) +
      chalk.bold.white('Name'.padEnd(30)) +
      chalk.bold.white('Status')
    );
    console.log(chalk.dim('  ' + '─'.repeat(70)));

    for (const task of tasks) {
      const content = await fs.readFile(task.filepath, 'utf-8');
      const status = parseStatus(content);
      const taskId = `${changeId}/${task.name}`;
      const statusColor = status === 'in-progress' ? chalk.yellow : status === 'done' ? chalk.green : chalk.gray;

      console.log(
        chalk.dim('  ') +
        chalk.white(taskId.padEnd(30)) +
        chalk.white(task.name.padEnd(30)) +
        statusColor(status)
      );
    }
  }

  private printOpenTaskTable(tasks: { taskId: string; changeId: string; task: TaskFileInfo; status: TaskStatus }[]): void {
    // Header
    console.log(
      chalk.dim('  ') +
      chalk.bold.white('ID'.padEnd(35)) +
      chalk.bold.white('Name'.padEnd(25)) +
      chalk.bold.white('Status'.padEnd(15)) +
      chalk.bold.white('Change')
    );
    console.log(chalk.dim('  ' + '─'.repeat(85)));

    for (const { taskId, task, status, changeId } of tasks) {
      const statusColor = status === 'in-progress' ? chalk.yellow : chalk.gray;

      console.log(
        chalk.dim('  ') +
        chalk.white(taskId.padEnd(35)) +
        chalk.white(task.name.padEnd(25)) +
        statusColor(status.padEnd(15)) +
        chalk.blue(changeId)
      );
    }
  }
}
