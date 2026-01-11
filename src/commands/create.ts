import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { TemplateManager } from '../core/templates/index.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import { FileSystemUtils } from '../utils/file-system.js';
import { ItemRetrievalService } from '../services/item-retrieval.js';
import { sortTaskFilesBySequence, buildTaskFilename } from '../utils/task-file-parser.js';

interface TaskOptions {
  parentId?: string;
  parentType?: 'change' | 'review' | 'spec';
  skillLevel?: 'junior' | 'medior' | 'senior';
  json?: boolean;
}

interface ChangeOptions {
  json?: boolean;
}

interface SpecOptions {
  json?: boolean;
}

interface RequestOptions {
  json?: boolean;
}

interface ProgressOptions {
  changeId: string;
  json?: boolean;
}

interface ResolvedParent {
  type: 'change' | 'review' | 'spec';
  path: string;
  workspacePath: string;
  projectName: string;
}

export class CreateCommand {
  private toKebabCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }

  /**
   * Resolves a parent ID to its entity type and path.
   * Searches changes, reviews, and specs across all workspaces.
   * Detects ambiguity when the same ID matches multiple entity types.
   * Supports multi-workspace prefixed IDs like "project-a/change-name".
   */
  private async resolveParent(
    parentId: string,
    parentType: 'change' | 'review' | 'spec' | undefined,
    workspaces: Array<{ path: string; projectName: string }>
  ): Promise<ResolvedParent | null> {
    const itemRetrieval = await ItemRetrievalService.create(
      process.cwd(),
      workspaces.map(w => ({
        path: w.path,
        relativePath: path.relative(process.cwd(), w.path),
        projectName: w.projectName,
        isRoot: true,
      }))
    );

    // Parse the parent ID to extract project prefix if present
    const parsePrefixedId = (id: string): { projectName: string | null; itemId: string } => {
      const slashIndex = id.indexOf('/');
      if (slashIndex === -1) {
        return { projectName: null, itemId: id };
      }

      const candidateProjectName = id.substring(0, slashIndex);
      const candidateItemId = id.substring(slashIndex + 1);

      const hasMatchingWorkspace = workspaces.some(
        w => w.projectName.toLowerCase() === candidateProjectName.toLowerCase()
      );

      if (!hasMatchingWorkspace) {
        return { projectName: null, itemId: id };
      }

      return {
        projectName: candidateProjectName,
        itemId: candidateItemId,
      };
    };

    const parsed = parsePrefixedId(parentId);
    const matches: ResolvedParent[] = [];

    // Determine which types to search
    const typesToSearch: Array<'change' | 'review' | 'spec'> = parentType
      ? [parentType]
      : ['change', 'review', 'spec'];

    // Search each type
    for (const type of typesToSearch) {
      if (type === 'change') {
        const changeResult = await itemRetrieval.getChangeById(parentId);
        if (changeResult) {
          matches.push({
            type: 'change',
            path: path.join(changeResult.workspacePath, 'changes', parsed.itemId),
            workspacePath: changeResult.workspacePath,
            projectName: changeResult.projectName,
          });
        }
      } else if (type === 'review') {
        // Check all workspaces for review (or specific workspace if prefixed)
        const searchWorkspaces = parsed.projectName
          ? workspaces.filter(w => w.projectName.toLowerCase() === parsed.projectName!.toLowerCase())
          : workspaces;

        for (const workspace of searchWorkspaces) {
          const reviewPath = path.join(workspace.path, 'reviews', parsed.itemId, 'review.md');
          if (await FileSystemUtils.fileExists(reviewPath)) {
            matches.push({
              type: 'review',
              path: path.join(workspace.path, 'reviews', parsed.itemId),
              workspacePath: workspace.path,
              projectName: workspace.projectName,
            });
          }
        }
      } else if (type === 'spec') {
        const specResult = await itemRetrieval.getSpecById(parentId);
        if (specResult) {
          matches.push({
            type: 'spec',
            path: path.join(specResult.workspacePath, 'specs', parsed.itemId),
            workspacePath: specResult.workspacePath,
            projectName: specResult.projectName,
          });
        }
      }
    }

    // Handle results
    if (matches.length === 0) {
      return null;
    }

    if (matches.length === 1) {
      return matches[0];
    }

    // Multiple matches - ambiguous
    const matchDescriptions = matches
      .map(m => `  - ${m.type}: workspace/${m.type === 'change' ? 'changes' : m.type === 'review' ? 'reviews' : 'specs'}/${parsed.itemId}/`)
      .join('\n');

    throw new Error(
      `Parent ID '${parentId}' matches multiple types:\n${matchDescriptions}\nUse --parent-type to specify: plx create task "Title" --parent-id ${parentId} --parent-type change`
    );
  }

  async createTask(title: string, options: TaskOptions): Promise<void> {
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

    if (!options.parentId) {
      if (options.json) {
        console.log(JSON.stringify({
          error: 'Standalone tasks not yet supported. Use --parent-id to link to a change or review.'
        }));
      } else {
        ora().fail('Standalone tasks not yet supported. Use --parent-id to link to a change or review.');
      }
      process.exitCode = 1;
      return;
    }

    let resolved: ResolvedParent | null = null;
    try {
      resolved = await this.resolveParent(options.parentId, options.parentType, workspaces);
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ error: (error as Error).message }));
      } else {
        ora().fail((error as Error).message);
      }
      process.exitCode = 1;
      return;
    }

    if (!resolved) {
      if (options.json) {
        console.log(JSON.stringify({
          error: `Parent not found: ${options.parentId}`
        }));
      } else {
        ora().fail(`Parent not found: ${options.parentId}`);
      }
      process.exitCode = 1;
      return;
    }

    // Specs cannot have tasks directly attached
    if (resolved.type === 'spec') {
      if (options.json) {
        console.log(JSON.stringify({
          error: 'Specs cannot have tasks directly attached. Tasks must be linked to a change or review.'
        }));
      } else {
        ora().fail('Specs cannot have tasks directly attached. Tasks must be linked to a change or review.');
      }
      process.exitCode = 1;
      return;
    }

    const parentWorkspacePath = resolved.workspacePath;
    const actualParentType = resolved.type;

    // Use centralized task storage
    const tasksDir = path.join(parentWorkspacePath, 'tasks');
    await FileSystemUtils.createDirectory(tasksDir);

    // Parse the parent ID to get the item ID without workspace prefix
    const parsePrefixedId = (id: string): string => {
      const slashIndex = id.indexOf('/');
      if (slashIndex === -1) {
        return id;
      }
      return id.substring(slashIndex + 1);
    };
    const parentItemId = parsePrefixedId(options.parentId);

    // Find next sequence number by scanning existing tasks for this parent
    let nextSequence = 1;
    try {
      const existingTasks = await fs.readdir(tasksDir);
      const parentPrefix = `${parentItemId}-`;
      const parentTasks = existingTasks.filter(f =>
        f.endsWith('.md') && f.substring(4).startsWith(parentPrefix)
      );
      const sortedTasks = sortTaskFilesBySequence(parentTasks);

      if (sortedTasks.length > 0) {
        const lastTask = sortedTasks[sortedTasks.length - 1];
        const match = lastTask.match(/^(\d+)-/);
        if (match) {
          nextSequence = parseInt(match[1], 10) + 1;
        }
      }
    } catch {
      // Directory might not exist yet
    }

    const kebabTitle = this.toKebabCase(title);
    const filename = buildTaskFilename({
      sequence: nextSequence,
      parentId: parentItemId,
      name: kebabTitle,
    });
    const filepath = path.join(tasksDir, filename);

    const content = TemplateManager.getTaskTemplate({
      title,
      skillLevel: options.skillLevel,
      parentType: actualParentType,
      parentId: parentItemId,
    });

    await FileSystemUtils.writeFile(filepath, content);

    const relativePath = path.relative(process.cwd(), filepath);

    if (options.json) {
      console.log(JSON.stringify({
        success: true,
        type: 'task',
        path: relativePath,
        parentId: parentItemId,
        parentType: actualParentType,
        taskId: `${parentItemId}-${kebabTitle}`,
      }, null, 2));
    } else {
      console.log(chalk.green(`\n✓ Created task: ${relativePath}\n`));
    }
  }

  async createChange(name: string, options: ChangeOptions): Promise<void> {
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

    const workspace = workspaces[0];
    const kebabName = this.toKebabCase(name);
    const changeDir = path.join(workspace.path, 'changes', kebabName);

    if (await FileSystemUtils.directoryExists(changeDir)) {
      if (options.json) {
        console.log(JSON.stringify({
          error: `Change already exists: ${kebabName}`
        }));
      } else {
        ora().fail(`Change already exists: ${kebabName}`);
      }
      process.exitCode = 1;
      return;
    }

    await FileSystemUtils.createDirectory(changeDir);
    await FileSystemUtils.createDirectory(path.join(changeDir, 'tasks'));
    await FileSystemUtils.createDirectory(path.join(changeDir, 'specs'));

    const proposalContent = TemplateManager.getChangeTemplate({ name });
    const proposalPath = path.join(changeDir, 'proposal.md');
    await FileSystemUtils.writeFile(proposalPath, proposalContent);

    const relativePath = path.relative(process.cwd(), changeDir);

    if (options.json) {
      console.log(JSON.stringify({
        success: true,
        type: 'change',
        path: relativePath,
      }, null, 2));
    } else {
      console.log(chalk.green(`\n✓ Created change: ${relativePath}`));
      console.log(chalk.dim(`  - proposal.md`));
      console.log(chalk.dim(`  - tasks/ (empty)`));
      console.log(chalk.dim(`  - specs/ (empty)`));
      console.log();
    }
  }

  async createSpec(name: string, options: SpecOptions): Promise<void> {
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

    const workspace = workspaces[0];
    const kebabName = this.toKebabCase(name);
    const specDir = path.join(workspace.path, 'specs', kebabName);

    if (await FileSystemUtils.directoryExists(specDir)) {
      if (options.json) {
        console.log(JSON.stringify({
          error: `Spec already exists: ${kebabName}`
        }));
      } else {
        ora().fail(`Spec already exists: ${kebabName}`);
      }
      process.exitCode = 1;
      return;
    }

    await FileSystemUtils.createDirectory(specDir);

    const specContent = TemplateManager.getSpecTemplate({ name });
    const specPath = path.join(specDir, 'spec.md');
    await FileSystemUtils.writeFile(specPath, specContent);

    const relativePath = path.relative(process.cwd(), specDir);

    if (options.json) {
      console.log(JSON.stringify({
        success: true,
        type: 'spec',
        path: relativePath,
      }, null, 2));
    } else {
      console.log(chalk.green(`\n✓ Created spec: ${relativePath}`));
      console.log(chalk.dim(`  - spec.md`));
      console.log();
    }
  }

  async createRequest(description: string, options: RequestOptions): Promise<void> {
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

    const workspace = workspaces[0];
    const kebabName = this.toKebabCase(description);
    const changeDir = path.join(workspace.path, 'changes', kebabName);

    if (await FileSystemUtils.directoryExists(changeDir)) {
      if (options.json) {
        console.log(JSON.stringify({
          error: `Request already exists: ${kebabName}`
        }));
      } else {
        ora().fail(`Request already exists: ${kebabName}`);
      }
      process.exitCode = 1;
      return;
    }

    await FileSystemUtils.createDirectory(changeDir);

    const requestContent = TemplateManager.getRequestTemplate({ description });
    const requestPath = path.join(changeDir, 'request.md');
    await FileSystemUtils.writeFile(requestPath, requestContent);

    const relativePath = path.relative(process.cwd(), changeDir);

    if (options.json) {
      console.log(JSON.stringify({
        success: true,
        type: 'request',
        path: relativePath,
      }, null, 2));
    } else {
      console.log(chalk.green(`\n✓ Created request: ${relativePath}`));
      console.log(chalk.dim(`  - request.md`));
      console.log();
    }
  }

  async createProgress(options: ProgressOptions): Promise<void> {
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

    const itemRetrieval = await ItemRetrievalService.create(
      process.cwd(),
      workspaces.map(w => ({
        path: w.path,
        relativePath: path.relative(process.cwd(), w.path),
        projectName: w.projectName,
        isRoot: true,
      }))
    );

    // Get the change
    const change = await itemRetrieval.getChangeById(options.changeId);
    if (!change) {
      if (options.json) {
        console.log(JSON.stringify({ error: `Change not found: ${options.changeId}` }));
      } else {
        ora().fail(`Change not found: ${options.changeId}`);
      }
      process.exitCode = 1;
      return;
    }

    // Get tasks for this change and filter to non-completed
    const allOpenTasks = await itemRetrieval.getAllOpenTasks('change');
    const changeTasks = allOpenTasks.filter(t => t.parentId === options.changeId);

    if (changeTasks.length === 0) {
      if (options.json) {
        console.log(JSON.stringify({ error: 'All tasks are complete. Nothing to generate.' }));
      } else {
        ora().fail('All tasks are complete. Nothing to generate.');
      }
      process.exitCode = 1;
      return;
    }

    // Sort tasks by sequence
    changeTasks.sort((a, b) => a.task.sequence - b.task.sequence);

    // Read task contents
    const tasksWithContent = await Promise.all(changeTasks.map(async (t) => {
      let content = '';
      try {
        content = await fs.readFile(t.task.filepath, 'utf-8');
      } catch {
        content = '*Task content could not be read*';
      }
      return { ...t, content };
    }));

    // Generate PROGRESS.md content
    const progressContent = this.generateProgressContent(options.changeId, change.proposal, tasksWithContent);

    // Write to workspace directory
    const progressPath = path.join(change.workspacePath, 'PROGRESS.md');
    await FileSystemUtils.writeFile(progressPath, progressContent);

    const relativePath = path.relative(process.cwd(), progressPath);

    if (options.json) {
      console.log(JSON.stringify({
        success: true,
        type: 'progress',
        path: relativePath,
        changeId: options.changeId,
        taskCount: changeTasks.length,
      }, null, 2));
    } else {
      console.log(chalk.green(`\n✓ Created progress file: ${relativePath}`));
      console.log(chalk.dim(`  - ${changeTasks.length} task(s) included`));
      console.log();
    }
  }

  private generateProgressContent(
    changeId: string,
    proposal: string,
    tasks: Array<{
      taskId: string;
      task: { filename: string; filepath: string; sequence: number; name: string };
      status: string;
      content: string;
    }>
  ): string {
    const lines: string[] = [];

    lines.push(`# Implementation Progress: ${changeId}`);
    lines.push('');
    lines.push('## Tasks Overview');
    lines.push('');

    // Task checklist
    for (const t of tasks) {
      const checkbox = t.status === 'in-progress' ? '- [~]' : '- [ ]';
      const statusLabel = t.status === 'in-progress' ? ' (in-progress)' : '';
      lines.push(`${checkbox} Task ${t.task.sequence}: ${t.task.name}${statusLabel}`);
    }

    lines.push('');
    lines.push('---');
    lines.push('');

    // Extract proposal context once (reused for all tasks)
    const proposalContext = this.extractProposalContext(proposal);

    // Each task as a self-contained block
    for (const t of tasks) {
      lines.push(`## Task ${t.task.sequence}: ${t.task.name}`);
      lines.push('');
      lines.push(`**Status:** ${t.status}`);
      lines.push(`**Task ID:** ${t.taskId}`);
      lines.push('');

      lines.push('### Context');
      lines.push('');
      lines.push('<details>');
      lines.push('<summary>Proposal Context (click to expand)</summary>');
      lines.push('');
      lines.push(proposalContext);
      lines.push('</details>');
      lines.push('');

      lines.push('### Task Details');
      lines.push('');
      lines.push(this.stripFrontmatter(t.content));
      lines.push('');

      lines.push('### Agent Instructions');
      lines.push('');
      lines.push('Pick up this task and implement it according to the specifications above.');
      lines.push('Focus on the Constraints and Acceptance Criteria sections.');
      lines.push('When complete, mark the task as done:');
      lines.push('');
      lines.push('```bash');
      lines.push(`plx complete task --id ${t.taskId}`);
      lines.push('```');
      lines.push('');
      lines.push('---');
      lines.push('');
    }

    return lines.join('\n');
  }

  private extractProposalContext(proposal: string): string {
    const lines = proposal.split('\n');
    const result: string[] = [];
    let inSection = false;

    for (const line of lines) {
      if (line.startsWith('## Why') || line.startsWith('## What Changes')) {
        inSection = true;
        result.push(line);
      } else if (line.startsWith('## ') && inSection) {
        inSection = false;
      } else if (inSection) {
        result.push(line);
      }
    }

    return result.join('\n').trim() || proposal;
  }

  private stripFrontmatter(content: string): string {
    const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
    return content.replace(frontmatterRegex, '').trim();
  }
}
