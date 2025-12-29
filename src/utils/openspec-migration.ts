import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { PLX_DIR_NAME, PLX_MARKERS } from '../core/config.js';

export const OPENSPEC_DIR_NAME = 'openspec';

export const OPENSPEC_MARKERS = {
  start: '<!-- OPENSPEC:START -->',
  end: '<!-- OPENSPEC:END -->'
};

const MARKER_FILE_EXTENSIONS = ['.md', '.ts', '.js', '.json', '.yaml', '.yml', '.toml'];

const SKIP_DIRECTORIES = ['node_modules', '.git', 'dist'];

export interface MigrationResult {
  migrated: boolean;
  directoryMigrated: boolean;
  markerFilesUpdated: number;
  globalConfigMigrated: boolean;
  errors: string[];
}

/**
 * Checks if an openspec/ directory exists at the given project path.
 */
export async function detectOpenSpecProject(projectPath: string): Promise<boolean> {
  const openspecDir = path.join(projectPath, OPENSPEC_DIR_NAME);
  try {
    const stat = await fs.stat(openspecDir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Moves all contents from openspec/ to workspace/ and deletes openspec/.
 */
export async function migrateDirectoryStructure(
  projectPath: string
): Promise<{ migrated: boolean; error?: string }> {
  const openspecDir = path.join(projectPath, OPENSPEC_DIR_NAME);
  const workspaceDir = path.join(projectPath, PLX_DIR_NAME);

  try {
    const openspecExists = await directoryExists(openspecDir);
    if (!openspecExists) {
      return { migrated: false };
    }

    await fs.mkdir(workspaceDir, { recursive: true });
    await moveContents(openspecDir, workspaceDir);
    await fs.rm(openspecDir, { recursive: true });

    return { migrated: true };
  } catch (error: any) {
    const message = error.code === 'EACCES' || error.code === 'EPERM'
      ? `Permission denied when migrating directory: ${error.message}`
      : `Failed to migrate directory: ${error.message}`;
    return { migrated: false, error: message };
  }
}

async function moveContents(srcDir: string, destDir: string): Promise<void> {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await moveContents(srcPath, destPath);
    } else {
      await fs.rename(srcPath, destPath);
    }
  }
}

/**
 * Replaces OPENSPEC markers with PLX markers in a single file.
 * Returns true if any replacements were made.
 */
export async function migrateMarkersInFile(filePath: string): Promise<boolean> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    const hasOpenspecStart = content.includes(OPENSPEC_MARKERS.start);
    const hasOpenspecEnd = content.includes(OPENSPEC_MARKERS.end);

    if (!hasOpenspecStart && !hasOpenspecEnd) {
      return false;
    }

    let updatedContent = content;
    if (hasOpenspecStart) {
      updatedContent = updatedContent.split(OPENSPEC_MARKERS.start).join(PLX_MARKERS.start);
    }
    if (hasOpenspecEnd) {
      updatedContent = updatedContent.split(OPENSPEC_MARKERS.end).join(PLX_MARKERS.end);
    }

    await fs.writeFile(filePath, updatedContent, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

/**
 * Recursively scans a project for files with marker extensions and migrates markers.
 * Returns the count of files modified.
 */
export async function migrateAllMarkers(projectPath: string): Promise<number> {
  let modifiedCount = 0;

  async function scanDirectory(dirPath: string): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          if (SKIP_DIRECTORIES.includes(entry.name)) {
            continue;
          }
          await scanDirectory(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (MARKER_FILE_EXTENSIONS.includes(ext)) {
            const migrated = await migrateMarkersInFile(fullPath);
            if (migrated) {
              modifiedCount++;
            }
          }
        }
      }
    } catch {
      // Silently skip directories that cannot be read
    }
  }

  await scanDirectory(projectPath);
  return modifiedCount;
}

/**
 * Moves ~/.openspec/ to ~/.plx/.
 * Skips if ~/.plx/ already exists.
 * Returns true if migrated.
 */
export async function migrateGlobalConfig(): Promise<boolean> {
  const homeDir = os.homedir();
  const openspecGlobal = path.join(homeDir, '.openspec');
  const plxGlobal = path.join(homeDir, '.plx');

  try {
    const openspecExists = await directoryExists(openspecGlobal);
    if (!openspecExists) {
      return false;
    }

    const plxExists = await directoryExists(plxGlobal);
    if (plxExists) {
      return false;
    }

    await fs.rename(openspecGlobal, plxGlobal);
    return true;
  } catch {
    return false;
  }
}

/**
 * Orchestrator function that migrates an OpenSpec project to PLX.
 * Silent when no OpenSpec artifacts are found.
 */
export async function migrateOpenSpecProject(projectPath: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    migrated: false,
    directoryMigrated: false,
    markerFilesUpdated: 0,
    globalConfigMigrated: false,
    errors: []
  };

  const dirResult = await migrateDirectoryStructure(projectPath);
  result.directoryMigrated = dirResult.migrated;
  if (dirResult.error) {
    result.errors.push(dirResult.error);
  }

  result.markerFilesUpdated = await migrateAllMarkers(projectPath);

  result.globalConfigMigrated = await migrateGlobalConfig();

  result.migrated = result.directoryMigrated ||
    result.markerFilesUpdated > 0 ||
    result.globalConfigMigrated;

  return result;
}

async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}
