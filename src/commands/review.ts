import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import {
  getActiveChangeIdsMulti,
  getSpecIdsMulti,
  ChangeIdWithWorkspace,
  SpecIdWithWorkspace,
} from '../utils/item-discovery.js';
import { isInteractive } from '../utils/interactive.js';
import { ReviewParent } from '../core/schemas/index.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import { isMultiWorkspace, DiscoveredWorkspace } from '../utils/workspace-discovery.js';

interface ReviewOptions {
  changeId?: string;
  specId?: string;
  taskId?: string;
  id?: string;
  json?: boolean;
  noInteractive?: boolean;
  interactive?: boolean;
}

export class ReviewCommand {
  private root: string;
  private workspaces: DiscoveredWorkspace[] = [];
  private isMulti: boolean = false;

  constructor(root: string = process.cwd()) {
    this.root = root;
  }

  private async ensureInitialized(): Promise<void> {
    if (this.workspaces.length > 0) return;
    this.workspaces = await getFilteredWorkspaces(this.root);
    this.isMulti = isMultiWorkspace(this.workspaces);
  }

  private parseWorkspacePrefixedId(input: string): { projectName: string | null; itemId: string } {
    if (input.includes('/')) {
      const slashIndex = input.indexOf('/');
      const candidatePrefix = input.slice(0, slashIndex);
      if (this.workspaces.some(w => w.projectName.toLowerCase() === candidatePrefix.toLowerCase())) {
        return {
          projectName: candidatePrefix,
          itemId: input.slice(slashIndex + 1),
        };
      }
    }
    return { projectName: null, itemId: input };
  }

  private findChangeForItem(
    projectName: string | null,
    itemId: string,
    changeItems: ChangeIdWithWorkspace[]
  ): ChangeIdWithWorkspace | undefined {
    if (projectName) {
      return changeItems.find(
        (c) => c.projectName.toLowerCase() === projectName.toLowerCase() && c.id === itemId
      );
    }
    const matches = changeItems.filter((c) => c.id === itemId);
    if (matches.length > 1) {
      const workspaceNames = matches.map(c => c.displayId).join(', ');
      throw new Error(`Ambiguous change '${itemId}' exists in multiple workspaces: ${workspaceNames}. Specify the workspace prefix.`);
    }
    return matches[0];
  }

  private findSpecForItem(
    projectName: string | null,
    itemId: string,
    specItems: SpecIdWithWorkspace[]
  ): SpecIdWithWorkspace | undefined {
    if (projectName) {
      return specItems.find(
        (s) => s.projectName.toLowerCase() === projectName.toLowerCase() && s.id === itemId
      );
    }
    const matches = specItems.filter((s) => s.id === itemId);
    if (matches.length > 1) {
      const workspaceNames = matches.map(s => s.displayId).join(', ');
      throw new Error(`Ambiguous spec '${itemId}' exists in multiple workspaces: ${workspaceNames}. Specify the workspace prefix.`);
    }
    return matches[0];
  }

  async reviewChange(id: string, options: ReviewOptions = {}): Promise<void> {
    return this.execute({ ...options, changeId: id });
  }

  async reviewSpec(id: string, options: ReviewOptions = {}): Promise<void> {
    return this.execute({ ...options, specId: id });
  }

  async reviewTask(id: string, options: ReviewOptions = {}): Promise<void> {
    return this.execute({ ...options, taskId: id });
  }

  async execute(options: ReviewOptions = {}): Promise<void> {
    await this.ensureInitialized();
    const interactive = isInteractive(options);

    // Determine what to review
    let parentType: ReviewParent | undefined;
    let parentId: string | undefined;
    let resolvedWorkspacePath: string | undefined;

    if (options.changeId) {
      parentType = 'change';
      const { projectName, itemId } = this.parseWorkspacePrefixedId(options.changeId);
      const changeItems = await getActiveChangeIdsMulti(this.workspaces);
      const resolved = this.findChangeForItem(projectName, itemId, changeItems);
      if (resolved) {
        parentId = resolved.id;
        resolvedWorkspacePath = resolved.workspacePath;
      } else {
        parentId = itemId;
      }
    } else if (options.specId) {
      parentType = 'spec';
      const { projectName, itemId } = this.parseWorkspacePrefixedId(options.specId);
      const specItems = await getSpecIdsMulti(this.workspaces);
      const resolved = this.findSpecForItem(projectName, itemId, specItems);
      if (resolved) {
        parentId = resolved.id;
        resolvedWorkspacePath = resolved.workspacePath;
      } else {
        parentId = itemId;
      }
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
          const changeItems = await getActiveChangeIdsMulti(this.workspaces);
          if (changeItems.length === 0) {
            ora().fail('No active changes found');
            process.exitCode = 1;
            return;
          }
          const selected = await select({
            message: 'Select the change to review:',
            choices: changeItems.map((c) => ({ name: c.displayId, value: c })),
          });
          // Handle both object (ChangeIdWithWorkspace) and string (legacy/test) selection
          if (typeof selected === 'string') {
            parentId = selected;
            const found = changeItems.find((c) => c.id === selected || c.displayId === selected);
            resolvedWorkspacePath = found?.workspacePath;
          } else {
            parentId = selected.id;
            resolvedWorkspacePath = selected.workspacePath;
          }
        } else if (parentType === 'spec') {
          const specItems = await getSpecIdsMulti(this.workspaces);
          if (specItems.length === 0) {
            ora().fail('No specs found');
            process.exitCode = 1;
            return;
          }
          const selected = await select({
            message: 'Select the spec to review:',
            choices: specItems.map((s) => ({ name: s.displayId, value: s })),
          });
          // Handle both object (SpecIdWithWorkspace) and string (legacy/test) selection
          if (typeof selected === 'string') {
            parentId = selected;
            const found = specItems.find((s) => s.id === selected || s.displayId === selected);
            resolvedWorkspacePath = found?.workspacePath;
          } else {
            parentId = selected.id;
            resolvedWorkspacePath = selected.workspacePath;
          }
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
      const output = await this.buildJsonOutput(parentType, parentId, resolvedWorkspacePath);
      console.log(JSON.stringify(output, null, 2));
    } else {
      await this.outputReviewContext(parentType, parentId, resolvedWorkspacePath);
    }
  }

  private async buildJsonOutput(
    parentType: ReviewParent,
    parentId: string,
    workspacePath?: string
  ): Promise<object> {
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
      let basePath = workspacePath;
      if (!basePath) {
        basePath = this.workspaces.length > 0 ? this.workspaces[0].path : path.join(this.root, 'workspace');
      }
      const changeDir = path.join(basePath, 'changes', parentId);
      await this.addChangeDocuments(changeDir, documents);
    } else if (parentType === 'spec') {
      let basePath = workspacePath;
      if (!basePath) {
        basePath = this.workspaces.length > 0 ? this.workspaces[0].path : path.join(this.root, 'workspace');
      }
      const specPath = path.join(basePath, 'specs', parentId, 'spec.md');
      try {
        const content = await fs.readFile(specPath, 'utf-8');
        documents.push({ path: `workspace/specs/${parentId}/spec.md`, content });
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

  private async outputReviewContext(
    parentType: ReviewParent,
    parentId: string,
    workspacePath?: string
  ): Promise<void> {
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
      await this.outputChangeDocuments(parentId, workspacePath);
    } else if (parentType === 'spec') {
      await this.outputSpecDocuments(parentId, workspacePath);
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

  private async outputChangeDocuments(changeId: string, workspacePath?: string): Promise<void> {
    // If workspacePath is not provided, discover it from the first available workspace
    let basePath = workspacePath;
    if (!basePath) {
      if (this.workspaces.length > 0) {
        basePath = this.workspaces[0].path;
      } else {
        basePath = path.join(this.root, 'workspace');
      }
    }
    const changeDir = path.join(basePath, 'changes', changeId);

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

  private async outputSpecDocuments(specId: string, workspacePath?: string): Promise<void> {
    // If workspacePath is not provided, discover it from the first available workspace
    let basePath = workspacePath;
    if (!basePath) {
      if (this.workspaces.length > 0) {
        basePath = this.workspaces[0].path;
      } else {
        basePath = path.join(this.root, 'workspace');
      }
    }
    const specPath = path.join(basePath, 'specs', specId, 'spec.md');
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
    // Search across all workspaces
    for (const workspace of this.workspaces) {
      const changesDir = path.join(workspace.path, 'changes');
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
  }

  private async outputTaskDocuments(taskId: string): Promise<void> {
    // Search across all workspaces
    for (const workspace of this.workspaces) {
      const changesDir = path.join(workspace.path, 'changes');
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
                await this.outputChangeDocuments(change.name, workspace.path);
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

    console.log(chalk.red(`Task not found: ${taskId}`));
    process.exitCode = 1;
  }
}
