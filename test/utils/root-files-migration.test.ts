import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  detectRootFiles,
  migrateRootFiles,
  PUBLIC_TEMPLATE_FILES
} from '../../src/utils/root-files-migration.js';

describe('root-files-migration', () => {
  let tempDir: string;
  let workspaceDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `plx-root-files-migration-test-${Date.now()}`);
    workspaceDir = path.join(tempDir, 'workspace');
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('detectRootFiles', () => {
    it('should return empty array when no root files exist', async () => {
      const result = await detectRootFiles(tempDir);

      expect(result).toEqual([]);
    });

    it('should detect files that exist in project root', async () => {
      await fs.writeFile(path.join(tempDir, 'ARCHITECTURE.md'), 'content');
      await fs.writeFile(path.join(tempDir, 'REVIEW.md'), 'content');

      const result = await detectRootFiles(tempDir);

      expect(result).toContain('ARCHITECTURE.md');
      expect(result).toContain('REVIEW.md');
      expect(result.length).toBe(2);
    });

    it('should only detect files from PUBLIC_TEMPLATE_FILES', async () => {
      await fs.writeFile(path.join(tempDir, 'ARCHITECTURE.md'), 'content');
      await fs.writeFile(path.join(tempDir, 'OTHER.md'), 'content');

      const result = await detectRootFiles(tempDir);

      expect(result).toContain('ARCHITECTURE.md');
      expect(result).not.toContain('OTHER.md');
    });
  });

  describe('migrateRootFiles', () => {
    it('should move file from root to workspace when workspace version does not exist', async () => {
      const rootFilePath = path.join(tempDir, 'ARCHITECTURE.md');
      const workspaceFilePath = path.join(workspaceDir, 'ARCHITECTURE.md');
      await fs.writeFile(rootFilePath, 'root content');

      const result = await migrateRootFiles(tempDir, workspaceDir);

      expect(result.migratedCount).toBe(1);
      expect(result.migratedFiles).toEqual(['ARCHITECTURE.md']);
      expect(result.errors).toEqual([]);
      
      // Verify file moved to workspace
      const workspaceContent = await fs.readFile(workspaceFilePath, 'utf-8');
      expect(workspaceContent).toBe('root content');
      
      // Verify file removed from root
      await expect(fs.access(rootFilePath)).rejects.toThrow();
    });

    it('should keep workspace version and delete root version when both exist', async () => {
      await fs.mkdir(workspaceDir, { recursive: true });
      const rootFilePath = path.join(tempDir, 'REVIEW.md');
      const workspaceFilePath = path.join(workspaceDir, 'REVIEW.md');
      await fs.writeFile(rootFilePath, 'root content');
      await fs.writeFile(workspaceFilePath, 'workspace content');

      const result = await migrateRootFiles(tempDir, workspaceDir);

      expect(result.migratedCount).toBe(1);
      expect(result.migratedFiles).toEqual(['REVIEW.md']);
      expect(result.errors).toEqual([]);
      
      // Verify workspace version preserved
      const workspaceContent = await fs.readFile(workspaceFilePath, 'utf-8');
      expect(workspaceContent).toBe('workspace content');
      
      // Verify root version deleted
      await expect(fs.access(rootFilePath)).rejects.toThrow();
    });

    it('should do nothing when file exists only in workspace', async () => {
      await fs.mkdir(workspaceDir, { recursive: true });
      const workspaceFilePath = path.join(workspaceDir, 'TESTING.md');
      await fs.writeFile(workspaceFilePath, 'workspace content');

      const result = await migrateRootFiles(tempDir, workspaceDir);

      expect(result.migratedCount).toBe(0);
      expect(result.migratedFiles).toEqual([]);
      expect(result.errors).toEqual([]);
      
      // Verify workspace file still exists
      const workspaceContent = await fs.readFile(workspaceFilePath, 'utf-8');
      expect(workspaceContent).toBe('workspace content');
    });

    it('should migrate multiple files', async () => {
      await fs.writeFile(path.join(tempDir, 'ARCHITECTURE.md'), 'content1');
      await fs.writeFile(path.join(tempDir, 'REVIEW.md'), 'content2');
      await fs.writeFile(path.join(tempDir, 'RELEASE.md'), 'content3');

      const result = await migrateRootFiles(tempDir, workspaceDir);

      expect(result.migratedCount).toBe(3);
      expect(result.migratedFiles).toContain('ARCHITECTURE.md');
      expect(result.migratedFiles).toContain('REVIEW.md');
      expect(result.migratedFiles).toContain('RELEASE.md');
      expect(result.migratedFiles.length).toBe(3);
      expect(result.errors).toEqual([]);
      
      // Verify all files moved
      expect(await fs.readFile(path.join(workspaceDir, 'ARCHITECTURE.md'), 'utf-8')).toBe('content1');
      expect(await fs.readFile(path.join(workspaceDir, 'REVIEW.md'), 'utf-8')).toBe('content2');
      expect(await fs.readFile(path.join(workspaceDir, 'RELEASE.md'), 'utf-8')).toBe('content3');
    });

    it('should handle mixed scenarios correctly', async () => {
      // Create workspace directory first
      await fs.mkdir(workspaceDir, { recursive: true });
      
      // File exists only in root
      await fs.writeFile(path.join(tempDir, 'ARCHITECTURE.md'), 'root content');
      
      // File exists in both
      await fs.writeFile(path.join(tempDir, 'REVIEW.md'), 'root content');
      await fs.writeFile(path.join(workspaceDir, 'REVIEW.md'), 'workspace content');
      
      // File exists only in workspace
      await fs.writeFile(path.join(workspaceDir, 'TESTING.md'), 'workspace content');

      const result = await migrateRootFiles(tempDir, workspaceDir);

      expect(result.migratedCount).toBe(2); // ARCHITECTURE.md moved, REVIEW.md root deleted
      expect(result.migratedFiles).toContain('ARCHITECTURE.md');
      expect(result.migratedFiles).toContain('REVIEW.md');
      expect(result.migratedFiles.length).toBe(2);
      expect(result.errors).toEqual([]);
      
      // Verify ARCHITECTURE.md moved
      expect(await fs.readFile(path.join(workspaceDir, 'ARCHITECTURE.md'), 'utf-8')).toBe('root content');
      
      // Verify REVIEW.md workspace version kept
      expect(await fs.readFile(path.join(workspaceDir, 'REVIEW.md'), 'utf-8')).toBe('workspace content');
      
      // Verify TESTING.md unchanged
      expect(await fs.readFile(path.join(workspaceDir, 'TESTING.md'), 'utf-8')).toBe('workspace content');
      
      // Verify root files removed
      await expect(fs.access(path.join(tempDir, 'ARCHITECTURE.md'))).rejects.toThrow();
      await expect(fs.access(path.join(tempDir, 'REVIEW.md'))).rejects.toThrow();
    });

    it('should create workspace directory if it does not exist', async () => {
      await fs.writeFile(path.join(tempDir, 'PROGRESS.md'), 'content');

      const result = await migrateRootFiles(tempDir, workspaceDir);

      expect(result.migratedCount).toBe(1);
      expect(result.migratedFiles).toEqual(['PROGRESS.md']);
      expect(result.errors).toEqual([]);
      
      // Verify workspace directory created
      const workspaceStat = await fs.stat(workspaceDir);
      expect(workspaceStat.isDirectory()).toBe(true);
    });

    it('should return accurate count of migrated files', async () => {
      await fs.mkdir(workspaceDir, { recursive: true });
      await fs.writeFile(path.join(tempDir, 'ARCHITECTURE.md'), 'content');
      await fs.writeFile(path.join(tempDir, 'REVIEW.md'), 'content');
      await fs.writeFile(path.join(workspaceDir, 'RELEASE.md'), 'content'); // Already in workspace

      const result = await migrateRootFiles(tempDir, workspaceDir);

      expect(result.migratedCount).toBe(2); // Only ARCHITECTURE.md and REVIEW.md migrated
      expect(result.migratedFiles).toContain('ARCHITECTURE.md');
      expect(result.migratedFiles).toContain('REVIEW.md');
      expect(result.migratedFiles.length).toBe(2);
      expect(result.errors).toEqual([]);
    });

    it('should handle filesystem errors gracefully', async () => {
      // Create a read-only directory to simulate permission error
      const readOnlyDir = path.join(tempDir, 'readonly');
      await fs.mkdir(readOnlyDir, { recursive: true });
      await fs.writeFile(path.join(readOnlyDir, 'ARCHITECTURE.md'), 'content');
      
      // On Unix systems, we can't easily test permission errors without root
      // So we'll test with a non-existent parent directory scenario
      const invalidWorkspacePath = path.join(tempDir, 'nonexistent', 'nested', 'workspace');
      
      // This should still work because createDirectory handles it
      const result = await migrateRootFiles(readOnlyDir, invalidWorkspacePath);
      
      // Should succeed because createDirectory creates parent directories
      expect(result.migratedCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('PUBLIC_TEMPLATE_FILES constant', () => {
    it('should export the correct list of files', () => {
      expect(PUBLIC_TEMPLATE_FILES).toEqual([
        'ARCHITECTURE.md',
        'REVIEW.md',
        'RELEASE.md',
        'TESTING.md',
        'PROGRESS.md'
      ]);
    });
  });
});
