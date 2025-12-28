import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getActiveChangeIds, getSpecIds } from '../utils/item-discovery.js';
import { isInteractive } from '../utils/interactive.js';
import { ReviewParent } from '../core/schemas/index.js';

interface ReviewOptions {
  changeId?: string;
  specId?: string;
  taskId?: string;
  json?: boolean;
  noInteractive?: boolean;
  interactive?: boolean;
}

export class ReviewCommand {
  private root: string;

  constructor(root: string = process.cwd()) {
    this.root = root;
  }

  async execute(options: ReviewOptions = {}): Promise<void> {
    const interactive = isInteractive(options);

    // Determine what to review
    let parentType: ReviewParent | undefined;
    let parentId: string | undefined;

    if (options.changeId) {
      parentType = 'change';
      parentId = options.changeId;
    } else if (options.specId) {
      parentType = 'spec';
      parentId = options.specId;
    } else if (options.taskId) {
      parentType = 'task';
      parentId = options.taskId;
    }

    // If no parent specified, prompt interactively or fail
    if (!parentType || !parentId) {
      if (interactive) {
        const { select } = await import('@inquirer/prompts');
        const parentTypeChoice = await select<ReviewParent>({
          message: 'What would you like to review?',
          choices: [
            { name: 'Change', value: 'change' },
            { name: 'Spec', value: 'spec' },
            { name: 'Task', value: 'task' },
          ],
        });
        parentType = parentTypeChoice;

        if (parentType === 'change') {
          const changes = await getActiveChangeIds();
          if (changes.length === 0) {
            ora().fail('No active changes found');
            process.exitCode = 1;
            return;
          }
          parentId = await select({
            message: 'Select the change to review:',
            choices: changes.map((id) => ({ name: id, value: id })),
          });
        } else if (parentType === 'spec') {
          const specs = await getSpecIds();
          if (specs.length === 0) {
            ora().fail('No specs found');
            process.exitCode = 1;
            return;
          }
          parentId = await select({
            message: 'Select the spec to review:',
            choices: specs.map((id) => ({ name: id, value: id })),
          });
        } else {
          const { input } = await import('@inquirer/prompts');
          parentId = await input({
            message: 'Enter the task ID to review:',
            validate: (value) => value.trim() ? true : 'Task ID is required',
          });
        }
      } else {
        if (options.json) {
          console.log(
            JSON.stringify({ error: 'Specify what to review: --change-id, --spec-id, or --task-id' })
          );
        } else {
          ora().fail('Specify what to review');
          console.log(chalk.dim('  Usage: plx review --change-id <id>'));
          console.log(chalk.dim('         plx review --spec-id <id>'));
          console.log(chalk.dim('         plx review --task-id <id>'));
        }
        process.exitCode = 1;
        return;
      }
    }

    // Output review context
    if (options.json) {
      const output = await this.buildJsonOutput(parentType, parentId);
      console.log(JSON.stringify(output, null, 2));
    } else {
      await this.outputReviewContext(parentType, parentId);
    }
  }

  private async buildJsonOutput(parentType: ReviewParent, parentId: string): Promise<object> {
    const output: Record<string, unknown> = {
      parentType,
      parentId,
      documents: [],
    };

    const documents: Array<{ path: string; content: string }> = [];

    // Add REVIEW.md if exists
    const reviewMdPath = path.join(this.root, 'REVIEW.md');
    try {
      const content = await fs.readFile(reviewMdPath, 'utf-8');
      documents.push({ path: 'REVIEW.md', content });
    } catch {
      // REVIEW.md may not exist
    }

    // Add parent documents
    if (parentType === 'change') {
      const changeDir = path.join(this.root, 'openspec', 'changes', parentId);
      await this.addChangeDocuments(changeDir, documents);
    } else if (parentType === 'spec') {
      const specPath = path.join(this.root, 'openspec', 'specs', parentId, 'spec.md');
      try {
        const content = await fs.readFile(specPath, 'utf-8');
        documents.push({ path: `openspec/specs/${parentId}/spec.md`, content });
      } catch {
        // Spec may not exist
      }
    } else if (parentType === 'task') {
      // Task ID format: <change-id>/tasks/<task-file> or just task file name
      await this.addTaskDocuments(parentId, documents);
    }

    output.documents = documents;
    return output;
  }

  private async outputReviewContext(parentType: ReviewParent, parentId: string): Promise<void> {
    console.log(chalk.cyan(`\n═══ Review: ${parentType}/${parentId} ═══\n`));

    // Output REVIEW.md if exists
    const reviewMdPath = path.join(this.root, 'REVIEW.md');
    try {
      const content = await fs.readFile(reviewMdPath, 'utf-8');
      console.log(chalk.yellow('═══ REVIEW.md ═══\n'));
      console.log(content);
      console.log();
    } catch {
      console.log(chalk.dim('No REVIEW.md found. Create one with: plx refine-review\n'));
    }

    // Output parent documents
    if (parentType === 'change') {
      await this.outputChangeDocuments(parentId);
    } else if (parentType === 'spec') {
      await this.outputSpecDocuments(parentId);
    } else if (parentType === 'task') {
      await this.outputTaskDocuments(parentId);
    }

    // Output next steps
    console.log(chalk.cyan('\n═══ Next Steps ═══\n'));
    console.log(chalk.dim('1. Review the implementation against the requirements above'));
    console.log(chalk.dim('2. Add feedback markers in code: // #FEEDBACK #TODO | {feedback}'));
    console.log(chalk.dim(`3. Parse feedback: plx parse feedback <review-name> --${parentType}-id ${parentId}`));
  }

  private async addChangeDocuments(
    changeDir: string,
    documents: Array<{ path: string; content: string }>
  ): Promise<void> {
    const files = ['proposal.md', 'design.md'];
    for (const file of files) {
      try {
        const content = await fs.readFile(path.join(changeDir, file), 'utf-8');
        documents.push({ path: `${path.basename(changeDir)}/${file}`, content });
      } catch {
        // File may not exist
      }
    }

    // Add tasks
    const tasksDir = path.join(changeDir, 'tasks');
    try {
      const taskFiles = await fs.readdir(tasksDir);
      for (const taskFile of taskFiles.filter((f) => f.endsWith('.md')).sort()) {
        const content = await fs.readFile(path.join(tasksDir, taskFile), 'utf-8');
        documents.push({ path: `${path.basename(changeDir)}/tasks/${taskFile}`, content });
      }
    } catch {
      // Tasks dir may not exist
    }
  }

  private async outputChangeDocuments(changeId: string): Promise<void> {
    const changeDir = path.join(this.root, 'openspec', 'changes', changeId);

    // Output proposal
    try {
      const proposal = await fs.readFile(path.join(changeDir, 'proposal.md'), 'utf-8');
      console.log(chalk.yellow(`═══ Proposal: ${changeId} ═══\n`));
      console.log(proposal);
    } catch {
      console.log(chalk.red(`Change not found: ${changeId}`));
      process.exitCode = 1;
      return;
    }

    // Output design if exists
    try {
      const design = await fs.readFile(path.join(changeDir, 'design.md'), 'utf-8');
      console.log(chalk.yellow(`\n═══ Design ═══\n`));
      console.log(design);
    } catch {
      // Design may not exist
    }

    // Output tasks
    const tasksDir = path.join(changeDir, 'tasks');
    try {
      const taskFiles = await fs.readdir(tasksDir);
      const mdFiles = taskFiles.filter((f) => f.endsWith('.md')).sort();
      if (mdFiles.length > 0) {
        console.log(chalk.yellow(`\n═══ Tasks ═══\n`));
        for (const taskFile of mdFiles) {
          const content = await fs.readFile(path.join(tasksDir, taskFile), 'utf-8');
          console.log(chalk.dim(`--- ${taskFile} ---\n`));
          console.log(content);
        }
      }
    } catch {
      // Tasks dir may not exist
    }
  }

  private async outputSpecDocuments(specId: string): Promise<void> {
    const specPath = path.join(this.root, 'openspec', 'specs', specId, 'spec.md');
    try {
      const content = await fs.readFile(specPath, 'utf-8');
      console.log(chalk.yellow(`═══ Spec: ${specId} ═══\n`));
      console.log(content);
    } catch {
      console.log(chalk.red(`Spec not found: ${specId}`));
      process.exitCode = 1;
    }
  }

  private async addTaskDocuments(
    taskId: string,
    documents: Array<{ path: string; content: string }>
  ): Promise<void> {
    // Try to find the task in changes
    const changesDir = path.join(this.root, 'openspec', 'changes');
    try {
      const changes = await fs.readdir(changesDir, { withFileTypes: true });
      for (const change of changes) {
        if (!change.isDirectory() || change.name === 'archive') continue;
        const tasksDir = path.join(changesDir, change.name, 'tasks');
        try {
          const taskFiles = await fs.readdir(tasksDir);
          for (const taskFile of taskFiles) {
            if (taskFile.includes(taskId) || taskFile === `${taskId}.md`) {
              const content = await fs.readFile(path.join(tasksDir, taskFile), 'utf-8');
              documents.push({ path: `${change.name}/tasks/${taskFile}`, content });

              // Also add parent change documents
              const changeDir = path.join(changesDir, change.name);
              await this.addChangeDocuments(changeDir, documents);
              return;
            }
          }
        } catch {
          // Tasks dir may not exist
        }
      }
    } catch {
      // Changes dir may not exist
    }
  }

  private async outputTaskDocuments(taskId: string): Promise<void> {
    // Try to find the task in changes
    const changesDir = path.join(this.root, 'openspec', 'changes');
    try {
      const changes = await fs.readdir(changesDir, { withFileTypes: true });
      for (const change of changes) {
        if (!change.isDirectory() || change.name === 'archive') continue;
        const tasksDir = path.join(changesDir, change.name, 'tasks');
        try {
          const taskFiles = await fs.readdir(tasksDir);
          for (const taskFile of taskFiles) {
            if (taskFile.includes(taskId) || taskFile === `${taskId}.md`) {
              // Output the task
              const content = await fs.readFile(path.join(tasksDir, taskFile), 'utf-8');
              console.log(chalk.yellow(`═══ Task: ${taskFile} ═══\n`));
              console.log(content);

              // Also output parent change documents
              console.log(chalk.yellow(`\n═══ Parent Change: ${change.name} ═══\n`));
              await this.outputChangeDocuments(change.name);
              return;
            }
          }
        } catch {
          // Tasks dir may not exist
        }
      }
    } catch {
      // Changes dir may not exist
    }

    console.log(chalk.red(`Task not found: ${taskId}`));
    process.exitCode = 1;
  }
}
