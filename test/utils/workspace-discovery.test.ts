import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  discoverWorkspaces,
  isMultiWorkspace,
  getWorkspacePrefix,
  filterWorkspaces,
  isValidPlxWorkspace,
  findProjectRoot,
  DiscoveredWorkspace,
  MAX_DEPTH,
  SKIP_DIRECTORIES,
} from '../../src/utils/workspace-discovery.js';

describe('workspace-discovery', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `plx-workspace-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  const createWorkspace = async (relativePath: string): Promise<string> => {
    const workspacePath =
      relativePath === '.'
        ? path.join(tempDir, 'workspace')
        : path.join(tempDir, relativePath, 'workspace');
    await fs.mkdir(workspacePath, { recursive: true });
    return workspacePath;
  };

  describe('discoverWorkspaces', () => {
    it('finds single workspace at root', async () => {
      await createWorkspace('.');

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        path: path.join(tempDir, 'workspace'),
        relativePath: '.',
        projectName: '',
        isRoot: true,
      });
    });

    it('finds nested workspace with correct projectName', async () => {
      await createWorkspace('project-a');

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        path: path.join(tempDir, 'project-a', 'workspace'),
        relativePath: 'project-a',
        projectName: 'project-a',
        isRoot: false,
      });
    });

    it('finds multiple workspaces and sorts root first then alphabetically', async () => {
      await createWorkspace('zebra');
      await createWorkspace('.');
      await createWorkspace('alpha');

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(3);
      expect(result[0].isRoot).toBe(true);
      expect(result[0].projectName).toBe('');
      expect(result[1].projectName).toBe('alpha');
      expect(result[2].projectName).toBe('zebra');
    });

    it('finds deeply nested workspace at depth 4', async () => {
      await createWorkspace('foo/bar/baz/qux');

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        path: path.join(tempDir, 'foo', 'bar', 'baz', 'qux', 'workspace'),
        relativePath: path.join('foo', 'bar', 'baz', 'qux'),
        projectName: 'qux',
        isRoot: false,
      });
    });

    it('skips node_modules directory', async () => {
      await createWorkspace('node_modules/project');
      await createWorkspace('valid-project');

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(1);
      expect(result[0].projectName).toBe('valid-project');
    });

    it('skips .git directory', async () => {
      await createWorkspace('.git/hooks');
      await createWorkspace('valid-project');

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(1);
      expect(result[0].projectName).toBe('valid-project');
    });

    it('skips all directories in SKIP_DIRECTORIES', async () => {
      for (const skipDir of SKIP_DIRECTORIES) {
        await createWorkspace(`${skipDir}/nested-project`);
      }
      await createWorkspace('valid-project');

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(1);
      expect(result[0].projectName).toBe('valid-project');
    });

    it('skips hidden directories (starting with dot)', async () => {
      await createWorkspace('.hidden-project');
      await createWorkspace('visible-project');

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(1);
      expect(result[0].projectName).toBe('visible-project');
    });

    it('does not find workspace beyond MAX_DEPTH', async () => {
      const deepPath = Array.from({ length: MAX_DEPTH + 1 }, (_, i) => `level${i}`).join('/');
      await createWorkspace(deepPath);

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(0);
    });

    it('finds workspace exactly at MAX_DEPTH', async () => {
      const deepPath = Array.from({ length: MAX_DEPTH }, (_, i) => `level${i}`).join('/');
      await createWorkspace(deepPath);

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(1);
    });

    it('returns empty array when no workspaces exist', async () => {
      const result = await discoverWorkspaces(tempDir);

      expect(result).toEqual([]);
    });

    it('returns empty array for empty directory', async () => {
      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(0);
    });

    it('sorts multiple nested workspaces alphabetically', async () => {
      await createWorkspace('zebra');
      await createWorkspace('alpha');
      await createWorkspace('beta');

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(3);
      expect(result.map((w) => w.projectName)).toEqual(['alpha', 'beta', 'zebra']);
    });

    it('handles mixed root and nested workspaces correctly', async () => {
      await createWorkspace('.');
      await createWorkspace('project-z');
      await createWorkspace('project-a');

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(3);
      expect(result[0].isRoot).toBe(true);
      expect(result[1].projectName).toBe('project-a');
      expect(result[2].projectName).toBe('project-z');
    });

    it('does not treat workspace directory itself as a project', async () => {
      await createWorkspace('.');

      const result = await discoverWorkspaces(tempDir);

      expect(result).toHaveLength(1);
      expect(result[0].projectName).toBe('');
      expect(result[0].isRoot).toBe(true);
    });

    it('handles non-existent directory gracefully', async () => {
      const nonExistentPath = path.join(tempDir, 'does-not-exist');

      const result = await discoverWorkspaces(nonExistentPath);

      expect(result).toEqual([]);
    });
  });

  describe('isMultiWorkspace', () => {
    it('returns false for empty array', () => {
      const result = isMultiWorkspace([]);

      expect(result).toBe(false);
    });

    it('returns false for single workspace', () => {
      const workspaces: DiscoveredWorkspace[] = [
        {
          path: '/test/workspace',
          relativePath: '.',
          projectName: '',
          isRoot: true,
        },
      ];

      const result = isMultiWorkspace(workspaces);

      expect(result).toBe(false);
    });

    it('returns true for multiple workspaces', () => {
      const workspaces: DiscoveredWorkspace[] = [
        {
          path: '/test/workspace',
          relativePath: '.',
          projectName: '',
          isRoot: true,
        },
        {
          path: '/test/project-a/workspace',
          relativePath: 'project-a',
          projectName: 'project-a',
          isRoot: false,
        },
      ];

      const result = isMultiWorkspace(workspaces);

      expect(result).toBe(true);
    });

    it('returns true for many workspaces', () => {
      const workspaces: DiscoveredWorkspace[] = [
        {
          path: '/test/workspace',
          relativePath: '.',
          projectName: '',
          isRoot: true,
        },
        {
          path: '/test/project-a/workspace',
          relativePath: 'project-a',
          projectName: 'project-a',
          isRoot: false,
        },
        {
          path: '/test/project-b/workspace',
          relativePath: 'project-b',
          projectName: 'project-b',
          isRoot: false,
        },
      ];

      const result = isMultiWorkspace(workspaces);

      expect(result).toBe(true);
    });
  });

  describe('getWorkspacePrefix', () => {
    it('returns empty string in single workspace mode regardless of projectName', () => {
      const workspace: DiscoveredWorkspace = {
        path: '/test/project-a/workspace',
        relativePath: 'project-a',
        projectName: 'project-a',
        isRoot: false,
      };

      const result = getWorkspacePrefix(workspace, false);

      expect(result).toBe('');
    });

    it('returns empty string for root workspace in single mode', () => {
      const workspace: DiscoveredWorkspace = {
        path: '/test/workspace',
        relativePath: '.',
        projectName: '',
        isRoot: true,
      };

      const result = getWorkspacePrefix(workspace, false);

      expect(result).toBe('');
    });

    it('returns projectName/ in multi-workspace mode with projectName', () => {
      const workspace: DiscoveredWorkspace = {
        path: '/test/project-a/workspace',
        relativePath: 'project-a',
        projectName: 'project-a',
        isRoot: false,
      };

      const result = getWorkspacePrefix(workspace, true);

      expect(result).toBe('project-a/');
    });

    it('returns empty string for root workspace in multi mode (empty projectName)', () => {
      const workspace: DiscoveredWorkspace = {
        path: '/test/workspace',
        relativePath: '.',
        projectName: '',
        isRoot: true,
      };

      const result = getWorkspacePrefix(workspace, true);

      expect(result).toBe('');
    });
  });

  describe('filterWorkspaces', () => {
    const workspaces: DiscoveredWorkspace[] = [
      {
        path: '/test/workspace',
        relativePath: '.',
        projectName: '',
        isRoot: true,
      },
      {
        path: '/test/alpha/workspace',
        relativePath: 'alpha',
        projectName: 'alpha',
        isRoot: false,
      },
      {
        path: '/test/beta/workspace',
        relativePath: 'beta',
        projectName: 'beta',
        isRoot: false,
      },
    ];

    it('returns matching workspace for exact projectName match', () => {
      const result = filterWorkspaces(workspaces, 'alpha');

      expect(result).toHaveLength(1);
      expect(result[0].projectName).toBe('alpha');
    });

    it('returns empty array when no match found', () => {
      const result = filterWorkspaces(workspaces, 'nonexistent');

      expect(result).toEqual([]);
    });

    it('performs case-insensitive matching', () => {
      const result = filterWorkspaces(workspaces, 'ALPHA');

      expect(result).toHaveLength(1);
      expect(result[0].projectName).toBe('alpha');
    });

    it('performs case-insensitive matching with mixed case', () => {
      const result = filterWorkspaces(workspaces, 'AlPhA');

      expect(result).toHaveLength(1);
      expect(result[0].projectName).toBe('alpha');
    });

    it('does not match root workspace with filter "root"', () => {
      const result = filterWorkspaces(workspaces, 'root');

      expect(result).toEqual([]);
    });

    it('does not match root workspace with empty string filter', () => {
      const result = filterWorkspaces(workspaces, '');

      expect(result).toHaveLength(1);
      expect(result[0].isRoot).toBe(true);
    });

    it('returns empty array when filtering empty workspaces list', () => {
      const result = filterWorkspaces([], 'alpha');

      expect(result).toEqual([]);
    });

    it('does not perform partial matching', () => {
      const result = filterWorkspaces(workspaces, 'alph');

      expect(result).toEqual([]);
    });
  });

  describe('isValidPlxWorkspace', () => {
    it('returns true when workspace/AGENTS.md exists', async () => {
      const agentsDir = path.join(tempDir, 'workspace');
      await fs.mkdir(agentsDir, { recursive: true });
      await fs.writeFile(path.join(agentsDir, 'AGENTS.md'), '# Test');

      const result = await isValidPlxWorkspace(tempDir);

      expect(result).toBe(true);
    });

    it('returns false when workspace directory does not exist', async () => {
      const result = await isValidPlxWorkspace(tempDir);

      expect(result).toBe(false);
    });

    it('returns false when AGENTS.md does not exist', async () => {
      const agentsDir = path.join(tempDir, 'workspace');
      await fs.mkdir(agentsDir, { recursive: true });

      const result = await isValidPlxWorkspace(tempDir);

      expect(result).toBe(false);
    });

    it('returns false when workspace/AGENTS.md is a directory', async () => {
      const agentsPath = path.join(tempDir, 'workspace', 'AGENTS.md');
      await fs.mkdir(agentsPath, { recursive: true });

      const result = await isValidPlxWorkspace(tempDir);

      expect(result).toBe(false);
    });

    it('returns false for non-existent directory', async () => {
      const nonExistentPath = path.join(tempDir, 'does-not-exist');

      const result = await isValidPlxWorkspace(nonExistentPath);

      expect(result).toBe(false);
    });
  });

  describe('findProjectRoot', () => {
    it('returns current directory when it is a valid PLX workspace', async () => {
      const agentsDir = path.join(tempDir, 'workspace');
      await fs.mkdir(agentsDir, { recursive: true });
      await fs.writeFile(path.join(agentsDir, 'AGENTS.md'), '# Test');

      const result = await findProjectRoot(tempDir);

      expect(result).toBe(tempDir);
    });

    it('returns parent directory when it has valid PLX workspace', async () => {
      const agentsDir = path.join(tempDir, 'workspace');
      await fs.mkdir(agentsDir, { recursive: true });
      await fs.writeFile(path.join(agentsDir, 'AGENTS.md'), '# Test');
      const subDir = path.join(tempDir, 'src', 'components');
      await fs.mkdir(subDir, { recursive: true });

      const result = await findProjectRoot(subDir);

      expect(result).toBe(tempDir);
    });

    it('returns ancestor directory when it has valid PLX workspace', async () => {
      const agentsDir = path.join(tempDir, 'workspace');
      await fs.mkdir(agentsDir, { recursive: true });
      await fs.writeFile(path.join(agentsDir, 'AGENTS.md'), '# Test');
      const deepDir = path.join(tempDir, 'src', 'components', 'ui', 'buttons');
      await fs.mkdir(deepDir, { recursive: true });

      const result = await findProjectRoot(deepDir);

      expect(result).toBe(tempDir);
    });

    it('returns null when .git is found without workspace', async () => {
      const gitDir = path.join(tempDir, '.git');
      await fs.mkdir(gitDir, { recursive: true });
      const subDir = path.join(tempDir, 'src');
      await fs.mkdir(subDir, { recursive: true });

      const result = await findProjectRoot(subDir);

      expect(result).toBe(null);
    });

    it('finds workspace before .git ceiling', async () => {
      const agentsDir = path.join(tempDir, 'workspace');
      await fs.mkdir(agentsDir, { recursive: true });
      await fs.writeFile(path.join(agentsDir, 'AGENTS.md'), '# Test');
      const gitDir = path.join(tempDir, '.git');
      await fs.mkdir(gitDir, { recursive: true });
      const subDir = path.join(tempDir, 'src');
      await fs.mkdir(subDir, { recursive: true });

      const result = await findProjectRoot(subDir);

      expect(result).toBe(tempDir);
    });

    it('returns null when no workspace found up to filesystem root', async () => {
      const subDir = path.join(tempDir, 'src');
      await fs.mkdir(subDir, { recursive: true });

      const result = await findProjectRoot(subDir);

      expect(result).toBe(null);
    });

    it('ignores .git file (not directory)', async () => {
      await fs.writeFile(path.join(tempDir, '.git'), 'gitdir: ../somewhere');
      const subDir = path.join(tempDir, 'src');
      await fs.mkdir(subDir, { recursive: true });

      const result = await findProjectRoot(subDir);

      expect(result).toBe(null);
    });

    it('returns nearest workspace when multiple exist in path', async () => {
      const innerWorkspace = path.join(tempDir, 'inner', 'workspace');
      await fs.mkdir(innerWorkspace, { recursive: true });
      await fs.writeFile(path.join(innerWorkspace, 'AGENTS.md'), '# Inner');

      const outerWorkspace = path.join(tempDir, 'workspace');
      await fs.mkdir(outerWorkspace, { recursive: true });
      await fs.writeFile(path.join(outerWorkspace, 'AGENTS.md'), '# Outer');

      const deepDir = path.join(tempDir, 'inner', 'src');
      await fs.mkdir(deepDir, { recursive: true });

      const result = await findProjectRoot(deepDir);

      expect(result).toBe(path.join(tempDir, 'inner'));
    });
  });

  describe('constants', () => {
    it('MAX_DEPTH is 5', () => {
      expect(MAX_DEPTH).toBe(5);
    });

    it('SKIP_DIRECTORIES includes common directories to skip', () => {
      expect(SKIP_DIRECTORIES).toContain('node_modules');
      expect(SKIP_DIRECTORIES).toContain('.git');
      expect(SKIP_DIRECTORIES).toContain('dist');
      expect(SKIP_DIRECTORIES).toContain('build');
      expect(SKIP_DIRECTORIES).toContain('.next');
      expect(SKIP_DIRECTORIES).toContain('__pycache__');
      expect(SKIP_DIRECTORIES).toContain('venv');
      expect(SKIP_DIRECTORIES).toContain('coverage');
      expect(SKIP_DIRECTORIES).toContain('.cache');
    });
  });
});
