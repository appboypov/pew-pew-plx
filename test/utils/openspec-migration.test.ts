import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  detectOpenSpecProject,
  migrateDirectoryStructure,
  migrateMarkersInFile,
  migrateAllMarkers,
  migrateOpenSpecProject,
  OPENSPEC_DIR_NAME,
  OPENSPEC_MARKERS
} from '../../src/utils/openspec-migration.js';
import { PLX_DIR_NAME, PLX_MARKERS } from '../../src/core/config.js';

describe('openspec-migration', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `plx-openspec-migration-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('detectOpenSpecProject', () => {
    it('should return true when openspec/ directory exists', async () => {
      const openspecDir = path.join(tempDir, OPENSPEC_DIR_NAME);
      await fs.mkdir(openspecDir, { recursive: true });

      const result = await detectOpenSpecProject(tempDir);

      expect(result).toBe(true);
    });

    it('should return false when openspec/ directory does not exist', async () => {
      const result = await detectOpenSpecProject(tempDir);

      expect(result).toBe(false);
    });

    it('should return false when openspec is a file not a directory', async () => {
      const openspecPath = path.join(tempDir, OPENSPEC_DIR_NAME);
      await fs.writeFile(openspecPath, 'not a directory');

      const result = await detectOpenSpecProject(tempDir);

      expect(result).toBe(false);
    });
  });

  describe('migrateDirectoryStructure', () => {
    it('should rename openspec/ to workspace/', async () => {
      const openspecDir = path.join(tempDir, OPENSPEC_DIR_NAME);
      const workspaceDir = path.join(tempDir, PLX_DIR_NAME);
      await fs.mkdir(openspecDir, { recursive: true });

      const result = await migrateDirectoryStructure(tempDir);

      expect(result.migrated).toBe(true);
      expect(result.error).toBeUndefined();

      // Verify workspace/ exists
      const workspaceStat = await fs.stat(workspaceDir);
      expect(workspaceStat.isDirectory()).toBe(true);

      // Verify openspec/ no longer exists
      await expect(fs.access(openspecDir)).rejects.toThrow();
    });

    it('should return migrated: false when openspec/ does not exist', async () => {
      const result = await migrateDirectoryStructure(tempDir);

      expect(result.migrated).toBe(false);
      expect(result.error).toBeUndefined();
    });

    it('should return migrated: false when workspace/ already exists', async () => {
      const openspecDir = path.join(tempDir, OPENSPEC_DIR_NAME);
      const workspaceDir = path.join(tempDir, PLX_DIR_NAME);
      await fs.mkdir(openspecDir, { recursive: true });
      await fs.mkdir(workspaceDir, { recursive: true });

      const result = await migrateDirectoryStructure(tempDir);

      expect(result.migrated).toBe(false);
      expect(result.error).toBeUndefined();

      // Verify both directories still exist
      const openspecStat = await fs.stat(openspecDir);
      const workspaceStat = await fs.stat(workspaceDir);
      expect(openspecStat.isDirectory()).toBe(true);
      expect(workspaceStat.isDirectory()).toBe(true);
    });

    it('should preserve directory contents during migration', async () => {
      const openspecDir = path.join(tempDir, OPENSPEC_DIR_NAME);
      const workspaceDir = path.join(tempDir, PLX_DIR_NAME);
      await fs.mkdir(openspecDir, { recursive: true });

      // Create nested structure with files
      const subDir = path.join(openspecDir, 'changes');
      await fs.mkdir(subDir, { recursive: true });
      await fs.writeFile(path.join(openspecDir, 'AGENTS.md'), '# Agents');
      await fs.writeFile(path.join(subDir, 'change-001.md'), '# Change 001');

      const result = await migrateDirectoryStructure(tempDir);

      expect(result.migrated).toBe(true);

      // Verify contents preserved
      const agentsContent = await fs.readFile(path.join(workspaceDir, 'AGENTS.md'), 'utf-8');
      expect(agentsContent).toBe('# Agents');

      const changeContent = await fs.readFile(path.join(workspaceDir, 'changes', 'change-001.md'), 'utf-8');
      expect(changeContent).toBe('# Change 001');
    });
  });

  describe('migrateMarkersInFile', () => {
    it('should replace OPENSPEC markers with PLX markers', async () => {
      const filePath = path.join(tempDir, 'CLAUDE.md');
      const content = `Some content
${OPENSPEC_MARKERS.start}
Instructions here
${OPENSPEC_MARKERS.end}
More content`;
      await fs.writeFile(filePath, content);

      const result = await migrateMarkersInFile(filePath);

      expect(result).toBe(true);

      const updatedContent = await fs.readFile(filePath, 'utf-8');
      expect(updatedContent).toContain(PLX_MARKERS.start);
      expect(updatedContent).toContain(PLX_MARKERS.end);
      expect(updatedContent).not.toContain(OPENSPEC_MARKERS.start);
      expect(updatedContent).not.toContain(OPENSPEC_MARKERS.end);
    });

    it('should return true when replacements were made', async () => {
      const filePath = path.join(tempDir, 'test.md');
      await fs.writeFile(filePath, `${OPENSPEC_MARKERS.start}\nContent\n${OPENSPEC_MARKERS.end}`);

      const result = await migrateMarkersInFile(filePath);

      expect(result).toBe(true);
    });

    it('should return false when no markers exist', async () => {
      const filePath = path.join(tempDir, 'test.md');
      await fs.writeFile(filePath, 'No markers here');

      const result = await migrateMarkersInFile(filePath);

      expect(result).toBe(false);

      // Verify file unchanged
      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('No markers here');
    });

    it('should handle files with multiple marker pairs', async () => {
      const filePath = path.join(tempDir, 'multi.md');
      const content = `${OPENSPEC_MARKERS.start}
Block 1
${OPENSPEC_MARKERS.end}

Some content

${OPENSPEC_MARKERS.start}
Block 2
${OPENSPEC_MARKERS.end}`;
      await fs.writeFile(filePath, content);

      const result = await migrateMarkersInFile(filePath);

      expect(result).toBe(true);

      const updatedContent = await fs.readFile(filePath, 'utf-8');
      const startMatches = updatedContent.match(new RegExp(PLX_MARKERS.start.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
      const endMatches = updatedContent.match(new RegExp(PLX_MARKERS.end.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
      expect(startMatches).toHaveLength(2);
      expect(endMatches).toHaveLength(2);
      expect(updatedContent).not.toContain(OPENSPEC_MARKERS.start);
      expect(updatedContent).not.toContain(OPENSPEC_MARKERS.end);
    });
  });

  describe('migrateAllMarkers', () => {
    it('should update markers in all matching files recursively', async () => {
      // Create files with markers at different depths
      await fs.writeFile(
        path.join(tempDir, 'root.md'),
        `${OPENSPEC_MARKERS.start}\nRoot\n${OPENSPEC_MARKERS.end}`
      );

      const subDir = path.join(tempDir, 'sub');
      await fs.mkdir(subDir, { recursive: true });
      await fs.writeFile(
        path.join(subDir, 'nested.md'),
        `${OPENSPEC_MARKERS.start}\nNested\n${OPENSPEC_MARKERS.end}`
      );

      const result = await migrateAllMarkers(tempDir);

      expect(result).toBe(2);

      // Verify both files updated
      const rootContent = await fs.readFile(path.join(tempDir, 'root.md'), 'utf-8');
      const nestedContent = await fs.readFile(path.join(subDir, 'nested.md'), 'utf-8');

      expect(rootContent).toContain(PLX_MARKERS.start);
      expect(nestedContent).toContain(PLX_MARKERS.start);
    });

    it('should skip node_modules, .git, dist directories', async () => {
      // Create files in skip directories
      const nodeModulesDir = path.join(tempDir, 'node_modules');
      const gitDir = path.join(tempDir, '.git');
      const distDir = path.join(tempDir, 'dist');

      await fs.mkdir(nodeModulesDir, { recursive: true });
      await fs.mkdir(gitDir, { recursive: true });
      await fs.mkdir(distDir, { recursive: true });

      await fs.writeFile(
        path.join(nodeModulesDir, 'package.md'),
        `${OPENSPEC_MARKERS.start}\n${OPENSPEC_MARKERS.end}`
      );
      await fs.writeFile(
        path.join(gitDir, 'config.md'),
        `${OPENSPEC_MARKERS.start}\n${OPENSPEC_MARKERS.end}`
      );
      await fs.writeFile(
        path.join(distDir, 'output.md'),
        `${OPENSPEC_MARKERS.start}\n${OPENSPEC_MARKERS.end}`
      );

      const result = await migrateAllMarkers(tempDir);

      expect(result).toBe(0);

      // Verify files unchanged
      const nodeModulesContent = await fs.readFile(path.join(nodeModulesDir, 'package.md'), 'utf-8');
      const gitContent = await fs.readFile(path.join(gitDir, 'config.md'), 'utf-8');
      const distContent = await fs.readFile(path.join(distDir, 'output.md'), 'utf-8');

      expect(nodeModulesContent).toContain(OPENSPEC_MARKERS.start);
      expect(gitContent).toContain(OPENSPEC_MARKERS.start);
      expect(distContent).toContain(OPENSPEC_MARKERS.start);
    });

    it('should only process specified file extensions', async () => {
      // Create files with different extensions
      await fs.writeFile(
        path.join(tempDir, 'valid.md'),
        `${OPENSPEC_MARKERS.start}\n${OPENSPEC_MARKERS.end}`
      );
      await fs.writeFile(
        path.join(tempDir, 'valid.ts'),
        `${OPENSPEC_MARKERS.start}\n${OPENSPEC_MARKERS.end}`
      );
      await fs.writeFile(
        path.join(tempDir, 'invalid.txt'),
        `${OPENSPEC_MARKERS.start}\n${OPENSPEC_MARKERS.end}`
      );
      await fs.writeFile(
        path.join(tempDir, 'invalid.html'),
        `${OPENSPEC_MARKERS.start}\n${OPENSPEC_MARKERS.end}`
      );

      const result = await migrateAllMarkers(tempDir);

      expect(result).toBe(2);

      // Verify .md and .ts were updated
      const mdContent = await fs.readFile(path.join(tempDir, 'valid.md'), 'utf-8');
      const tsContent = await fs.readFile(path.join(tempDir, 'valid.ts'), 'utf-8');
      expect(mdContent).toContain(PLX_MARKERS.start);
      expect(tsContent).toContain(PLX_MARKERS.start);

      // Verify .txt and .html were not updated
      const txtContent = await fs.readFile(path.join(tempDir, 'invalid.txt'), 'utf-8');
      const htmlContent = await fs.readFile(path.join(tempDir, 'invalid.html'), 'utf-8');
      expect(txtContent).toContain(OPENSPEC_MARKERS.start);
      expect(htmlContent).toContain(OPENSPEC_MARKERS.start);
    });

    it('should return count of files modified', async () => {
      await fs.writeFile(
        path.join(tempDir, 'file1.md'),
        `${OPENSPEC_MARKERS.start}\n${OPENSPEC_MARKERS.end}`
      );
      await fs.writeFile(
        path.join(tempDir, 'file2.md'),
        `${OPENSPEC_MARKERS.start}\n${OPENSPEC_MARKERS.end}`
      );
      await fs.writeFile(
        path.join(tempDir, 'file3.md'),
        'No markers'
      );

      const result = await migrateAllMarkers(tempDir);

      expect(result).toBe(2);
    });
  });

  describe('migrateOpenSpecProject', () => {
    it('should return migrated: true when any migration occurred', async () => {
      // Create openspec directory
      const openspecDir = path.join(tempDir, OPENSPEC_DIR_NAME);
      await fs.mkdir(openspecDir, { recursive: true });

      const result = await migrateOpenSpecProject(tempDir);

      expect(result.migrated).toBe(true);
      expect(result.directoryMigrated).toBe(true);
    });

    it('should return migrated: false when no OpenSpec artifacts found', async () => {
      // Empty temp directory with no openspec artifacts
      const result = await migrateOpenSpecProject(tempDir);

      expect(result.migrated).toBe(false);
      expect(result.directoryMigrated).toBe(false);
      expect(result.markerFilesUpdated).toBe(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should populate all result fields correctly', async () => {
      // Create openspec directory with content
      const openspecDir = path.join(tempDir, OPENSPEC_DIR_NAME);
      await fs.mkdir(openspecDir, { recursive: true });
      await fs.writeFile(
        path.join(openspecDir, 'AGENTS.md'),
        `${OPENSPEC_MARKERS.start}\nInstructions\n${OPENSPEC_MARKERS.end}`
      );
      await fs.writeFile(
        path.join(tempDir, 'CLAUDE.md'),
        `${OPENSPEC_MARKERS.start}\nRoot file\n${OPENSPEC_MARKERS.end}`
      );

      const result = await migrateOpenSpecProject(tempDir);

      expect(result.migrated).toBe(true);
      expect(result.directoryMigrated).toBe(true);
      expect(result.markerFilesUpdated).toBe(2);
      expect(result.errors).toHaveLength(0);

      // Verify directory was renamed
      const workspaceDir = path.join(tempDir, PLX_DIR_NAME);
      const workspaceStat = await fs.stat(workspaceDir);
      expect(workspaceStat.isDirectory()).toBe(true);

      // Verify markers were updated in migrated location
      const agentsContent = await fs.readFile(path.join(workspaceDir, 'AGENTS.md'), 'utf-8');
      const claudeContent = await fs.readFile(path.join(tempDir, 'CLAUDE.md'), 'utf-8');
      expect(agentsContent).toContain(PLX_MARKERS.start);
      expect(claudeContent).toContain(PLX_MARKERS.start);
    });
  });
});
