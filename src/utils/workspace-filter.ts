import { discoverWorkspaces, filterWorkspaces, DiscoveredWorkspace } from './workspace-discovery.js';

/**
 * Gets the workspace filter from environment variable set by CLI.
 * Returns undefined if no filter is set.
 */
export function getWorkspaceFilter(): string | undefined {
  return process.env.PLX_WORKSPACE_FILTER;
}

/**
 * Discovers workspaces and applies the global filter if set.
 * Returns filtered workspaces or all workspaces if no filter.
 */
export async function getFilteredWorkspaces(root: string = process.cwd()): Promise<DiscoveredWorkspace[]> {
  const workspaces = await discoverWorkspaces(root);
  const filter = getWorkspaceFilter();

  if (!filter) {
    return workspaces;
  }

  const filtered = filterWorkspaces(workspaces, filter);

  if (filtered.length === 0) {
    const available = workspaces.map((w) => w.projectName).filter(Boolean);
    const message =
      available.length > 0
        ? `Workspace '${filter}' not found. Available: ${available.join(', ')}`
        : `Workspace '${filter}' not found. No workspaces discovered.`;
    throw new Error(message);
  }

  return filtered;
}
