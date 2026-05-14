import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ParentResolverService } from '../../src/services/parent-resolver.js';
import { DiscoveredWorkspace } from '../../src/utils/workspace-discovery.js';

describe('ParentResolverService', () => {
  let tempDir: string;
  let workspacePath: string;
  let workspace: DiscoveredWorkspace;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `splx-parent-resolver-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    workspacePath = path.join(tempDir, 'workspace');
    const changesDir = path.join(workspacePath, 'changes');
    const specsDir = path.join(workspacePath, 'specs');
    const reviewsDir = path.join(workspacePath, 'reviews');
    const tasksDir = path.join(workspacePath, 'tasks');
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(specsDir, { recursive: true });
    await fs.mkdir(reviewsDir, { recursive: true });
    await fs.mkdir(tasksDir, { recursive: true });

    await fs.writeFile(path.join(workspacePath, 'AGENTS.md'), '# Agents');

    workspace = {
      path: workspacePath,
      relativePath: '.',
      projectName: 'test-project',
      isRoot: true,
    };
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  async function createChange(changeId: string, proposal: string = '# Proposal') {
    const changeDir = path.join(workspacePath, 'changes', changeId);
    await fs.mkdir(changeDir, { recursive: true });
    await fs.writeFile(path.join(changeDir, 'proposal.md'), proposal);
  }

  async function createSpec(specId: string, content: string = '# Spec') {
    const specDir = path.join(workspacePath, 'specs', specId);
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(path.join(specDir, 'spec.md'), content);
  }

  async function createReview(reviewId: string, content: string = '# Review') {
    const reviewDir = path.join(workspacePath, 'reviews', reviewId);
    await fs.mkdir(reviewDir, { recursive: true });
    await fs.writeFile(path.join(reviewDir, 'review.md'), content);
  }

  describe('resolve', () => {
    describe('change resolution', () => {
      it('should resolve a change by ID', async () => {
        await createChange('my-change');

        const result = await ParentResolverService.resolve(
          'my-change',
          undefined,
          [workspace],
          'splx test',
          tempDir
        );

        expect(result).not.toBeNull();
        expect(result!.type).toBe('change');
        expect(result!.path).toBe(path.join(workspacePath, 'changes', 'my-change'));
        expect(result!.workspacePath).toBe(workspacePath);
        expect(result!.projectName).toBe('test-project');
      });

      it('should resolve a change with explicit type hint', async () => {
        await createChange('my-change');

        const result = await ParentResolverService.resolve(
          'my-change',
          'change',
          [workspace],
          'splx test',
          tempDir
        );

        expect(result).not.toBeNull();
        expect(result!.type).toBe('change');
      });

      it('should return null for non-existent change', async () => {
        const result = await ParentResolverService.resolve(
          'non-existent',
          'change',
          [workspace],
          'splx test',
          tempDir
        );

        expect(result).toBeNull();
      });
    });

    describe('spec resolution', () => {
      it('should resolve a spec by ID', async () => {
        await createSpec('my-spec');

        const result = await ParentResolverService.resolve(
          'my-spec',
          undefined,
          [workspace],
          'splx test',
          tempDir
        );

        expect(result).not.toBeNull();
        expect(result!.type).toBe('spec');
        expect(result!.path).toBe(path.join(workspacePath, 'specs', 'my-spec'));
        expect(result!.workspacePath).toBe(workspacePath);
      });

      it('should resolve a spec with explicit type hint', async () => {
        await createSpec('my-spec');

        const result = await ParentResolverService.resolve(
          'my-spec',
          'spec',
          [workspace],
          'splx test',
          tempDir
        );

        expect(result).not.toBeNull();
        expect(result!.type).toBe('spec');
      });
    });

    describe('review resolution', () => {
      it('should resolve a review by ID', async () => {
        await createReview('my-review');

        const result = await ParentResolverService.resolve(
          'my-review',
          undefined,
          [workspace],
          'splx test',
          tempDir
        );

        expect(result).not.toBeNull();
        expect(result!.type).toBe('review');
        expect(result!.path).toBe(path.join(workspacePath, 'reviews', 'my-review'));
        expect(result!.workspacePath).toBe(workspacePath);
      });

      it('should resolve a review with explicit type hint', async () => {
        await createReview('my-review');

        const result = await ParentResolverService.resolve(
          'my-review',
          'review',
          [workspace],
          'splx test',
          tempDir
        );

        expect(result).not.toBeNull();
        expect(result!.type).toBe('review');
      });
    });

    describe('ambiguity detection', () => {
      it('should throw error when ID matches multiple types', async () => {
        await createChange('same-id');
        await createSpec('same-id');

        await expect(
          ParentResolverService.resolve(
            'same-id',
            undefined,
            [workspace],
            'splx test',
            tempDir
          )
        ).rejects.toThrow(/matches multiple types/);
      });

      it('should resolve unambiguously when type hint is provided', async () => {
        await createChange('same-id');
        await createSpec('same-id');

        const result = await ParentResolverService.resolve(
          'same-id',
          'change',
          [workspace],
          'splx test',
          tempDir
        );

        expect(result).not.toBeNull();
        expect(result!.type).toBe('change');
      });
    });

    describe('multi-workspace support', () => {
      let workspacePath2: string;
      let workspace2: DiscoveredWorkspace;

      beforeEach(async () => {
        workspacePath2 = path.join(tempDir, 'workspace2');
        const changesDir2 = path.join(workspacePath2, 'changes');
        const specsDir2 = path.join(workspacePath2, 'specs');
        const reviewsDir2 = path.join(workspacePath2, 'reviews');
        await fs.mkdir(changesDir2, { recursive: true });
        await fs.mkdir(specsDir2, { recursive: true });
        await fs.mkdir(reviewsDir2, { recursive: true });
        await fs.writeFile(path.join(workspacePath2, 'AGENTS.md'), '# Agents');

        workspace2 = {
          path: workspacePath2,
          relativePath: 'workspace2',
          projectName: 'project-b',
          isRoot: false,
        };
      });

      it('should resolve prefixed ID in multi-workspace setup', async () => {
        const changeDir = path.join(workspacePath2, 'changes', 'feature-x');
        await fs.mkdir(changeDir, { recursive: true });
        await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal');

        const result = await ParentResolverService.resolve(
          'project-b/feature-x',
          undefined,
          [workspace, workspace2],
          'splx test',
          tempDir
        );

        expect(result).not.toBeNull();
        expect(result!.type).toBe('change');
        expect(result!.projectName).toBe('project-b');
      });

      it('should preserve isRoot from workspace', async () => {
        await createChange('root-change');

        const result = await ParentResolverService.resolve(
          'root-change',
          undefined,
          [workspace, workspace2],
          'splx test',
          tempDir
        );

        expect(result).not.toBeNull();
        expect(result!.projectName).toBe('test-project');
      });
    });

    describe('cwd parameter', () => {
      it('should use provided cwd for ItemRetrievalService', async () => {
        await createChange('my-change');

        const result = await ParentResolverService.resolve(
          'my-change',
          undefined,
          [workspace],
          'splx test',
          tempDir
        );

        expect(result).not.toBeNull();
      });

      it('should work with default cwd when not provided', async () => {
        await createChange('my-change');

        const result = await ParentResolverService.resolve(
          'my-change',
          undefined,
          [workspace],
          'splx test'
        );

        expect(result).not.toBeNull();
      });
    });

    describe('error handling', () => {
      it('should return null when no matches found', async () => {
        const result = await ParentResolverService.resolve(
          'non-existent',
          undefined,
          [workspace],
          'splx test',
          tempDir
        );

        expect(result).toBeNull();
      });

      it('should include command name in ambiguity error message', async () => {
        await createChange('ambiguous');
        await createSpec('ambiguous');

        try {
          await ParentResolverService.resolve(
            'ambiguous',
            undefined,
            [workspace],
            'splx custom-command',
            tempDir
          );
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect((error as Error).message).toContain('splx custom-command');
          expect((error as Error).message).toContain('--parent-type');
        }
      });
    });
  });
});
