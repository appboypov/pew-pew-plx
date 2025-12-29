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
      expect(result[0].specImpact).toBeNull();
    });

    it('finds marker with spec impact', async () => {
      const srcDir = path.join(tempDir, 'src');
      await fs.mkdir(srcDir, { recursive: true });
      await fs.writeFile(
        path.join(srcDir, 'file.ts'),
        '// #FEEDBACK #TODO | Update requirement (spec:cli-get-task)'
      );

      const result = await scanner.scanDirectory('src');
      expect(result).toHaveLength(1);
      expect(result[0].feedback).toBe('Update requirement');
      expect(result[0].specImpact).toBe('cli-get-task');
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

  describe('generateReview', () => {
    const markers = [
      {
        file: 'src/file.ts',
        line: 10,
        feedback: 'Add validation',
        specImpact: null,
        commentStyle: { prefix: '//' },
      },
      {
        file: 'src/utils.ts',
        line: 25,
        feedback: 'Update requirement',
        specImpact: 'cli-get-task',
        commentStyle: { prefix: '//' },
      },
    ];

    it('creates review directory', async () => {
      await scanner.generateReview('my-review', markers, 'change', 'test-change');

      const reviewDir = path.join(tempDir, 'workspace', 'reviews', 'my-review');
      const stat = await fs.stat(reviewDir);
      expect(stat.isDirectory()).toBe(true);
    });

    it('creates review.md with frontmatter', async () => {
      await scanner.generateReview('my-review', markers, 'change', 'test-change');

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
      await scanner.generateReview('my-review', markers, 'change', 'test-change');

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
      await scanner.generateReview('my-review', markers, 'change', 'test-change');

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

    it('includes spec impact findings', async () => {
      await scanner.generateReview('my-review', markers, 'change', 'test-change');

      const reviewPath = path.join(
        tempDir,
        'workspace',
        'reviews',
        'my-review',
        'review.md'
      );
      const content = await fs.readFile(reviewPath, 'utf-8');

      expect(content).toContain('## Spec Impact Findings');
      expect(content).toContain('**cli-get-task**');
    });

    it('creates tasks directory', async () => {
      await scanner.generateReview('my-review', markers, 'change', 'test-change');

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
      await scanner.generateReview('my-review', markers, 'change', 'test-change');

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
      await scanner.generateReview('my-review', markers, 'change', 'test-change');

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

    it('task files contain spec-impact field', async () => {
      await scanner.generateReview('my-review', markers, 'change', 'test-change');

      const tasksDir = path.join(
        tempDir,
        'workspace',
        'reviews',
        'my-review',
        'tasks'
      );
      const files = await fs.readdir(tasksDir);

      // First task has no spec impact
      const task1 = await fs.readFile(path.join(tasksDir, files[0]), 'utf-8');
      expect(task1).toContain('spec-impact: none');

      // Second task has spec impact
      const task2 = await fs.readFile(path.join(tasksDir, files[1]), 'utf-8');
      expect(task2).toContain('spec-impact: cli-get-task');
    });

    it('task files include file:line reference', async () => {
      await scanner.generateReview('my-review', markers, 'change', 'test-change');

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
      await scanner.generateReview('spec-review', markers, 'spec', 'cli-archive');

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
        markers,
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
          specImpact: null,
          commentStyle: { prefix: '//' },
        },
      ];

      await scanner.removeFeedbackMarkers(markers);

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
          specImpact: null,
          commentStyle: { prefix: '//' },
        },
        {
          file: 'src/file.ts',
          line: 4,
          feedback: 'Second',
          specImpact: null,
          commentStyle: { prefix: '//' },
        },
      ];

      await scanner.removeFeedbackMarkers(markers);

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
          specImpact: null,
          commentStyle: { prefix: '//' },
        },
        {
          file: 'src/file2.ts',
          line: 2,
          feedback: 'In file2',
          specImpact: null,
          commentStyle: { prefix: '//' },
        },
      ];

      await scanner.removeFeedbackMarkers(markers);

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
          specImpact: null,
          commentStyle: { prefix: '//' },
        },
      ];

      await scanner.removeFeedbackMarkers(markers);

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
