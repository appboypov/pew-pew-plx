import { promises as fs } from 'fs';
import path from 'path';
import { ParentType, PLX_DIR_NAME, TASKS_DIR_NAME, AI_TOOLS, PLX_MARKERS } from '../core/config.js';
import {
  DiscoveredWorkspace,
  discoverWorkspaces,
  isValidPlxWorkspace,
} from '../utils/workspace-discovery.js';
import {
  discoverTasks,
  filterTasksByParent,
  DiscoveredTask,
  getTasksDir,
} from '../utils/centralized-task-discovery.js';
import {
  buildTaskFilename,
  parseTaskFilename,
} from '../utils/task-file-parser.js';
import { FileSystemUtils } from '../utils/file-system.js';
import { ToolRegistry } from '../core/configurators/registry.js';
import { SlashCommandRegistry } from '../core/configurators/slash/registry.js';

export type TransferEntityType = 'change' | 'spec' | 'task' | 'review' | 'request';

export interface TransferItem {
  sourcePath: string;
  targetPath: string;
  type: 'directory' | 'file';
  /** For spec transfers with rename: maps old spec name to new spec name for delta directory renaming */
  specRename?: { oldName: string; newName: string };
}

export interface TaskRenumber {
  sourcePath: string;
  targetPath: string;
  oldSequence: number;
  newSequence: number;
  oldFilename: string;
  newFilename: string;
  parentIdUpdate?: { old: string; new: string };
}

export interface ConflictInfo {
  type: 'entity' | 'task';
  id: string;
  existingPath: string;
}

export interface TransferPlan {
  entityType: TransferEntityType;
  entityId: string;
  sourcePath: string;
  targetPath: string;
  targetName: string;
  requiresInit: boolean;
  filesToMove: TransferItem[];
  tasksToRenumber: TaskRenumber[];
  conflicts: ConflictInfo[];
}

export interface TransferResult {
  success: boolean;
  movedFiles: string[];
  renamedTasks: string[];
  errors: string[];
}

interface SourceWorkspaceInfo {
  workspace: DiscoveredWorkspace;
  projectRoot: string;
}

/**
 * Service for transferring PLX entities between workspaces.
 * Supports move semantics with cascade logic for linked entities.
 */
export class TransferService {
  private sourceWorkspace: DiscoveredWorkspace | null = null;
  private targetWorkspace: DiscoveredWorkspace | null = null;
  private sourceProjectRoot: string = '';
  private targetProjectRoot: string = '';

  private constructor() {}

  /**
   * Creates a TransferService instance.
   */
  static async create(): Promise<TransferService> {
    return new TransferService();
  }

  /**
   * Resolves and sets the source workspace.
   */
  async setSourceWorkspace(sourcePath: string): Promise<void> {
    const info = await this.resolveWorkspace(sourcePath);
    if (!info) {
      throw new Error(`No valid PLX workspace found at: ${sourcePath}`);
    }
    this.sourceWorkspace = info.workspace;
    this.sourceProjectRoot = info.projectRoot;
  }

  /**
   * Resolves and sets the target workspace path.
   * The workspace may not exist yet (requiresInit will be true).
   */
  async setTargetWorkspace(targetPath: string): Promise<{ requiresInit: boolean }> {
    const resolvedPath = path.resolve(targetPath);
    const isValid = await isValidPlxWorkspace(resolvedPath);

    if (isValid) {
      const workspaces = await discoverWorkspaces(resolvedPath);
      const workspace = workspaces.find(w => w.isRoot);
      if (workspace) {
        this.targetWorkspace = workspace;
        this.targetProjectRoot = resolvedPath;
        return { requiresInit: false };
      }
    }

    // Target workspace doesn't exist or isn't valid
    this.targetWorkspace = {
      path: path.join(resolvedPath, PLX_DIR_NAME),
      relativePath: '.',
      projectName: path.basename(resolvedPath),
      isRoot: true,
    };
    this.targetProjectRoot = resolvedPath;
    return { requiresInit: true };
  }

  /**
   * Gets the source workspace.
   */
  getSourceWorkspace(): DiscoveredWorkspace | null {
    return this.sourceWorkspace;
  }

  /**
   * Gets the target workspace.
   */
  getTargetWorkspace(): DiscoveredWorkspace | null {
    return this.targetWorkspace;
  }

  /**
   * Builds a complete transfer plan for the given entity.
   */
  async buildTransferPlan(
    entityType: TransferEntityType,
    entityId: string,
    targetName?: string
  ): Promise<TransferPlan> {
    if (!this.sourceWorkspace || !this.targetWorkspace) {
      throw new Error('Source and target workspaces must be set before building transfer plan');
    }

    if (!entityId || entityId.trim() === '') {
      throw new Error('Entity ID cannot be empty');
    }

    const requiresInit = !(await isValidPlxWorkspace(this.targetProjectRoot));
    const resolvedTargetName = targetName || entityId;

    const plan: TransferPlan = {
      entityType,
      entityId,
      sourcePath: this.sourceWorkspace.path,
      targetPath: this.targetWorkspace.path,
      targetName: resolvedTargetName,
      requiresInit,
      filesToMove: [],
      tasksToRenumber: [],
      conflicts: [],
    };

    // Build files to move based on entity type
    switch (entityType) {
      case 'change':
        await this.planChangeTransfer(plan, entityId, resolvedTargetName);
        break;
      case 'spec':
        await this.planSpecTransfer(plan, entityId, resolvedTargetName);
        break;
      case 'task':
        await this.planTaskTransfer(plan, entityId, resolvedTargetName);
        break;
      case 'review':
        await this.planReviewTransfer(plan, entityId, resolvedTargetName);
        break;
      case 'request':
        await this.planRequestTransfer(plan, entityId);
        break;
    }

    // Detect conflicts if target workspace exists
    if (!requiresInit) {
      await this.detectConflicts(plan);
    }

    return plan;
  }

  /**
   * Executes a transfer plan.
   * Copy files first, then delete source files after successful copy.
   */
  async executeTransfer(plan: TransferPlan, dryRun: boolean = false): Promise<TransferResult> {
    const result: TransferResult = {
      success: true,
      movedFiles: [],
      renamedTasks: [],
      errors: [],
    };

    if (plan.conflicts.length > 0) {
      result.success = false;
      result.errors.push(
        `Cannot transfer: ${plan.conflicts.length} conflict(s) detected. ` +
        `Use --target-name to rename the entity or resolve conflicts manually.`
      );
      return result;
    }

    if (dryRun) {
      return result;
    }

    try {
      // Create target directories
      await this.createTargetDirectories(plan);

      // Copy files (directories first, then files)
      const directories = plan.filesToMove.filter(f => f.type === 'directory');
      const files = plan.filesToMove.filter(f => f.type === 'file');

      for (const dir of directories) {
        if (dir.sourcePath) {
          await this.copyDirectory(dir.sourcePath, dir.targetPath, dir.specRename);
        } else {
          // Create directory if sourcePath is empty (minimal structure creation)
          await fs.mkdir(dir.targetPath, { recursive: true });
        }
        result.movedFiles.push(dir.targetPath);
      }

      for (const file of files) {
        await this.copyFile(file.sourcePath, file.targetPath);
        result.movedFiles.push(file.targetPath);
      }

      // Copy and renumber tasks
      for (const taskRenumber of plan.tasksToRenumber) {
        await this.copyAndRenumberTask(taskRenumber);
        result.renamedTasks.push(taskRenumber.newFilename);
      }

      // Delete source files after successful copy
      for (const dir of directories) {
        if (dir.sourcePath) {
          await fs.rm(dir.sourcePath, { recursive: true, force: true });
        }
      }

      for (const file of files) {
        await fs.unlink(file.sourcePath);
      }

      for (const taskRenumber of plan.tasksToRenumber) {
        await fs.unlink(taskRenumber.sourcePath);
      }
    } catch (error: any) {
      result.success = false;
      result.errors.push(`Transfer failed: ${error.message}`);
    }

    return result;
  }

  /**
   * Finds all tasks linked to a change.
   */
  async findLinkedTasks(
    parentId: string,
    parentType: ParentType
  ): Promise<DiscoveredTask[]> {
    if (!this.sourceWorkspace) {
      throw new Error('Source workspace must be set');
    }

    const result = await discoverTasks(this.sourceWorkspace);
    return filterTasksByParent(result.tasks, parentId, parentType);
  }

  /**
   * Finds all changes that have delta specs for a given spec.
   */
  async findRelatedChanges(specId: string): Promise<string[]> {
    if (!this.sourceWorkspace) {
      throw new Error('Source workspace must be set');
    }

    const changesDir = path.join(this.sourceWorkspace.path, 'changes');
    const relatedChanges: string[] = [];

    try {
      const entries = await fs.readdir(changesDir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name === 'archive' || entry.name.startsWith('.')) {
          continue;
        }

        const specDeltaPath = path.join(changesDir, entry.name, 'specs', specId);
        try {
          const stat = await fs.stat(specDeltaPath);
          if (stat.isDirectory()) {
            relatedChanges.push(entry.name);
          }
        } catch {
          // No delta for this spec in this change
        }
      }
    } catch {
      // Changes directory doesn't exist
    }

    return relatedChanges;
  }

  /**
   * Calculates new sequence numbers for tasks in the target workspace.
   */
  async calculateTaskRenumbering(
    tasks: DiscoveredTask[],
    newParentId?: string,
    newTaskName?: string
  ): Promise<TaskRenumber[]> {
    if (!this.targetWorkspace) {
      throw new Error('Target workspace must be set');
    }

    // Find highest sequence in target
    let highestSequence = 0;
    try {
      const targetTasksDir = getTasksDir(this.targetWorkspace.path);
      const entries = await fs.readdir(targetTasksDir);
      for (const entry of entries) {
        const parsed = parseTaskFilename(entry);
        if (parsed && parsed.sequence > highestSequence) {
          highestSequence = parsed.sequence;
        }
      }
    } catch {
      // Target tasks directory doesn't exist yet
    }

    const renumbers: TaskRenumber[] = [];

    for (const task of tasks) {
      highestSequence++;
      const parsed = parseTaskFilename(task.filename, !!task.parentId);

      const newFilename = buildTaskFilename({
        sequence: highestSequence,
        name: newTaskName || parsed?.name || 'task',
        parentId: newParentId || task.parentId,
      });

      const renumber: TaskRenumber = {
        sourcePath: task.filepath,
        targetPath: path.join(getTasksDir(this.targetWorkspace.path), newFilename),
        oldSequence: task.sequence,
        newSequence: highestSequence,
        oldFilename: task.filename,
        newFilename,
      };

      if (newParentId && task.parentId && newParentId !== task.parentId) {
        renumber.parentIdUpdate = {
          old: task.parentId,
          new: newParentId,
        };
      }

      renumbers.push(renumber);
    }

    return renumbers;
  }

  /**
   * Detects conflicts in the target workspace.
   */
  async detectConflicts(plan: TransferPlan): Promise<void> {
    if (!this.targetWorkspace) return;

    // Check for entity conflicts
    const targetEntityPath = this.getEntityPath(
      this.targetWorkspace.path,
      plan.entityType,
      plan.targetName
    );

    if (targetEntityPath) {
      try {
        await fs.access(targetEntityPath);
        plan.conflicts.push({
          type: 'entity',
          id: plan.targetName,
          existingPath: targetEntityPath,
        });
      } catch {
        // Entity doesn't exist in target
      }
    }

    // Check for conflicts in cascaded files and directories to move
    // Skip the primary entity (already checked above) and empty sourcePaths (created, not moved)
    for (const item of plan.filesToMove) {
      if (!item.sourcePath) continue;
      if (item.targetPath === targetEntityPath) continue;

      try {
        await fs.access(item.targetPath);
        const entityId = path.basename(item.targetPath);
        plan.conflicts.push({
          type: 'entity',
          id: entityId,
          existingPath: item.targetPath,
        });
      } catch {
        // Target doesn't exist, no conflict
      }
    }

    // Check for task filename conflicts
    for (const taskRenumber of plan.tasksToRenumber) {
      try {
        await fs.access(taskRenumber.targetPath);
        plan.conflicts.push({
          type: 'task',
          id: taskRenumber.newFilename,
          existingPath: taskRenumber.targetPath,
        });
      } catch {
        // Task doesn't exist in target
      }
    }
  }

  /**
   * Gets the source project root path.
   */
  getSourceProjectRoot(): string {
    return this.sourceProjectRoot;
  }

  /**
   * Gets the target project root path.
   */
  getTargetProjectRoot(): string {
    return this.targetProjectRoot;
  }

  /**
   * Extracts configured tool IDs from the source workspace.
   * Scans for tool-specific files with PLX markers.
   */
  async extractSourceToolConfig(): Promise<string[]> {
    if (!this.sourceProjectRoot) {
      throw new Error('Source workspace must be set');
    }

    const configuredTools: string[] = [];

    for (const tool of AI_TOOLS.filter(t => t.available)) {
      const isConfigured = await this.isToolConfigured(this.sourceProjectRoot, tool.value);
      if (isConfigured) {
        configuredTools.push(tool.value);
      }
    }

    return configuredTools;
  }

  /**
   * Initializes the target workspace with the given tools.
   * Uses the same logic as `plx init --tools <tools>`.
   */
  async initializeTargetWorkspace(toolIds: string[]): Promise<void> {
    if (!this.targetProjectRoot) {
      throw new Error('Target workspace must be set');
    }

    const workspacePath = path.join(this.targetProjectRoot, PLX_DIR_NAME);

    // Create directory structure
    await this.createWorkspaceStructure(workspacePath);

    // Generate template files
    await this.generateTemplateFiles(this.targetProjectRoot, workspacePath);

    // Configure AI tools
    await this.configureAITools(this.targetProjectRoot, PLX_DIR_NAME, toolIds);
  }

  /**
   * Updates parent-id in task frontmatter.
   */
  updateTaskFrontmatter(content: string, newParentId: string): string {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const parentIdRegex = /^parent-id:\s*.+$/m;

    const match = content.match(frontmatterRegex);
    if (!match) {
      return content;
    }

    const frontmatter = match[1];
    const updatedFrontmatter = frontmatter.replace(
      parentIdRegex,
      `parent-id: ${newParentId}`
    );

    return `---\n${updatedFrontmatter}\n---${content.slice(match[0].length)}`;
  }

  // Private helper methods

  private async resolveWorkspace(workspacePath: string): Promise<SourceWorkspaceInfo | null> {
    const resolvedPath = path.resolve(workspacePath);

    if (await isValidPlxWorkspace(resolvedPath)) {
      const workspaces = await discoverWorkspaces(resolvedPath);
      const workspace = workspaces.find(w => w.isRoot);
      if (workspace) {
        return { workspace, projectRoot: resolvedPath };
      }
    }

    return null;
  }

  private getEntityPath(
    workspacePath: string,
    entityType: TransferEntityType,
    entityId: string
  ): string | null {
    switch (entityType) {
      case 'change':
        return path.join(workspacePath, 'changes', entityId);
      case 'spec':
        return path.join(workspacePath, 'specs', entityId);
      case 'review':
        return path.join(workspacePath, 'reviews', entityId);
      case 'request':
        // Requests are stored inside their parent change directory
        return path.join(workspacePath, 'changes', entityId, 'request.md');
      case 'task':
        return null; // Tasks are handled via renumbering
      default:
        return null;
    }
  }

  private async planChangeTransfer(
    plan: TransferPlan,
    changeId: string,
    targetName: string
  ): Promise<void> {
    const sourceChangePath = path.join(this.sourceWorkspace!.path, 'changes', changeId);
    const targetChangePath = path.join(this.targetWorkspace!.path, 'changes', targetName);

    // Add change directory
    plan.filesToMove.push({
      sourcePath: sourceChangePath,
      targetPath: targetChangePath,
      type: 'directory',
    });

    // Find and plan linked tasks
    const linkedTasks = await this.findLinkedTasks(changeId, 'change');
    const newParentId = targetName !== changeId ? targetName : undefined;
    const taskRenumbers = await this.calculateTaskRenumbering(linkedTasks, newParentId);
    plan.tasksToRenumber.push(...taskRenumbers);
  }

  private async planSpecTransfer(
    plan: TransferPlan,
    specId: string,
    targetName: string
  ): Promise<void> {
    const sourceSpecPath = path.join(this.sourceWorkspace!.path, 'specs', specId);
    const targetSpecPath = path.join(this.targetWorkspace!.path, 'specs', targetName);

    // Add spec directory
    plan.filesToMove.push({
      sourcePath: sourceSpecPath,
      targetPath: targetSpecPath,
      type: 'directory',
    });

    // Find related changes and their tasks
    const relatedChanges = await this.findRelatedChanges(specId);
    const isRename = targetName !== specId;

    for (const changeId of relatedChanges) {
      const sourceChangePath = path.join(this.sourceWorkspace!.path, 'changes', changeId);
      const targetChangePath = path.join(this.targetWorkspace!.path, 'changes', changeId);

      plan.filesToMove.push({
        sourcePath: sourceChangePath,
        targetPath: targetChangePath,
        type: 'directory',
        // Include spec rename info so delta directories are renamed during copy
        ...(isRename && { specRename: { oldName: specId, newName: targetName } }),
      });

      // Find and plan linked tasks for this change
      const linkedTasks = await this.findLinkedTasks(changeId, 'change');
      const taskRenumbers = await this.calculateTaskRenumbering(linkedTasks);
      plan.tasksToRenumber.push(...taskRenumbers);
    }
  }

  private async planTaskTransfer(
    plan: TransferPlan,
    taskId: string,
    targetName: string
  ): Promise<void> {
    const taskFilename = taskId.endsWith('.md') ? taskId : `${taskId}.md`;

    // Find the task to get its details
    const result = await discoverTasks(this.sourceWorkspace!);
    const task = result.tasks.find(t => t.filename === taskFilename);

    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // Use targetName for renaming if different from original task name
    const newTaskName = targetName !== taskId ? targetName : undefined;
    const taskRenumbers = await this.calculateTaskRenumbering([task], undefined, newTaskName);
    plan.tasksToRenumber.push(...taskRenumbers);
  }

  private async planReviewTransfer(
    plan: TransferPlan,
    reviewId: string,
    targetName: string
  ): Promise<void> {
    const sourceReviewPath = path.join(this.sourceWorkspace!.path, 'reviews', reviewId);
    const targetReviewPath = path.join(this.targetWorkspace!.path, 'reviews', targetName);

    // Add review directory
    plan.filesToMove.push({
      sourcePath: sourceReviewPath,
      targetPath: targetReviewPath,
      type: 'directory',
    });

    // Find and plan linked tasks
    const linkedTasks = await this.findLinkedTasks(reviewId, 'review');
    const newParentId = targetName !== reviewId ? targetName : undefined;
    const taskRenumbers = await this.calculateTaskRenumbering(linkedTasks, newParentId);
    plan.tasksToRenumber.push(...taskRenumbers);
  }

  private async planRequestTransfer(
    plan: TransferPlan,
    changeId: string
  ): Promise<void> {
    const sourceRequestPath = path.join(
      this.sourceWorkspace!.path,
      'changes',
      changeId,
      'request.md'
    );
    const targetChangePath = path.join(
      this.targetWorkspace!.path,
      'changes',
      changeId
    );
    const targetRequestPath = path.join(targetChangePath, 'request.md');

    // Check if target change directory exists; if not, mark for creation
    const targetChangeExists = await this.directoryExists(targetChangePath);
    if (!targetChangeExists) {
      plan.filesToMove.push({
        sourcePath: '', // Will be created, not moved
        targetPath: targetChangePath,
        type: 'directory',
      });
    }

    plan.filesToMove.push({
      sourcePath: sourceRequestPath,
      targetPath: targetRequestPath,
      type: 'file',
    });
  }

  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  private async createTargetDirectories(plan: TransferPlan): Promise<void> {
    // Create base workspace directories
    const dirs = ['changes', 'specs', 'reviews', 'requests', TASKS_DIR_NAME];
    for (const dir of dirs) {
      const dirPath = path.join(plan.targetPath, dir);
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  private async copyDirectory(
    source: string,
    target: string,
    specRename?: { oldName: string; newName: string }
  ): Promise<void> {
    await fs.mkdir(target, { recursive: true });

    const entries = await fs.readdir(source, { withFileTypes: true });
    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      let targetEntryName = entry.name;

      // Handle spec delta directory renaming inside cascaded changes
      // Directory structure: changes/{changeId}/specs/{specId}/spec.md
      if (specRename && entry.isDirectory() && entry.name === specRename.oldName) {
        const parentDir = path.basename(path.dirname(sourcePath));
        if (parentDir === 'specs') {
          targetEntryName = specRename.newName;
        }
      }

      const targetPath = path.join(target, targetEntryName);

      if (entry.isDirectory()) {
        await this.copyDirectory(sourcePath, targetPath, specRename);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  }

  private async copyFile(source: string, target: string): Promise<void> {
    const targetDir = path.dirname(target);
    await fs.mkdir(targetDir, { recursive: true });
    await fs.copyFile(source, target);
  }

  private async copyAndRenumberTask(taskRenumber: TaskRenumber): Promise<void> {
    let content = await fs.readFile(taskRenumber.sourcePath, 'utf-8');

    // Update parent-id if needed
    if (taskRenumber.parentIdUpdate) {
      content = this.updateTaskFrontmatter(content, taskRenumber.parentIdUpdate.new);
    }

    // Ensure target directory exists
    const targetDir = path.dirname(taskRenumber.targetPath);
    await fs.mkdir(targetDir, { recursive: true });

    await fs.writeFile(taskRenumber.targetPath, content, 'utf-8');
  }

  /**
   * Checks if a specific tool is configured in a project (has PLX markers).
   */
  private async isToolConfigured(projectPath: string, toolId: string): Promise<boolean> {
    const fileHasMarkers = async (absolutePath: string): Promise<boolean> => {
      try {
        const content = await FileSystemUtils.readFile(absolutePath);
        return content.includes(PLX_MARKERS.start) && content.includes(PLX_MARKERS.end);
      } catch {
        return false;
      }
    };

    let hasConfigFile = false;
    let hasSlashCommands = false;

    const configFile = ToolRegistry.get(toolId)?.configFileName;
    if (configFile) {
      const configPath = path.join(projectPath, configFile);
      hasConfigFile = (await FileSystemUtils.fileExists(configPath)) && (await fileHasMarkers(configPath));
    }

    const slashConfigurator = SlashCommandRegistry.get(toolId);
    if (slashConfigurator) {
      for (const target of slashConfigurator.getTargets()) {
        const absolute = slashConfigurator.resolveAbsolutePath(projectPath, target.id);
        if ((await FileSystemUtils.fileExists(absolute)) && (await fileHasMarkers(absolute))) {
          hasSlashCommands = true;
          break;
        }
      }
    }

    const hasConfigFileRequirement = configFile !== undefined;
    const hasSlashCommandRequirement = slashConfigurator !== undefined;

    if (hasConfigFileRequirement && hasSlashCommandRequirement) {
      return hasConfigFile && hasSlashCommands;
    } else if (hasConfigFileRequirement) {
      return hasConfigFile;
    } else if (hasSlashCommandRequirement) {
      return hasSlashCommands;
    }

    return false;
  }

  /**
   * Creates the workspace directory structure.
   */
  private async createWorkspaceStructure(workspacePath: string): Promise<void> {
    const directories = [
      workspacePath,
      path.join(workspacePath, 'specs'),
      path.join(workspacePath, 'changes'),
      path.join(workspacePath, 'changes', 'archive'),
      path.join(workspacePath, 'reviews'),
      path.join(workspacePath, 'requests'),
      path.join(workspacePath, TASKS_DIR_NAME),
    ];

    for (const dir of directories) {
      await FileSystemUtils.createDirectory(dir);
    }
  }

  /**
   * Generates template files for a new workspace.
   */
  private async generateTemplateFiles(projectPath: string, workspacePath: string): Promise<void> {
    const { TemplateManager } = await import('../core/templates/index.js');

    const templates = TemplateManager.getTemplates();
    for (const template of templates) {
      const filePath = path.join(workspacePath, template.path);
      if (!(await FileSystemUtils.fileExists(filePath))) {
        await FileSystemUtils.writeFile(filePath, template.content);
      }
    }

    const architecturePath = path.join(projectPath, 'ARCHITECTURE.md');
    if (!(await FileSystemUtils.fileExists(architecturePath))) {
      const architectureContent = TemplateManager.getArchitectureTemplate();
      await FileSystemUtils.writeFile(architecturePath, architectureContent);
    }

    const reviewPath = path.join(projectPath, 'REVIEW.md');
    if (!(await FileSystemUtils.fileExists(reviewPath))) {
      const reviewContent = TemplateManager.getReviewTemplate();
      await FileSystemUtils.writeFile(reviewPath, reviewContent);
    }

    const releasePath = path.join(projectPath, 'RELEASE.md');
    if (!(await FileSystemUtils.fileExists(releasePath))) {
      const releaseContent = TemplateManager.getReleaseTemplate();
      await FileSystemUtils.writeFile(releasePath, releaseContent);
    }

    const testingPath = path.join(projectPath, 'TESTING.md');
    if (!(await FileSystemUtils.fileExists(testingPath))) {
      const testingContent = TemplateManager.getTestingTemplate();
      await FileSystemUtils.writeFile(testingPath, testingContent);
    }
  }

  /**
   * Configures AI tools for the workspace.
   */
  private async configureAITools(
    projectPath: string,
    workspaceDir: string,
    toolIds: string[]
  ): Promise<void> {
    // Configure root AGENTS.md stub
    const agentsConfigurator = ToolRegistry.get('agents');
    if (agentsConfigurator && agentsConfigurator.isAvailable) {
      await agentsConfigurator.configure(projectPath, workspaceDir);
    }

    // Configure each selected tool
    for (const toolId of toolIds) {
      const configurator = ToolRegistry.get(toolId);
      if (configurator && configurator.isAvailable) {
        await configurator.configure(projectPath, workspaceDir);
      }

      const slashConfigurator = SlashCommandRegistry.get(toolId);
      if (slashConfigurator && slashConfigurator.isAvailable) {
        await slashConfigurator.generateAll(projectPath);
      }
    }
  }
}
