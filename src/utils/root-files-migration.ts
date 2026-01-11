import { promises as fs } from 'fs';
import path from 'path';
import { FileSystemUtils } from './file-system.js';

export const PUBLIC_TEMPLATE_FILES = [
  'ARCHITECTURE.md',
  'REVIEW.md',
  'RELEASE.md',
  'TESTING.md',
  'PROGRESS.md'
] as const;

export interface RootFilesMigrationResult {
  migratedCount: number;
  migratedFiles: string[];
  errors: string[];
}

/**
 * Detects root files that exist and need migration.
 * Returns array of filenames that exist in project root.
 */
export async function detectRootFiles(projectPath: string): Promise<string[]> {
  const detectedFiles: string[] = [];

  for (const fileName of PUBLIC_TEMPLATE_FILES) {
    const filePath = path.join(projectPath, fileName);
    if (await FileSystemUtils.fileExists(filePath)) {
      detectedFiles.push(fileName);
    }
  }

  return detectedFiles;
}

/**
 * Migrates root files to workspace directory.
 * - If file exists in root but not workspace: move it
 * - If file exists in both: keep workspace version, delete root version
 * - If file exists only in workspace: skip
 * Returns result with migrated count and any errors.
 */
export async function migrateRootFiles(
  projectPath: string,
  workspacePath: string
): Promise<RootFilesMigrationResult> {
  const result: RootFilesMigrationResult = {
    migratedCount: 0,
    migratedFiles: [],
    errors: []
  };

  // Check if there are any root files to migrate first
  const rootFilesToMigrate: string[] = [];
  for (const fileName of PUBLIC_TEMPLATE_FILES) {
    const rootFilePath = path.join(projectPath, fileName);
    if (await FileSystemUtils.fileExists(rootFilePath)) {
      rootFilesToMigrate.push(fileName);
    }
  }

  // Only create workspace directory if there are files to migrate
  if (rootFilesToMigrate.length === 0) {
    return result;
  }

  // Ensure workspace directory exists
  await FileSystemUtils.createDirectory(workspacePath);

  for (const fileName of rootFilesToMigrate) {
    const rootFilePath = path.join(projectPath, fileName);
    const workspaceFilePath = path.join(workspacePath, fileName);

    try {
      const rootExists = await FileSystemUtils.fileExists(rootFilePath);
      const workspaceExists = await FileSystemUtils.fileExists(workspaceFilePath);

      if (!rootExists) {
        // File doesn't exist in root, skip
        continue;
      }

      if (workspaceExists) {
        // Both exist: keep workspace version, delete root version
        try {
          await fs.unlink(rootFilePath);
          result.migratedCount++;
          result.migratedFiles.push(fileName);
        } catch (error: any) {
          const message = error.code === 'EACCES' || error.code === 'EPERM'
            ? `Permission denied when deleting root file ${fileName}: ${error.message}`
            : `Failed to delete root file ${fileName}: ${error.message}`;
          result.errors.push(message);
        }
      } else {
        // Root exists but workspace doesn't: move it
        try {
          await fs.rename(rootFilePath, workspaceFilePath);
          result.migratedCount++;
          result.migratedFiles.push(fileName);
        } catch (error: any) {
          const message = error.code === 'EACCES' || error.code === 'EPERM'
            ? `Permission denied when migrating ${fileName}: ${error.message}`
            : `Failed to migrate ${fileName}: ${error.message}`;
          result.errors.push(message);
        }
      }
    } catch (error: any) {
      const message = `Unexpected error processing ${fileName}: ${error.message}`;
      result.errors.push(message);
    }
  }

  return result;
}
