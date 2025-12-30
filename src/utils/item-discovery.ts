import { promises as fs } from 'fs';
import path from 'path';
import { DiscoveredWorkspace, isMultiWorkspace } from './workspace-discovery.js';

export interface ChangeIdWithWorkspace {
  id: string;
  workspacePath: string;
  projectName: string;
  displayId: string;
}

export interface SpecIdWithWorkspace {
  id: string;
  workspacePath: string;
  projectName: string;
  displayId: string;
}

export interface ReviewIdWithWorkspace {
  id: string;
  workspacePath: string;
  projectName: string;
  displayId: string;
}

export async function getActiveChangeIds(root: string = process.cwd()): Promise<string[]> {
  const changesPath = path.join(root, 'workspace', 'changes');
  try {
    const entries = await fs.readdir(changesPath, { withFileTypes: true });
    const result: string[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === 'archive') continue;
      const proposalPath = path.join(changesPath, entry.name, 'proposal.md');
      try {
        await fs.access(proposalPath);
        result.push(entry.name);
      } catch {
        // skip directories without proposal.md
      }
    }
    return result.sort();
  } catch {
    return [];
  }
}

export async function getSpecIds(root: string = process.cwd()): Promise<string[]> {
  const specsPath = path.join(root, 'workspace', 'specs');
  const result: string[] = [];
  try {
    const entries = await fs.readdir(specsPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const specFile = path.join(specsPath, entry.name, 'spec.md');
      try {
        await fs.access(specFile);
        result.push(entry.name);
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
  return result.sort();
}

export async function getArchivedChangeIds(root: string = process.cwd()): Promise<string[]> {
  const archivePath = path.join(root, 'workspace', 'changes', 'archive');
  try {
    const entries = await fs.readdir(archivePath, { withFileTypes: true });
    const result: string[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const proposalPath = path.join(archivePath, entry.name, 'proposal.md');
      try {
        await fs.access(proposalPath);
        result.push(entry.name);
      } catch {
        // skip directories without proposal.md
      }
    }
    return result.sort();
  } catch {
    return [];
  }
}

export async function getActiveReviewIds(root: string = process.cwd()): Promise<string[]> {
  const reviewsPath = path.join(root, 'workspace', 'reviews');
  try {
    const entries = await fs.readdir(reviewsPath, { withFileTypes: true });
    const result: string[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === 'archive') continue;
      const reviewPath = path.join(reviewsPath, entry.name, 'review.md');
      try {
        await fs.access(reviewPath);
        result.push(entry.name);
      } catch {
        // skip directories without review.md
      }
    }
    return result.sort();
  } catch {
    return [];
  }
}

export async function getArchivedReviewIds(root: string = process.cwd()): Promise<string[]> {
  const archivePath = path.join(root, 'workspace', 'reviews', 'archive');
  try {
    const entries = await fs.readdir(archivePath, { withFileTypes: true });
    const result: string[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const reviewPath = path.join(archivePath, entry.name, 'review.md');
      try {
        await fs.access(reviewPath);
        result.push(entry.name);
      } catch {
        // skip directories without review.md
      }
    }
    return result.sort();
  } catch {
    return [];
  }
}

function sortWithWorkspace<T extends { projectName: string; id: string }>(items: T[]): T[] {
  return items.sort((a, b) => {
    if (!a.projectName && b.projectName) return -1;
    if (a.projectName && !b.projectName) return 1;
    const projCmp = a.projectName.localeCompare(b.projectName);
    if (projCmp !== 0) return projCmp;
    return a.id.localeCompare(b.id);
  });
}

export async function getActiveChangeIdsMulti(
  workspaces: DiscoveredWorkspace[]
): Promise<ChangeIdWithWorkspace[]> {
  const isMulti = isMultiWorkspace(workspaces);
  const results: ChangeIdWithWorkspace[] = [];

  for (const workspace of workspaces) {
    const parentDir = path.dirname(workspace.path);
    const ids = await getActiveChangeIds(parentDir);

    for (const id of ids) {
      results.push({
        id,
        workspacePath: workspace.path,
        projectName: workspace.projectName,
        displayId: isMulti && workspace.projectName ? `${workspace.projectName}/${id}` : id,
      });
    }
  }

  return sortWithWorkspace(results);
}

export async function getSpecIdsMulti(
  workspaces: DiscoveredWorkspace[]
): Promise<SpecIdWithWorkspace[]> {
  const isMulti = isMultiWorkspace(workspaces);
  const results: SpecIdWithWorkspace[] = [];

  for (const workspace of workspaces) {
    const parentDir = path.dirname(workspace.path);
    const ids = await getSpecIds(parentDir);

    for (const id of ids) {
      results.push({
        id,
        workspacePath: workspace.path,
        projectName: workspace.projectName,
        displayId: isMulti && workspace.projectName ? `${workspace.projectName}/${id}` : id,
      });
    }
  }

  return sortWithWorkspace(results);
}

export async function getActiveReviewIdsMulti(
  workspaces: DiscoveredWorkspace[]
): Promise<ReviewIdWithWorkspace[]> {
  const isMulti = isMultiWorkspace(workspaces);
  const results: ReviewIdWithWorkspace[] = [];

  for (const workspace of workspaces) {
    const parentDir = path.dirname(workspace.path);
    const ids = await getActiveReviewIds(parentDir);

    for (const id of ids) {
      results.push({
        id,
        workspacePath: workspace.path,
        projectName: workspace.projectName,
        displayId: isMulti && workspace.projectName ? `${workspace.projectName}/${id}` : id,
      });
    }
  }

  return sortWithWorkspace(results);
}

export async function getArchivedChangeIdsMulti(
  workspaces: DiscoveredWorkspace[]
): Promise<ChangeIdWithWorkspace[]> {
  const isMulti = isMultiWorkspace(workspaces);
  const results: ChangeIdWithWorkspace[] = [];

  for (const workspace of workspaces) {
    const parentDir = path.dirname(workspace.path);
    const ids = await getArchivedChangeIds(parentDir);

    for (const id of ids) {
      results.push({
        id,
        workspacePath: workspace.path,
        projectName: workspace.projectName,
        displayId: isMulti && workspace.projectName ? `${workspace.projectName}/${id}` : id,
      });
    }
  }

  return sortWithWorkspace(results);
}

export async function getArchivedReviewIdsMulti(
  workspaces: DiscoveredWorkspace[]
): Promise<ReviewIdWithWorkspace[]> {
  const isMulti = isMultiWorkspace(workspaces);
  const results: ReviewIdWithWorkspace[] = [];

  for (const workspace of workspaces) {
    const parentDir = path.dirname(workspace.path);
    const ids = await getArchivedReviewIds(parentDir);

    for (const id of ids) {
      results.push({
        id,
        workspacePath: workspace.path,
        projectName: workspace.projectName,
        displayId: isMulti && workspace.projectName ? `${workspace.projectName}/${id}` : id,
      });
    }
  }

  return sortWithWorkspace(results);
}
