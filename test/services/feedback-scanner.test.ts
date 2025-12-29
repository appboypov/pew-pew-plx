import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { FeedbackScannerService } from '../../src/services/feedback-scanner.js';

describe('FeedbackScannerService', () => {
  let tempDir: string;
  let scanner: FeedbackScannerService;

  beforeEach(async () => {
    tempDir = path.join(os.tmpdir(), `feedback-scanner-test-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });
    scanner = new FeedbackScannerService(tempDir);
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('scanDirectory', () => {
    it('returns empty array for empty directory', async () => {
      const result = await scanner.scanDirectory('.');
      expect(result).toEqual([]);
    });

    it('returns empty array for non-existent directory', async () => {
      const result = await scanner.scanDirectory('non-existent');
      expect(result).toEqual([]);
    });

    it('finds feedback marker in single file', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        'const x = 1;\n// #FEEDBACK #TODO | Add validation\nconst y = 2;'
      );

      const result = await scanner.scanDirectory('src');
      expect(result).toHaveLength(1);
      expect(result[0].file).toBe('src/file.ts');
      expect(result[0].line).toBe(2);
      expect(result[0].feedback).toBe('Add validation');
      expect(result[0].parentType).toBeNull();
      expect(result[0].parentId).toBeNull();
    });

    it('finds marker with task parent', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        '// #FEEDBACK #TODO | task:001-implement-feature | Update logic'
      );

      const result = await scanner.scanDirectory('src');
      expect(result).toHaveLength(1);
      expect(result[0].feedback).toBe('Update logic');
      expect(result[0].parentType).toBe('task');
      expect(result[0].parentId).toBe('001-implement-feature');
    });

    it('finds marker with change parent', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        '// #FEEDBACK #TODO | change:cli-get-task | Update requirement'
      );

      const result = await scanner.scanDirectory('src');
      expect(result).toHaveLength(1);
      expect(result[0].feedback).toBe('Update requirement');
      expect(result[0].parentType).toBe('change');
      expect(result[0].parentId).toBe('cli-get-task');
    });

    it('finds marker with spec parent', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        '// #FEEDBACK #TODO | spec:api-docs | Update spec'
      );

      const result = await scanner.scanDirectory('src');
      expect(result).toHaveLength(1);
      expect(result[0].feedback).toBe('Update spec');
      expect(result[0].parentType).toBe('spec');
      expect(result[0].parentId).toBe('api-docs');
    });

    it('finds multiple markers in same file', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        `const x = 1;
// #FEEDBACK #TODO | First issue
const y = 2;
// #FEEDBACK #TODO | Second issue
const z = 3;`
      );

      const result = await scanner.scanDirectory('src');
      expect(result).toHaveLength(2);
      expect(result[0].line).toBe(2);
      expect(result[0].feedback).toBe('First issue');
      expect(result[1].line).toBe(4);
      expect(result[1].feedback).toBe('Second issue');
    });

    it('finds markers in multiple files', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'file1.ts'),
        '// #FEEDBACK #TODO | Issue in file1'
      );
      await fs.writeFile(
        path.join(srcDir, 'file2.ts'),
        '// #FEEDBACK #TODO | Issue in file2'
      );

      const result = await scanner.scanDirectory('src');
      expect(result).toHaveLength(2);
      const files = result.map((m) => m.file);
      expect(files).toContain('src/file1.ts');
      expect(files).toContain('src/file2.ts');
    });

    it('finds markers in subdirectories', async () => {
      const subDir = path.join(tempDir, 'src', 'utils');
      await fs.mkdir(subDir, { recursive: true });
      await fs.writeFile(
        path.join(subDir, 'helper.ts'),
        '// #FEEDBACK #TODO | Deep nested issue'
      );

      const result = await scanner.scanDirectory('src');
      expect(result).toHaveLength(1);
      expect(result[0].file).toBe('src/utils/helper.ts');
    });

    it('respects .gitignore', async () => {
      await fs.writeFile(path.join(tempDir, '.gitignore'), 'ignored/\n');

      const srcDir = path.join(tempDir, 'src');
      const ignoredDir = path.join(tempDir, 'ignored');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.mkdir(ignoredDir, { recursive: true });

      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        '// #FEEDBACK #TODO | Should be found'
      );
      await fs.writeFile(
        path.join(ignoredDir, 'file.ts'),
        '// #FEEDBACK #TODO | Should be ignored'
      );

      const result = await scanner.scanDirectory('.');
      expect(result).toHaveLength(1);
      expect(result[0].file).toBe('src/file.ts');
    });

    it('ignores node_modules', async () => {
      const srcDir = path.join(tempDir, 'src');
      const nodeModules = path.join(tempDir, 'node_modules', 'pkg');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.mkdir(nodeModules, { recursive: true });

      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        '// #FEEDBACK #TODO | Should be found'
      );
      await fs.writeFile(
        path.join(nodeModules, 'file.ts'),
        '// #FEEDBACK #TODO | Should be ignored'
      );

      const result = await scanner.scanDirectory('.');
      expect(result).toHaveLength(1);
      expect(result[0].file).toBe('src/file.ts');
    });

    it('ignores dist directory', async () => {
      const srcDir = path.join(tempDir, 'src');
      const distDir = path.join(tempDir, 'dist');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.mkdir(distDir, { recursive: true });

      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        '// #FEEDBACK #TODO | Should be found'
      );
      await fs.writeFile(
        path.join(distDir, 'file.js'),
        '// #FEEDBACK #TODO | Should be ignored'
      );

      const result = await scanner.scanDirectory('.');
      expect(result).toHaveLength(1);
      expect(result[0].file).toBe('src/file.ts');
    });

    it('ignores .git directory', async () => {
      const srcDir = path.join(tempDir, 'src');
      const gitDir = path.join(tempDir, '.git');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.mkdir(gitDir, { recursive: true });

      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        '// #FEEDBACK #TODO | Should be found'
      );
      await fs.writeFile(
        path.join(gitDir, 'config'),
        '# #FEEDBACK #TODO | Should be ignored'
      );

      const result = await scanner.scanDirectory('.');
      expect(result).toHaveLength(1);
    });

    it('handles Python files', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'script.py'),
        '# #FEEDBACK #TODO | Python issue'
      );

      const result = await scanner.scanDirectory('src');
      expect(result).toHaveLength(1);
      expect(result[0].feedback).toBe('Python issue');
      expect(result[0].commentStyle.prefix).toBe('#');
    });

    it('handles HTML files', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'page.html'),
        '<!-- #FEEDBACK #TODO | HTML issue -->'
      );

      const result = await scanner.scanDirectory('src');
      expect(result).toHaveLength(1);
      expect(result[0].feedback).toBe('HTML issue');
      expect(result[0].commentStyle.prefix).toBe('<!--');
      expect(result[0].commentStyle.suffix).toBe('-->');
    });

    it('only scans known file extensions', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        '// #FEEDBACK #TODO | Should be found'
      );
      await fs.writeFile(
        path.join(srcDir, 'file.xyz'),
        '// #FEEDBACK #TODO | Unknown extension'
      );

      const result = await scanner.scanDirectory('src');
      expect(result).toHaveLength(1);
      expect(result[0].file).toBe('src/file.ts');
    });
  });

  describe('groupMarkersByParent', () => {
    it('returns empty groups for empty markers', () => {
      const result = scanner.groupMarkersByParent([]);
      expect(result.assigned).toEqual([]);
      expect(result.unassigned).toEqual([]);
    });

    it('separates unassigned markers', () => {
      const markers = [
        {
          file: 'src/file.ts',
          line: 10,
          feedback: 'No parent',
          parentType: null,
          parentId: null,
          commentStyle: { prefix: '//' },
        },
      ];

      const result = scanner.groupMarkersByParent(markers as any);
      expect(result.assigned).toEqual([]);
      expect(result.unassigned).toHaveLength(1);
      expect(result.unassigned[0].feedback).toBe('No parent');
    });

    it('groups markers by parent', () => {
      const markers = [
        {
          file: 'src/file.ts',
          line: 10,
          feedback: 'First for change',
          parentType: 'change' as const,
          parentId: 'my-change',
          commentStyle: { prefix: '//' },
        },
        {
          file: 'src/other.ts',
          line: 5,
          feedback: 'Second for change',
          parentType: 'change' as const,
          parentId: 'my-change',
          commentStyle: { prefix: '//' },
        },
      ];

      const result = scanner.groupMarkersByParent(markers);
      expect(result.assigned).toHaveLength(1);
      expect(result.assigned[0].parentType).toBe('change');
      expect(result.assigned[0].parentId).toBe('my-change');
      expect(result.assigned[0].markers).toHaveLength(2);
      expect(result.unassigned).toEqual([]);
    });

    it('creates separate groups for different parents', () => {
      const markers = [
        {
          file: 'src/file.ts',
          line: 10,
          feedback: 'For change',
          parentType: 'change' as const,
          parentId: 'my-change',
          commentStyle: { prefix: '//' },
        },
        {
          file: 'src/other.ts',
          line: 5,
          feedback: 'For spec',
          parentType: 'spec' as const,
          parentId: 'my-spec',
          commentStyle: { prefix: '//' },
        },
        {
          file: 'src/task.ts',
          line: 15,
          feedback: 'For task',
          parentType: 'task' as const,
          parentId: '001-task',
          commentStyle: { prefix: '//' },
        },
      ];

      const result = scanner.groupMarkersByParent(markers);
      expect(result.assigned).toHaveLength(3);
      expect(result.unassigned).toEqual([]);

      const changeGroup = result.assigned.find((g) => g.parentType === 'change');
      const specGroup = result.assigned.find((g) => g.parentType === 'spec');
      const taskGroup = result.assigned.find((g) => g.parentType === 'task');

      expect(changeGroup?.parentId).toBe('my-change');
      expect(specGroup?.parentId).toBe('my-spec');
      expect(taskGroup?.parentId).toBe('001-task');
    });

    it('preserves marker order within groups', () => {
      const markers = [
        {
          file: 'src/a.ts',
          line: 1,
          feedback: 'First',
          parentType: 'change' as const,
          parentId: 'my-change',
          commentStyle: { prefix: '//' },
        },
        {
          file: 'src/b.ts',
          line: 2,
          feedback: 'Second',
          parentType: 'change' as const,
          parentId: 'my-change',
          commentStyle: { prefix: '//' },
        },
        {
          file: 'src/c.ts',
          line: 3,
          feedback: 'Third',
          parentType: 'change' as const,
          parentId: 'my-change',
          commentStyle: { prefix: '//' },
        },
      ];

      const result = scanner.groupMarkersByParent(markers);
      expect(result.assigned[0].markers[0].feedback).toBe('First');
      expect(result.assigned[0].markers[1].feedback).toBe('Second');
      expect(result.assigned[0].markers[2].feedback).toBe('Third');
    });

    it('handles mixed assigned and unassigned markers', () => {
      const markers = [
        {
          file: 'src/assigned.ts',
          line: 10,
          feedback: 'Has parent',
          parentType: 'change' as const,
          parentId: 'my-change',
          commentStyle: { prefix: '//' },
        },
        {
          file: 'src/unassigned.ts',
          line: 5,
          feedback: 'No parent',
          parentType: null,
          parentId: null,
          commentStyle: { prefix: '//' },
        },
      ];

      const result = scanner.groupMarkersByParent(markers as any);
      expect(result.assigned).toHaveLength(1);
      expect(result.unassigned).toHaveLength(1);
    });
  });

  describe('generateReview', () => {
    const markers = [
      {
        file: 'src/file.ts',
        line: 10,
        feedback: 'Add validation',
        parentType: null,
        parentId: null,
        commentStyle: { prefix: '//' },
      },
      {
        file: 'src/utils.ts',
        line: 25,
        feedback: 'Update requirement',
        parentType: 'change' as const,
        parentId: 'cli-get-task',
        commentStyle: { prefix: '//' },
      },
    ];

    it('creates review directory', async () => {
      await scanner.generateReview('my-review', markers as any, 'change', 'test-change');

      const reviewDir = path.join(tempDir, 'workspace', 'reviews', 'my-review');
      const stat = await fs.stat(reviewDir);
      expect(stat.isDirectory()).toBe(true);
    });

    it('creates review.md with frontmatter', async () => {
      await scanner.generateReview('my-review', markers as any, 'change', 'test-change');

      const reviewPath = path.join(
        tempDir,
        'workspace',
        'reviews',
        'my-review',
        'review.md'
      );
      const content = await fs.readFile(reviewPath, 'utf-8');

      expect(content).toContain('parent-type: change');
      expect(content).toContain('parent-id: test-change');
      expect(content).toContain('reviewed-at:');
      expect(content).toContain('# Review: my-review');
    });

    it('includes summary with marker count', async () => {
      await scanner.generateReview('my-review', markers as any, 'change', 'test-change');

      const reviewPath = path.join(
        tempDir,
        'workspace',
        'reviews',
        'my-review',
        'review.md'
      );
      const content = await fs.readFile(reviewPath, 'utf-8');

      expect(content).toContain('Parsed 2 feedback markers');
      expect(content).toContain('from 2 files');
    });

    it('includes scope section with files', async () => {
      await scanner.generateReview('my-review', markers as any, 'change', 'test-change');

      const reviewPath = path.join(
        tempDir,
        'workspace',
        'reviews',
        'my-review',
        'review.md'
      );
      const content = await fs.readFile(reviewPath, 'utf-8');

      expect(content).toContain('## Scope');
      expect(content).toContain('src/file.ts');
      expect(content).toContain('src/utils.ts');
    });

    it('creates tasks directory', async () => {
      await scanner.generateReview('my-review', markers as any, 'change', 'test-change');

      const tasksDir = path.join(
        tempDir,
        'workspace',
        'reviews',
        'my-review',
        'tasks'
      );
      const stat = await fs.stat(tasksDir);
      expect(stat.isDirectory()).toBe(true);
    });

    it('creates numbered task files', async () => {
      await scanner.generateReview('my-review', markers as any, 'change', 'test-change');

      const tasksDir = path.join(
        tempDir,
        'workspace',
        'reviews',
        'my-review',
        'tasks'
      );
      const files = await fs.readdir(tasksDir);

      expect(files).toHaveLength(2);
      expect(files.some((f) => f.startsWith('001-'))).toBe(true);
      expect(files.some((f) => f.startsWith('002-'))).toBe(true);
    });

    it('task files contain frontmatter with status', async () => {
      await scanner.generateReview('my-review', markers as any, 'change', 'test-change');

      const tasksDir = path.join(
        tempDir,
        'workspace',
        'reviews',
        'my-review',
        'tasks'
      );
      const files = await fs.readdir(tasksDir);
      const taskContent = await fs.readFile(
        path.join(tasksDir, files[0]),
        'utf-8'
      );

      expect(taskContent).toContain('status: to-do');
    });

    it('task files include file:line reference', async () => {
      await scanner.generateReview('my-review', markers as any, 'change', 'test-change');

      const tasksDir = path.join(
        tempDir,
        'workspace',
        'reviews',
        'my-review',
        'tasks'
      );
      const files = await fs.readdir(tasksDir);
      const taskContent = await fs.readFile(
        path.join(tasksDir, files[0]),
        'utf-8'
      );

      expect(taskContent).toContain('src/file.ts:10');
    });

    it('handles different parent types', async () => {
      await scanner.generateReview('spec-review', markers as any, 'spec', 'cli-archive');

      const reviewPath = path.join(
        tempDir,
        'workspace',
        'reviews',
        'spec-review',
        'review.md'
      );
      const content = await fs.readFile(reviewPath, 'utf-8');

      expect(content).toContain('parent-type: spec');
      expect(content).toContain('parent-id: cli-archive');
    });

    it('handles task parent type', async () => {
      await scanner.generateReview(
        'task-review',
        markers as any,
        'task',
        '001-implement-feature'
      );

      const reviewPath = path.join(
        tempDir,
        'workspace',
        'reviews',
        'task-review',
        'review.md'
      );
      const content = await fs.readFile(reviewPath, 'utf-8');

      expect(content).toContain('parent-type: task');
      expect(content).toContain('parent-id: 001-implement-feature');
    });
  });

  describe('removeFeedbackMarkers', () => {
    it('removes marker line from file', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      const filePath = path.join(srcDir, 'file.ts');
      await fs.writeFile(
        filePath,
        `const x = 1;
// #FEEDBACK #TODO | Remove this
const y = 2;`
      );

      const markers = [
        {
          file: 'src/file.ts',
          line: 2,
          feedback: 'Remove this',
          parentType: null,
          parentId: null,
          commentStyle: { prefix: '//' },
        },
      ];

      await scanner.removeFeedbackMarkers(markers as any);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('const x = 1;\nconst y = 2;');
      expect(content).not.toContain('#FEEDBACK');
    });

    it('removes multiple markers from same file', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      const filePath = path.join(srcDir, 'file.ts');
      await fs.writeFile(
        filePath,
        `line 1
// #FEEDBACK #TODO | First
line 3
// #FEEDBACK #TODO | Second
line 5`
      );

      const markers = [
        {
          file: 'src/file.ts',
          line: 2,
          feedback: 'First',
          parentType: null,
          parentId: null,
          commentStyle: { prefix: '//' },
        },
        {
          file: 'src/file.ts',
          line: 4,
          feedback: 'Second',
          parentType: null,
          parentId: null,
          commentStyle: { prefix: '//' },
        },
      ];

      await scanner.removeFeedbackMarkers(markers as any);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('line 1\nline 3\nline 5');
    });

    it('removes markers from multiple files', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });

      const file1Path = path.join(srcDir, 'file1.ts');
      const file2Path = path.join(srcDir, 'file2.ts');

      await fs.writeFile(
        file1Path,
        `code
// #FEEDBACK #TODO | In file1
more code`
      );
      await fs.writeFile(
        file2Path,
        `other code
// #FEEDBACK #TODO | In file2
more other code`
      );

      const markers = [
        {
          file: 'src/file1.ts',
          line: 2,
          feedback: 'In file1',
          parentType: null,
          parentId: null,
          commentStyle: { prefix: '//' },
        },
        {
          file: 'src/file2.ts',
          line: 2,
          feedback: 'In file2',
          parentType: null,
          parentId: null,
          commentStyle: { prefix: '//' },
        },
      ];

      await scanner.removeFeedbackMarkers(markers as any);

      const content1 = await fs.readFile(file1Path, 'utf-8');
      const content2 = await fs.readFile(file2Path, 'utf-8');

      expect(content1).toBe('code\nmore code');
      expect(content2).toBe('other code\nmore other code');
    });

    it('preserves other content when removing markers', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      const filePath = path.join(srcDir, 'file.ts');
      await fs.writeFile(
        filePath,
        `// Regular comment
// #FEEDBACK #TODO | Remove this
// Another regular comment`
      );

      const markers = [
        {
          file: 'src/file.ts',
          line: 2,
          feedback: 'Remove this',
          parentType: null,
          parentId: null,
          commentStyle: { prefix: '//' },
        },
      ];

      await scanner.removeFeedbackMarkers(markers as any);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('// Regular comment\n// Another regular comment');
    });

    it('handles empty markers array', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      const filePath = path.join(srcDir, 'file.ts');
      await fs.writeFile(filePath, 'const x = 1;');

      await scanner.removeFeedbackMarkers([]);

      const content = await fs.readFile(filePath, 'utf-8');
      expect(content).toBe('const x = 1;');
    });
  });
});
