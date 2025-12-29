import { promises as fs } from 'fs';
import path from 'path';

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
