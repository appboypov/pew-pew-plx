import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import { ClipboardUtils } from '../utils/clipboard.js';
import { FileSystemUtils } from '../utils/file-system.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import { TemplateManager } from '../core/templates/index.js';
import { ItemRetrievalService } from '../services/item-retrieval.js';
import { sortTaskFilesBySequence, buildTaskFilename } from '../utils/task-file-parser.js';

interface RequestOptions {
  json?: boolean;
}

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

interface ResolvedParent {
  type: 'change' | 'review' | 'spec';
  path: string;
  workspacePath: string;
  projectName: string;
}

export class PasteCommand {
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
      `Parent ID '${parentId}' matches multiple types:\n${matchDescriptions}\nUse --parent-type to specify: plx paste task --parent-id ${parentId} --parent-type change`
    );
  }

  async request(options: RequestOptions = {}): Promise<void> {
    try {
      // Discover workspaces - use root if exists, else first child
      const workspaces = await getFilteredWorkspaces(process.cwd());

      // Determine the drafts path - fallback to cwd/workspace/drafts if no workspaces found
      let draftsPath: string;
      if (workspaces.length === 0) {
        // Fallback to creating workspace/drafts in current directory
        draftsPath = path.join(process.cwd(), 'workspace', 'drafts');
      } else {
        // Prefer root workspace, fall back to first child
        const targetWorkspace = workspaces.find((w) => w.isRoot) || workspaces[0];
        draftsPath = path.join(targetWorkspace.path, 'drafts');
      }
      const requestFilePath = path.join(draftsPath, 'request.md');

      const content = ClipboardUtils.read();
      await FileSystemUtils.writeFile(requestFilePath, content);

      // Compute relative path from cwd for display
      const relativePath = path.relative(process.cwd(), requestFilePath);

      if (options.json) {
        console.log(JSON.stringify({
          path: relativePath,
          characters: content.length,
          success: true
        }, null, 2));
      } else {
        ora().succeed(`Saved request to ${relativePath} (${content.length} characters)`);
      }
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ error: (error as Error).message }));
        process.exit(1);
      } else {
        throw error;
      }
    }
  }

  async task(options: TaskOptions): Promise<void> {
    try {
      // Read clipboard content
      const clipboardContent = ClipboardUtils.read();

      // Extract title from first line, use rest as End Goal content
      const lines = clipboardContent.split('\n');
      const title = lines[0].trim();
      const endGoalContent = clipboardContent.trim();

      if (!title) {
        if (options.json) {
          console.log(JSON.stringify({ error: 'Clipboard is empty' }));
        } else {
          ora().fail('Clipboard is empty');
        }
        process.exitCode = 1;
        return;
      }

      // Get workspaces
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

      // Require parent ID
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

      // Resolve parent
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

      // Get base template and inject clipboard content into End Goal
      const templateContent = TemplateManager.getTaskTemplate({
        title,
        skillLevel: options.skillLevel,
        parentType: actualParentType,
        parentId: parentItemId,
      });

      const content = templateContent.replace(
        '## End Goal\nTBD - What this task accomplishes.',
        `## End Goal\n${endGoalContent}`
      );

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
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ error: (error as Error).message }));
        process.exitCode = 1;
      } else {
        throw error;
      }
    }
  }

  async change(options: ChangeOptions = {}): Promise<void> {
    try {
      // Read clipboard content
      const clipboardContent = ClipboardUtils.read();

      if (!clipboardContent.trim()) {
        if (options.json) {
          console.log(JSON.stringify({ error: 'Clipboard is empty' }));
        } else {
          ora().fail('Clipboard is empty');
        }
        process.exitCode = 1;
        return;
      }

      // Get workspaces
      const workspaces = await getFilteredWorkspaces(process.cwd());

      if (workspaces.length === 0) {
        if (options.json) {
          console.log(JSON.stringify({ error: 'No workspace found. Run plx init first.' }));
        } else {
          ora().fail('No workspace found. Run plx init first.');
        }
        process.exitCode = 1;
        return;
      }

      const workspace = workspaces[0];

      // Extract first line and convert to kebab-case
      const lines = clipboardContent.split('\n');
      const firstLine = lines[0].trim();
      let baseName = this.toKebabCase(firstLine);

      // Detect verb prefix from first line
      const verbPrefixes = ['add', 'update', 'fix', 'refactor', 'remove', 'create', 'implement', 'enable', 'disable'];
      const words = firstLine.toLowerCase().split(/\s+/);
      const firstWord = words[0];

      let changeName = baseName;
      const hasVerbPrefix = verbPrefixes.some(verb => baseName.startsWith(`${verb}-`));

      if (!hasVerbPrefix) {
        // Prepend draft- if no recognized verb prefix
        changeName = `draft-${baseName}`;
      }

      // Handle duplicate names with numeric suffix
      const changesDir = path.join(workspace.path, 'changes');
      await FileSystemUtils.createDirectory(changesDir);

      let finalChangeName = changeName;
      let suffix = 2;
      let changeDir = path.join(changesDir, finalChangeName);

      while (await FileSystemUtils.directoryExists(changeDir)) {
        finalChangeName = `${changeName}-${suffix}`;
        changeDir = path.join(changesDir, finalChangeName);
        suffix++;
      }

      // Create change directory structure
      await FileSystemUtils.createDirectory(changeDir);
      await FileSystemUtils.createDirectory(path.join(changeDir, 'tasks'));
      await FileSystemUtils.createDirectory(path.join(changeDir, 'specs'));

      // Get template and inject clipboard content into Why section
      const templateContent = TemplateManager.getChangeTemplate({ name: finalChangeName });
      const content = templateContent.replace(
        '## Why\nTBD - 1-2 sentences on problem/opportunity',
        `## Why\n${clipboardContent}`
      );

      // Write proposal.md
      const proposalPath = path.join(changeDir, 'proposal.md');
      await FileSystemUtils.writeFile(proposalPath, content);

      const relativePath = path.relative(process.cwd(), changeDir);

      if (options.json) {
        console.log(JSON.stringify({
          success: true,
          type: 'change',
          path: relativePath,
          changeName: finalChangeName,
        }, null, 2));
      } else {
        console.log(chalk.green(`\n✓ Created change: ${relativePath}`));
        console.log(chalk.dim(`  - proposal.md (Why section populated from clipboard)`));
        console.log(chalk.dim(`  - tasks/ (empty)`));
        console.log(chalk.dim(`  - specs/ (empty)`));
        console.log();
      }
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ error: (error as Error).message }));
        process.exitCode = 1;
      } else {
        throw error;
      }
    }
  }

  async spec(options: SpecOptions = {}): Promise<void> {
    try {
      // Read clipboard content
      const clipboardContent = ClipboardUtils.read();

      if (!clipboardContent.trim()) {
        if (options.json) {
          console.log(JSON.stringify({ error: 'Clipboard is empty' }));
        } else {
          ora().fail('Clipboard is empty');
        }
        process.exitCode = 1;
        return;
      }

      // Get workspaces
      const workspaces = await getFilteredWorkspaces(process.cwd());

      if (workspaces.length === 0) {
        if (options.json) {
          console.log(JSON.stringify({ error: 'No workspace found. Run plx init first.' }));
        } else {
          ora().fail('No workspace found. Run plx init first.');
        }
        process.exitCode = 1;
        return;
      }

      const workspace = workspaces[0];

      // Extract first line and convert to kebab-case
      const lines = clipboardContent.split('\n');
      const firstLine = lines[0].trim();
      const specName = this.toKebabCase(firstLine);

      // Check if spec already exists (no auto-suffix for specs)
      const specsDir = path.join(workspace.path, 'specs');
      await FileSystemUtils.createDirectory(specsDir);

      const specDir = path.join(specsDir, specName);
      if (await FileSystemUtils.directoryExists(specDir)) {
        if (options.json) {
          console.log(JSON.stringify({ error: `Spec already exists: ${specName}` }));
        } else {
          ora().fail(`Spec already exists: ${specName}`);
        }
        process.exitCode = 1;
        return;
      }

      // Create spec directory
      await FileSystemUtils.createDirectory(specDir);

      // Get template and inject clipboard content into first requirement
      const templateContent = TemplateManager.getSpecTemplate({ name: specName });
      const content = templateContent.replace(
        '### Requirement: Example Requirement\nTBD - Describe what the system SHALL provide.',
        `### Requirement: Example Requirement\n${clipboardContent}`
      );

      // Write spec.md
      const specPath = path.join(specDir, 'spec.md');
      await FileSystemUtils.writeFile(specPath, content);

      const relativePath = path.relative(process.cwd(), specDir);

      if (options.json) {
        console.log(JSON.stringify({
          success: true,
          type: 'spec',
          path: relativePath,
          specName: specName,
        }, null, 2));
      } else {
        console.log(chalk.green(`\n✓ Created spec: ${relativePath}`));
        console.log(chalk.dim(`  - spec.md (first requirement populated from clipboard)`));
        console.log();
      }
    } catch (error) {
      if (options.json) {
        console.log(JSON.stringify({ error: (error as Error).message }));
        process.exitCode = 1;
      } else {
        throw error;
      }
    }
  }
}
