import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { TemplateManager, getAvailableTypes } from '../core/templates/index.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import { FileSystemUtils } from '../utils/file-system.js';
import { buildTaskFilename } from '../utils/task-file-parser.js';
import { toKebabCase, parseItemId, buildTaskFrontmatter } from '../utils/task-utils.js';
import { ParentResolverService, ResolvedParent } from '../services/parent-resolver.js';
import { getNextTaskSequenceForParent } from '../utils/centralized-task-discovery.js';

interface TaskOptions {
  parentId?: string;
  parentType?: 'change' | 'review' | 'spec';
  skillLevel?: 'junior' | 'medior' | 'senior';
  type?: string;
  blockedBy?: string[];
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

export class CreateCommand {
  async createTask(title: string, options: TaskOptions): Promise<void> {
    const workspaces = await getFilteredWorkspaces(process.cwd());

    if (workspaces.length === 0) {
      if (options.json) {
        console.log(JSON.stringify({ error: 'No workspace found' }));
      } else {
        ora().fail('No workspace found. Run splx init first.');
      }
      process.exitCode = 1;
      return;
    }

    // Validate type if provided
    if (options.type) {
      // Determine the workspace in which the task will be created.
      // If the parent ID is prefixed with a project name (e.g. "project-a/change-name"),
      // prefer the workspace whose projectName matches that prefix.
      let workspaceForTask = workspaces[0];
      if (options.parentId) {
        const slashIndex = options.parentId.indexOf('/');
        if (slashIndex > 0) {
          const projectPrefix = options.parentId.substring(0, slashIndex);
          const matchedWorkspace = workspaces.find(ws => ws.projectName === projectPrefix);
          if (matchedWorkspace) {
            workspaceForTask = matchedWorkspace;
          }
        }
      }

      const availableTypes = await getAvailableTypes(workspaceForTask.path);
      const typeExists = availableTypes.some(t => t.type === options.type);
      if (!typeExists) {
        const typeList = availableTypes.map(t => t.type).join(', ');
        if (options.json) {
          console.log(JSON.stringify({
            error: `Unknown task type '${options.type}'. Available types: ${typeList}`
          }));
        } else {
          ora().fail(`Unknown task type '${options.type}'. Available types: ${typeList}`);
        }
        process.exitCode = 1;
        return;
      }
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
      resolved = await ParentResolverService.resolve(
        options.parentId,
        options.parentType,
        workspaces,
        'splx create task "Title"'
      );
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

    const parentItemId = parseItemId(options.parentId);
    const nextSequence = await getNextTaskSequenceForParent(tasksDir, parentItemId);
    const kebabTitle = toKebabCase(title);
    const filename = buildTaskFilename({
      sequence: nextSequence,
      parentId: parentItemId,
      name: kebabTitle,
    });
    const filepath = path.join(tasksDir, filename);

    let content: string;
    let templateWarning: string | null = null;

    if (options.type) {
      // Try to read template from workspace/templates/<type>.md
      const templateResult = await TemplateManager.readWorkspaceTemplate(
        parentWorkspacePath,
        options.type,
        title
      );

      if (templateResult.found) {
        const frontmatter = buildTaskFrontmatter({
          status: 'to-do',
          skillLevel: options.skillLevel,
          parentType: actualParentType,
          parentId: parentItemId,
          type: options.type,
          blockedBy: options.blockedBy,
        });

        content = frontmatter + '\n\n' + templateResult.body;
      } else {
        // Template not found - fall back to generic template with warning
        templateWarning = templateResult.error || `Template '${options.type}' not found in workspace/templates/. Using generic template.`;
        content = TemplateManager.getTaskTemplate({
          title,
          skillLevel: options.skillLevel,
          parentType: actualParentType,
          parentId: parentItemId,
          type: options.type,
          blockedBy: options.blockedBy,
        });
      }
    } else {
      // No type specified - use generic template
      content = TemplateManager.getTaskTemplate({
        title,
        skillLevel: options.skillLevel,
        parentType: actualParentType,
        parentId: parentItemId,
        blockedBy: options.blockedBy,
      });
    }

    await FileSystemUtils.writeFile(filepath, content);

    const relativePath = path.relative(process.cwd(), filepath);

    if (options.json) {
      const result: Record<string, unknown> = {
        success: true,
        type: 'task',
        path: relativePath,
        parentId: parentItemId,
        parentType: actualParentType,
        taskId: `${parentItemId}-${kebabTitle}`,
      };
      if (options.type) {
        result.templateType = options.type;
      }
      if (options.blockedBy && options.blockedBy.length > 0) {
        result.blockedBy = options.blockedBy;
      }
      if (templateWarning) {
        result.warning = templateWarning;
      }
      console.log(JSON.stringify(result, null, 2));
    } else {
      if (templateWarning) {
        console.log(chalk.yellow(`\n⚠ ${templateWarning}`));
      }
      console.log(chalk.green(`\n✓ Created task: ${relativePath}`));
      if (options.type && !templateWarning) {
        console.log(chalk.dim(`  Using template: ${options.type}`));
      }
      if (options.blockedBy && options.blockedBy.length > 0) {
        console.log(chalk.dim(`  Blocked by: ${options.blockedBy.join(', ')}`));
      }
      console.log();
    }
  }

  async createChange(name: string, options: ChangeOptions): Promise<void> {
    const workspaces = await getFilteredWorkspaces(process.cwd());

    if (workspaces.length === 0) {
      if (options.json) {
        console.log(JSON.stringify({ error: 'No workspace found' }));
      } else {
        ora().fail('No workspace found. Run splx init first.');
      }
      process.exitCode = 1;
      return;
    }

    const workspace = workspaces[0];
    const kebabName = toKebabCase(name);
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
        ora().fail('No workspace found. Run splx init first.');
      }
      process.exitCode = 1;
      return;
    }

    const workspace = workspaces[0];
    const kebabName = toKebabCase(name);
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
        ora().fail('No workspace found. Run splx init first.');
      }
      process.exitCode = 1;
      return;
    }

    const workspace = workspaces[0];
    const kebabName = toKebabCase(description);
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
}
