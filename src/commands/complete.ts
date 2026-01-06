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

interface ReviewOptions {
  id: string;
  json?: boolean;
}

interface SpecOptions {
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
  private itemRetrievalService: ItemRetrievalService | null = null;

  private async ensureInitialized(): Promise<void> {
    if (!this.itemRetrievalService) {
      this.itemRetrievalService = await ItemRetrievalService.create();
    }
  }

  async task(options: TaskOptions): Promise<void> {
    await this.ensureInitialized();
    const result = await this.itemRetrievalService!.getTaskById(options.id);

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
    await this.ensureInitialized();
    const change = await this.itemRetrievalService!.getChangeById(options.id);

    if (!change) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Change not found: ${options.id}` }));
      } else {
        ora().fail(`Change not found: ${options.id}`);
      }
      process.exitCode = 1;
      return;
    }

    const tasks = await this.itemRetrievalService!.getTasksForParent(options.id);
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

  async review(options: ReviewOptions): Promise<void> {
    await this.ensureInitialized();
    const review = await this.itemRetrievalService!.getReviewById(options.id);

    if (!review) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Review not found: ${options.id}` }));
      } else {
        ora().fail(`Review not found: ${options.id}`);
      }
      process.exitCode = 1;
      return;
    }

    const tasks = await this.itemRetrievalService!.getTasksForReview(options.id);
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
        reviewId: options.id,
        completedTasks,
        skippedTasks,
      }, null, 2));
    } else {
      if (completedTasks.length > 0) {
        console.log(chalk.green(`\n✓ Completed ${completedTasks.length} task(s) in review: ${options.id}`));
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
        console.log(chalk.yellow('\nAll tasks in this review were already complete.'));
      }

      console.log();
    }
  }

  async spec(options: SpecOptions): Promise<void> {
    await this.ensureInitialized();
    const spec = await this.itemRetrievalService!.getSpecById(options.id);

    if (!spec) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Spec not found: ${options.id}` }));
      } else {
        ora().fail(`Spec not found: ${options.id}`);
      }
      process.exitCode = 1;
      return;
    }

    const tasks = await this.itemRetrievalService!.getTasksForSpec(options.id);

    if (tasks.length === 0) {
      if (options.json) {
        console.log(JSON.stringify({
          specId: options.id,
          completedTasks: [],
          skippedTasks: [],
        }, null, 2));
      } else {
        ora().info(`No tasks found for spec: ${options.id}`);
      }
      return;
    }

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
        specId: options.id,
        completedTasks,
        skippedTasks,
      }, null, 2));
    } else {
      if (completedTasks.length > 0) {
        console.log(chalk.green(`\n✓ Completed ${completedTasks.length} task(s) in spec: ${options.id}`));
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
        console.log(chalk.yellow('\nAll tasks in this spec were already complete.'));
      }

      console.log();
    }
  }
}
