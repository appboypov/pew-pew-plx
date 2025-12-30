import { promises as fs } from 'fs';
import path from 'path';

export interface DiscoveredWorkspace {
  path: string;
  relativePath: string;
  projectName: string;
  isRoot: boolean;
}

export const MAX_DEPTH = 5;

export const SKIP_DIRECTORIES = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '__pycache__',
  'venv',
  'coverage',
  '.cache',
] as const;

async function scanDirectory(
  currentPath: string,
  root: string,
  depth: number,
  workspaces: DiscoveredWorkspace[]
): Promise<void> {
  if (depth > MAX_DEPTH) {
    return;
  }

  try {
    const workspacePath = path.join(currentPath, 'workspace');
    try {
      const stats = await fs.stat(workspacePath);
      if (stats.isDirectory()) {
        const isRoot = currentPath === root;
        const projectName = isRoot ? '' : path.basename(currentPath);
        const relativePath = isRoot ? '.' : path.relative(root, currentPath);

        workspaces.push({
          path: workspacePath,
          relativePath,
          projectName,
          isRoot,
        });
      }
    } catch {
      // workspace/ subdirectory doesn't exist, continue scanning
    }

    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      if (entry.name.startsWith('.')) {
        continue;
      }

      if (SKIP_DIRECTORIES.includes(entry.name as typeof SKIP_DIRECTORIES[number])) {
        continue;
      }

      if (entry.name === 'workspace') {
        continue;
      }

      const childPath = path.join(currentPath, entry.name);
      await scanDirectory(childPath, root, depth + 1, workspaces);
    }
  } catch {
    // Cannot read directory, skip it
  }
}

export async function discoverWorkspaces(root: string): Promise<DiscoveredWorkspace[]> {
  const workspaces: DiscoveredWorkspace[] = [];
  await scanDirectory(root, root, 0, workspaces);

  return workspaces.sort((a, b) => {
    if (a.isRoot && !b.isRoot) return -1;
    if (!a.isRoot && b.isRoot) return 1;
    return a.projectName.localeCompare(b.projectName);
  });
}

export function isMultiWorkspace(workspaces: DiscoveredWorkspace[]): boolean {
  return workspaces.length > 1;
}

export function getWorkspacePrefix(workspace: DiscoveredWorkspace, isMulti: boolean): string {
  if (!isMulti) {
    return '';
  }
  return workspace.projectName ? `${workspace.projectName}/` : '';
}

export function filterWorkspaces(
  workspaces: DiscoveredWorkspace[],
  filter: string
): DiscoveredWorkspace[] {
  const normalizedFilter = filter.toLowerCase();
  return workspaces.filter(
    (workspace) => workspace.projectName.toLowerCase() === normalizedFilter
  );
}
