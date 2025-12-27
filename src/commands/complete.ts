import { promises as fs } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import { parseStatus, completeTaskFully, TaskStatus } from '../utils/task-status.js';
import { ItemRetrievalService } from '../services/item-retrieval.js';
import { getTaskId } from '../services/task-id.js';

interface TaskOptions {
  id: string;
  json?: boolean;
}

interface ChangeOptions {
  id: string;
  json?: boolean;
}

interface TaskCompletionResult {
  taskId: string;
  name: string;
  previousStatus: TaskStatus;
  completedItems: string[];
}

export class CompleteCommand {
  private itemRetrievalService: ItemRetrievalService;

  constructor() {
    this.itemRetrievalService = new ItemRetrievalService();
  }

  async task(options: TaskOptions): Promise<void> {
    const result = await this.itemRetrievalService.getTaskById(options.id);

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
    const previousStatus = parseStatus(content);

    if (previousStatus === 'done') {
      if (options.json) {
        console.log(JSON.stringify({
          taskId: getTaskId(task),
          changeId,
          warning: 'Task already complete',
        }));
      } else {
        ora().warn(`Task already complete: ${getTaskId(task)}`);
      }
      return;
    }

    const completedItems = await completeTaskFully(task.filepath);

    const taskId = getTaskId(task);

    if (options.json) {
      console.log(JSON.stringify({
        taskId,
        changeId,
        previousStatus,
        newStatus: 'done',
        completedItems,
      }, null, 2));
    } else {
      console.log(chalk.green(`\n✓ Completed task: ${taskId}`));
      if (completedItems.length > 0) {
        console.log(chalk.dim('  Marked complete:'));
        for (const item of completedItems) {
          console.log(chalk.dim(`    • ${item}`));
        }
      }
      console.log();
    }
  }

  async change(options: ChangeOptions): Promise<void> {
    const change = await this.itemRetrievalService.getChangeById(options.id);

    if (!change) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Change not found: ${options.id}` }));
      } else {
        ora().fail(`Change not found: ${options.id}`);
      }
      process.exitCode = 1;
      return;
    }

    const tasks = await this.itemRetrievalService.getTasksForChange(options.id);
    const completedTasks: TaskCompletionResult[] = [];
    const skippedTasks: string[] = [];

    for (const task of tasks) {
      const content = await fs.readFile(task.filepath, 'utf-8');
      const status = parseStatus(content);

      if (status === 'done') {
        skippedTasks.push(getTaskId(task));
        continue;
      }

      const completedItems = await completeTaskFully(task.filepath);
      completedTasks.push({
        taskId: getTaskId(task),
        name: task.name,
        previousStatus: status,
        completedItems,
      });
    }

    if (options.json) {
      console.log(JSON.stringify({
        changeId: options.id,
        completedTasks,
        skippedTasks,
      }, null, 2));
    } else {
      if (completedTasks.length > 0) {
        console.log(chalk.green(`\n✓ Completed ${completedTasks.length} task(s) in change: ${options.id}`));
        for (const task of completedTasks) {
          console.log(chalk.dim(`    • ${task.taskId}`));
        }
      }

      if (skippedTasks.length > 0) {
        console.log(chalk.yellow(`\n⚠ Skipped ${skippedTasks.length} already-complete task(s):`));
        for (const taskId of skippedTasks) {
          console.log(chalk.dim(`    • ${taskId}`));
        }
      }

      if (completedTasks.length === 0 && skippedTasks.length > 0) {
        console.log(chalk.yellow('\nAll tasks in this change were already complete.'));
      }

      console.log();
    }
  }
}
