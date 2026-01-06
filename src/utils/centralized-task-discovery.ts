import { promises as fs } from 'fs';
import path from 'path';
import {
  TASKS_DIR_NAME,
  TASKS_ARCHIVE_DIR_NAME,
  ParentType,
} from '../core/config.js';
import { DiscoveredWorkspace } from './workspace-discovery.js';
import {
  parseTaskFilename,
  sortTaskFilesBySequence,
} from './task-file-parser.js';
import {
  parseTaskParentInfo,
  parseStatus,
  parseSkillLevel,
  completeImplementationChecklist,
  TaskStatus,
  SkillLevel,
} from './task-status.js';

export interface DiscoveredTask {
  filename: string;
  filepath: string;
  sequence: number;
  name: string;
  content: string;
  status: TaskStatus;
  skillLevel?: SkillLevel;
  parentType?: ParentType;
  parentId?: string;
}

export interface TaskDiscoveryResult {
  tasks: DiscoveredTask[];
  workspacePath: string;
  projectName: string;
}

/**
 * Returns the absolute path to the tasks directory for a workspace.
 */
export function getTasksDir(workspacePath: string): string {
  return path.join(workspacePath, TASKS_DIR_NAME);
}

/**
 * Returns the absolute path to the tasks archive directory for a workspace.
 */
export function getTasksArchiveDir(workspacePath: string): string {
  return path.join(workspacePath, TASKS_DIR_NAME, TASKS_ARCHIVE_DIR_NAME);
}

/**
 * Discovers all active (non-archived) tasks in a workspace's centralized tasks folder.
 * Excludes tasks in the archive/ subdirectory.
 */
export async function discoverTasks(
  workspace: DiscoveredWorkspace
): Promise<TaskDiscoveryResult> {
  const tasksDir = getTasksDir(workspace.path);
  const tasks: DiscoveredTask[] = [];

  try {
    const entries = await fs.readdir(tasksDir);
    const taskFiles = sortTaskFilesBySequence(
      entries.filter((f) => f.endsWith('.md'))
    );

    for (const filename of taskFiles) {
      // Skip archive directory entries that might slip through
      if (filename === TASKS_ARCHIVE_DIR_NAME) continue;

      const filepath = path.join(tasksDir, filename);

      // Check if it's a file (not directory)
      try {
        const stat = await fs.stat(filepath);
        if (!stat.isFile()) continue;
      } catch {
        continue;
      }

      try {
        const rawContent = await fs.readFile(filepath, 'utf-8');
        const status = parseStatus(rawContent);

        // Lazy file update: if done, ensure Implementation Checklist is marked complete
        let content = rawContent;
        if (status === 'done') {
          const { updatedContent } = completeImplementationChecklist(rawContent);
          if (updatedContent !== rawContent) {
            try {
              await fs.writeFile(filepath, updatedContent, 'utf-8');
              content = updatedContent;
            } catch {
              // Write failed (read-only, disk full, etc.) - continue with original content
            }
          }
        }

        const skillLevel = parseSkillLevel(content);

        // Parse parent info from frontmatter
        let parentType: ParentType | undefined;
        let parentId: string | undefined;
        try {
          const parentInfo = parseTaskParentInfo(content);
          if (parentInfo) {
            parentType = parentInfo.parentType;
            parentId = parentInfo.parentId;
          }
        } catch {
          // Invalid frontmatter (missing one of parent-type/parent-id) - skip task
          continue;
        }

        // Parse filename with parent hint
        const parsed = parseTaskFilename(filename, !!parentId);
        if (!parsed) continue;

        tasks.push({
          filename,
          filepath,
          sequence: parsed.sequence,
          name: parsed.name,
          content,
          status,
          skillLevel,
          parentType,
          parentId,
        });
      } catch {
        // Skip files that can't be read
      }
    }
  } catch {
    // Tasks directory doesn't exist - return empty
  }

  return {
    tasks,
    workspacePath: workspace.path,
    projectName: workspace.projectName,
  };
}

/**
 * Filters discovered tasks by parent entity.
 * @param tasks Array of discovered tasks
 * @param parentId The parent ID to filter by
 * @param parentType Optional parent type filter
 * @returns Filtered tasks
 */
export function filterTasksByParent(
  tasks: DiscoveredTask[],
  parentId: string,
  parentType?: ParentType
): DiscoveredTask[] {
  return tasks.filter((task) => {
    if (task.parentId !== parentId) return false;
    if (parentType && task.parentType !== parentType) return false;
    return true;
  });
}

/**
 * Checks if there are parent-id conflicts (same ID, different parent types).
 * @returns Array of parent types that have this ID, or empty if no conflicts
 */
export function checkParentIdConflicts(
  tasks: DiscoveredTask[],
  parentId: string
): ParentType[] {
  const types = new Set<ParentType>();
  for (const task of tasks) {
    if (task.parentId === parentId && task.parentType) {
      types.add(task.parentType);
    }
  }
  return Array.from(types);
}

/**
 * Gets all tasks linked to a specific parent entity from centralized task storage.
 * @param workspacePath Absolute path to the workspace
 * @param parentId The parent entity ID to filter by
 * @param parentType The parent entity type (change, review, or spec)
 * @returns Array of tasks matching the parent, or empty array if none found
 */
export async function getTasksForParent(
  workspacePath: string,
  parentId: string,
  parentType: ParentType
): Promise<DiscoveredTask[]> {
  const workspace: DiscoveredWorkspace = {
    path: workspacePath,
    relativePath: '.',
    projectName: path.basename(path.dirname(workspacePath)),
    isRoot: true,
  };

  const result = await discoverTasks(workspace);
  return filterTasksByParent(result.tasks, parentId, parentType);
}

/**
 * Archives all tasks linked to a specific parent entity.
 * Moves task files from workspace/tasks/ to workspace/tasks/archive/.
 * Handles duplicate filenames by appending numeric suffixes.
 *
 * @param workspacePath Absolute path to the workspace
 * @param parentId The parent entity ID
 * @param parentType The parent entity type (change, review, or spec)
 * @returns Object containing moved task filenames and any errors
 */
export async function archiveTasksForParent(
  workspacePath: string,
  parentId: string,
  parentType: ParentType
): Promise<{ movedTasks: string[]; errors: string[] }> {
  const movedTasks: string[] = [];
  const errors: string[] = [];

  // Get all tasks for this parent
  const tasks = await getTasksForParent(workspacePath, parentId, parentType);

  if (tasks.length === 0) {
    return { movedTasks, errors };
  }

  // Create archive directory if needed
  const archiveDir = getTasksArchiveDir(workspacePath);
  try {
    await fs.mkdir(archiveDir, { recursive: true });
  } catch (error: any) {
    errors.push(`Failed to create archive directory: ${error.message}`);
    return { movedTasks, errors };
  }

  // Move each task to archive
  for (const task of tasks) {
    try {
      const filename = task.filename;
      const sourcePath = task.filepath;
      let targetPath = path.join(archiveDir, filename);

      // Handle duplicate filenames by adding numeric suffix
      let suffix = 2;
      while (true) {
        try {
          await fs.access(targetPath);
          // File exists, try next suffix
          const ext = path.extname(filename);
          const base = path.basename(filename, ext);
          targetPath = path.join(archiveDir, `${base}-${suffix}${ext}`);
          suffix++;
        } catch {
          // File doesn't exist, we can use this path
          break;
        }
      }

      // Move the file
      await fs.rename(sourcePath, targetPath);
      movedTasks.push(filename);
    } catch (error: any) {
      errors.push(`Failed to archive task ${task.filename}: ${error.message}`);
    }
  }

  return { movedTasks, errors };
}
