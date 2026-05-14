import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { ClipboardUtils } from '../utils/clipboard.js';
import { FileSystemUtils } from '../utils/file-system.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import { TemplateManager } from '../core/templates/index.js';
import { buildTaskFilename } from '../utils/task-file-parser.js';
import { toKebabCase, parseItemId, buildTaskFrontmatter } from '../utils/task-utils.js';
import { ParentResolverService, ResolvedParent } from '../services/parent-resolver.js';
import { getNextTaskSequenceForParent } from '../utils/centralized-task-discovery.js';

interface RequestOptions {
  json?: boolean;
}

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

export class PasteCommand {
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
          ora().fail('No workspace found. Run splx init first.');
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
        resolved = await ParentResolverService.resolve(
          options.parentId,
          options.parentType,
          workspaces,
          'splx paste task'
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

          // Replace the End Goal section content with clipboard content
          // Use function form to prevent $& $' $` $n special replacement patterns
          let body = templateResult.body;
          const endGoalMatch = body.match(/## 🎯 End Goal\n[\s\S]*?(?=\n## |$)/);
          if (endGoalMatch) {
            body = body.replace(endGoalMatch[0], () => `## 🎯 End Goal\n${endGoalContent}`);
          }

          content = frontmatter + '\n\n' + body;
        } else {
          // Template not found - fall back to minimal structure with clipboard content
          templateWarning = templateResult.error || `Template '${options.type}' not found in workspace/templates/. Using minimal template.`;

          const frontmatter = buildTaskFrontmatter({
            status: 'to-do',
            skillLevel: options.skillLevel,
            parentType: actualParentType,
            parentId: parentItemId,
            type: options.type,
            blockedBy: options.blockedBy,
          });

          content = `${frontmatter}

# Task: ${title}

## 🎯 End Goal
${endGoalContent}
`;
        }
      } else {
        // No type specified - use simple format with clipboard content as body
        const frontmatter = buildTaskFrontmatter({
          status: 'to-do',
          skillLevel: options.skillLevel,
          parentType: actualParentType,
          parentId: parentItemId,
          blockedBy: options.blockedBy,
        });

        content = `${frontmatter}

# Task: ${title}

${endGoalContent}
`;
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
          console.log(JSON.stringify({ error: 'No workspace found. Run splx init first.' }));
        } else {
          ora().fail('No workspace found. Run splx init first.');
        }
        process.exitCode = 1;
        return;
      }

      const workspace = workspaces[0];

      // Extract first line and convert to kebab-case
      const lines = clipboardContent.split('\n');
      const firstLine = lines[0].trim();
      let baseName = toKebabCase(firstLine);

      // Detect verb prefix from first line
      const verbPrefixes = ['add', 'update', 'fix', 'refactor', 'remove', 'create', 'implement', 'enable', 'disable'];

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
          console.log(JSON.stringify({ error: 'No workspace found. Run splx init first.' }));
        } else {
          ora().fail('No workspace found. Run splx init first.');
        }
        process.exitCode = 1;
        return;
      }

      const workspace = workspaces[0];

      // Extract first line and convert to kebab-case
      const lines = clipboardContent.split('\n');
      const firstLine = lines[0].trim();
      const specName = toKebabCase(firstLine);

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
