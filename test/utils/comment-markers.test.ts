import { describe, it, expect } from 'vitest';
import {
  getCommentStyle,
  formatFeedbackMarker,
  parseFeedbackMarker,
  FEEDBACK_PATTERN,
} from '../../src/utils/comment-markers.js';

describe('comment-markers', () => {
  describe('getCommentStyle', () => {
    describe('single-line // comments', () => {
      const slashExtensions = [
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '.c',
        '.cpp',
        '.java',
        '.swift',
        '.go',
        '.rs',
        '.dart',
        '.kt',
        '.scala',
        '.m',
      ];

      for (const ext of slashExtensions) {
        it(`returns // for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({ prefix: '//' });
        });
      }
    });

    describe('hash # comments', () => {
      const hashExtensions = [
        '.py',
        '.rb',
        '.sh',
        '.bash',
        '.zsh',
        '.yaml',
        '.yml',
        '.toml',
        '.pl',
        '.r',
      ];

      for (const ext of hashExtensions) {
        it(`returns # for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({ prefix: '#' });
        });
      }
    });

    describe('double-dash -- comments', () => {
      const dashExtensions = ['.sql', '.lua', '.hs'];

      for (const ext of dashExtensions) {
        it(`returns -- for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({ prefix: '--' });
        });
      }
    });

    describe('semicolon ; comments', () => {
      const semicolonExtensions = ['.lisp', '.clj', '.el'];

      for (const ext of semicolonExtensions) {
        it(`returns ; for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({ prefix: ';' });
        });
      }
    });

    describe('block comments <!-- -->', () => {
      const xmlExtensions = ['.html', '.xml', '.svg', '.md'];

      for (const ext of xmlExtensions) {
        it(`returns <!-- --> for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({
            prefix: '<!--',
            suffix: '-->',
          });
        });
      }
    });

    describe('block comments /* */', () => {
      const cssExtensions = ['.css', '.scss', '.less'];

      for (const ext of cssExtensions) {
        it(`returns /* */ for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({
            prefix: '/*',
            suffix: '*/',
          });
        });
      }
    });

    it('returns default // for unknown extensions', () => {
      expect(getCommentStyle('file.unknown')).toEqual({ prefix: '//' });
      expect(getCommentStyle('file.xyz')).toEqual({ prefix: '//' });
      expect(getCommentStyle('noextension')).toEqual({ prefix: '//' });
    });

    it('handles case-insensitive extensions', () => {
      expect(getCommentStyle('file.TS')).toEqual({ prefix: '//' });
      expect(getCommentStyle('file.PY')).toEqual({ prefix: '#' });
    });

    it('handles paths with directories', () => {
      expect(getCommentStyle('src/utils/file.ts')).toEqual({ prefix: '//' });
      expect(getCommentStyle('/absolute/path/file.py')).toEqual({ prefix: '#' });
    });
  });

  describe('formatFeedbackMarker', () => {
    it('formats marker for TypeScript files', () => {
      const result = formatFeedbackMarker('file.ts', 'Add validation');
      expect(result).toBe('// #FEEDBACK #TODO | Add validation');
    });

    it('formats marker with task parent', () => {
      const result = formatFeedbackMarker('file.ts', 'Update logic', {
        type: 'task',
        id: '001-implement-feature',
      });
      expect(result).toBe('// #FEEDBACK #TODO | task:001-implement-feature | Update logic');
    });

    it('formats marker with change parent', () => {
      const result = formatFeedbackMarker('file.ts', 'Update requirement', {
        type: 'change',
        id: 'cli-get-task',
      });
      expect(result).toBe('// #FEEDBACK #TODO | change:cli-get-task | Update requirement');
    });

    it('formats marker with spec parent', () => {
      const result = formatFeedbackMarker('file.ts', 'Update spec', {
        type: 'spec',
        id: 'api-docs',
      });
      expect(result).toBe('// #FEEDBACK #TODO | spec:api-docs | Update spec');
    });

    it('formats marker for Python files', () => {
      const result = formatFeedbackMarker('file.py', 'Fix bug');
      expect(result).toBe('# #FEEDBACK #TODO | Fix bug');
    });

    it('formats marker for SQL files', () => {
      const result = formatFeedbackMarker('file.sql', 'Optimize query');
      expect(result).toBe('-- #FEEDBACK #TODO | Optimize query');
    });

    it('formats marker for HTML files with block comment', () => {
      const result = formatFeedbackMarker('file.html', 'Update structure');
      expect(result).toBe('<!-- #FEEDBACK #TODO | Update structure -->');
    });

    it('formats marker for CSS files with block comment', () => {
      const result = formatFeedbackMarker('file.css', 'Fix styling');
      expect(result).toBe('/* #FEEDBACK #TODO | Fix styling */');
    });

    it('formats marker for Markdown files', () => {
      const result = formatFeedbackMarker('docs/readme.md', 'Add section');
      expect(result).toBe('<!-- #FEEDBACK #TODO | Add section -->');
    });

    it('formats marker with parent for block comments', () => {
      const result = formatFeedbackMarker('file.html', 'Update docs', {
        type: 'spec',
        id: 'api-docs',
      });
      expect(result).toBe('<!-- #FEEDBACK #TODO | spec:api-docs | Update docs -->');
    });
  });

  describe('parseFeedbackMarker', () => {
    it('parses simple feedback marker', () => {
      const result = parseFeedbackMarker('// #FEEDBACK #TODO | Add validation');
      expect(result).toEqual({
        feedback: 'Add validation',
        parentType: null,
        parentId: null,
      });
    });

    it('parses feedback marker with task parent', () => {
      const result = parseFeedbackMarker(
        '// #FEEDBACK #TODO | task:001-implement-feature | Update logic'
      );
      expect(result).toEqual({
        feedback: 'Update logic',
        parentType: 'task',
        parentId: '001-implement-feature',
      });
    });

    it('parses feedback marker with change parent', () => {
      const result = parseFeedbackMarker(
        '// #FEEDBACK #TODO | change:cli-get-task | Update requirement'
      );
      expect(result).toEqual({
        feedback: 'Update requirement',
        parentType: 'change',
        parentId: 'cli-get-task',
      });
    });

    it('parses feedback marker with spec parent', () => {
      const result = parseFeedbackMarker(
        '// #FEEDBACK #TODO | spec:api-docs | Update spec'
      );
      expect(result).toEqual({
        feedback: 'Update spec',
        parentType: 'spec',
        parentId: 'api-docs',
      });
    });

    it('parses Python-style comment', () => {
      const result = parseFeedbackMarker('# #FEEDBACK #TODO | Fix bug');
      expect(result).toEqual({
        feedback: 'Fix bug',
        parentType: null,
        parentId: null,
      });
    });

    it('parses SQL-style comment', () => {
      const result = parseFeedbackMarker('-- #FEEDBACK #TODO | Optimize query');
      expect(result).toEqual({
        feedback: 'Optimize query',
        parentType: null,
        parentId: null,
      });
    });

    it('parses HTML block comment', () => {
      const result = parseFeedbackMarker('<!-- #FEEDBACK #TODO | Update structure -->');
      expect(result).toEqual({
        feedback: 'Update structure',
        parentType: null,
        parentId: null,
      });
    });

    it('parses CSS block comment', () => {
      const result = parseFeedbackMarker('/* #FEEDBACK #TODO | Fix styling */');
      expect(result).toEqual({
        feedback: 'Fix styling',
        parentType: null,
        parentId: null,
      });
    });

    it('parses block comment with parent', () => {
      const result = parseFeedbackMarker(
        '<!-- #FEEDBACK #TODO | spec:api-docs | Update docs -->'
      );
      expect(result).toEqual({
        feedback: 'Update docs',
        parentType: 'spec',
        parentId: 'api-docs',
      });
    });

    it('handles extra whitespace', () => {
      const result = parseFeedbackMarker('//   #FEEDBACK   #TODO   |   Trim spaces  ');
      expect(result).toEqual({
        feedback: 'Trim spaces',
        parentType: null,
        parentId: null,
      });
    });

    it('returns null for invalid lines', () => {
      expect(parseFeedbackMarker('// regular comment')).toBeNull();
      expect(parseFeedbackMarker('// TODO: not a feedback marker')).toBeNull();
      expect(parseFeedbackMarker('console.log("hello")')).toBeNull();
      expect(parseFeedbackMarker('')).toBeNull();
    });

    it('returns null for partial matches', () => {
      expect(parseFeedbackMarker('// #FEEDBACK without TODO')).toBeNull();
      expect(parseFeedbackMarker('// #TODO without FEEDBACK')).toBeNull();
      expect(parseFeedbackMarker('// #FEEDBACK #TODO without pipe')).toBeNull();
    });

    it('handles parent-id with numbers and hyphens', () => {
      const result = parseFeedbackMarker(
        '// #FEEDBACK #TODO | change:cli-v2-get-task-123 | Update'
      );
      expect(result).toEqual({
        feedback: 'Update',
        parentType: 'change',
        parentId: 'cli-v2-get-task-123',
      });
    });

    it('handles feedback with special characters', () => {
      const result = parseFeedbackMarker(
        "// #FEEDBACK #TODO | Handle edge-case: user's input"
      );
      expect(result).toEqual({
        feedback: "Handle edge-case: user's input",
        parentType: null,
        parentId: null,
      });
    });

    it('handles feedback with special characters and parent', () => {
      const result = parseFeedbackMarker(
        "// #FEEDBACK #TODO | task:001-fix | Handle edge-case: user's input"
      );
      expect(result).toEqual({
        feedback: "Handle edge-case: user's input",
        parentType: 'task',
        parentId: '001-fix',
      });
    });
  });

  describe('FEEDBACK_PATTERN', () => {
    it('matches basic feedback pattern', () => {
      const match = '#FEEDBACK #TODO | Some feedback'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBeUndefined();
      expect(match![2]).toBeUndefined();
      expect(match![3]).toBe('Some feedback');
    });

    it('matches pattern with task parent', () => {
      const match = '#FEEDBACK #TODO | task:my-task | Feedback'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('task');
      expect(match![2]).toBe('my-task');
      expect(match![3]).toBe('Feedback');
    });

    it('matches pattern with change parent', () => {
      const match = '#FEEDBACK #TODO | change:my-change | Feedback'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('change');
      expect(match![2]).toBe('my-change');
      expect(match![3]).toBe('Feedback');
    });

    it('matches pattern with spec parent', () => {
      const match = '#FEEDBACK #TODO | spec:my-spec | Feedback'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('spec');
      expect(match![2]).toBe('my-spec');
      expect(match![3]).toBe('Feedback');
    });

    it('strips trailing --> from HTML comments', () => {
      const match = '#FEEDBACK #TODO | HTML feedback -->'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![3]).toBe('HTML feedback');
    });

    it('strips trailing */ from CSS comments', () => {
      const match = '#FEEDBACK #TODO | CSS feedback */'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![3]).toBe('CSS feedback');
    });

    it('strips trailing --> with parent linkage', () => {
      const match = '#FEEDBACK #TODO | spec:docs | HTML feedback -->'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('spec');
      expect(match![2]).toBe('docs');
      expect(match![3]).toBe('HTML feedback');
    });

    it('does not match without pipe separator', () => {
      const match = '#FEEDBACK #TODO No pipe'.match(FEEDBACK_PATTERN);
      expect(match).toBeNull();
    });

    it('does not match invalid parent types', () => {
      const match = '#FEEDBACK #TODO | invalid:my-id | Feedback'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBeUndefined();
      expect(match![2]).toBeUndefined();
      expect(match![3]).toBe('invalid:my-id | Feedback');
    });
  });
});
