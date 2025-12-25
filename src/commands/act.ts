import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import {
  getPrioritizedChange,
  PrioritizedChange,
} from '../utils/change-prioritization.js';
import { parseStatus, setTaskStatus, TaskStatus } from '../utils/task-status.js';
import { TaskFileInfo } from '../utils/task-progress.js';

interface NextOptions {
  didCompletePrevious?: boolean;
  json?: boolean;
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
  warning?: string;
}

export class ActCommand {
  private changesPath: string;

  constructor() {
    this.changesPath = path.join(process.cwd(), 'openspec', 'changes');
  }

  async next(options: NextOptions = {}): Promise<void> {
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

    if (options.didCompletePrevious) {
      // Handle --did-complete-previous flag
      if (prioritizedChange.inProgressTask) {
        // Complete the in-progress task
        await setTaskStatus(prioritizedChange.inProgressTask.filepath, 'done');

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
        console.log(
          JSON.stringify({
            changeId: prioritizedChange.id,
            task: null,
            taskContent: null,
            message: 'All tasks complete',
            warning,
          })
        );
      } else {
        if (warning) {
          ora().warn(warning);
        }
        ora().succeed('All tasks complete');
      }
      return;
    }

    // Read task content
    const taskContent = await fs.readFile(nextTask.filepath, 'utf-8');
    const taskStatus = parseStatus(taskContent);

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

      // Include change documents unless --did-complete-previous was used
      if (!options.didCompletePrevious) {
        output.changeDocuments = await this.readChangeDocuments(
          prioritizedChange.id
        );
      }

      if (warning) {
        output.warning = warning;
      }

      console.log(JSON.stringify(output, null, 2));
    } else {
      // Text output
      if (warning) {
        ora().warn(warning);
        console.log();
      }

      // Show change documents unless --did-complete-previous was used
      if (!options.didCompletePrevious) {
        await this.printChangeDocuments(prioritizedChange.id);
      }

      // Print task header
      console.log(
        chalk.bold.cyan(`\n═══ Task ${nextTask.sequence}: ${nextTask.name} ═══\n`)
      );
      console.log(taskContent);
    }
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
}
