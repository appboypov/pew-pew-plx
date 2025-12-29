import path from 'node:path';

/**
 * Comment style for a file type
 */
export interface CommentStyle {
  prefix: string;
  suffix?: string;
}

/**
 * Parsed feedback marker result
 */
export interface ParsedFeedbackMarker {
  feedback: string;
  parentType: 'task' | 'change' | 'spec' | null;
  parentId: string | null;
}

/**
 * Regex pattern for matching feedback markers
 * Group 1: parent type (optional): task, change, or spec
 * Group 2: parent id (optional): kebab-case identifier
 * Group 3: feedback text
 * Strips trailing block comment suffixes
 */
export const FEEDBACK_PATTERN =
  /#FEEDBACK\s+#TODO\s*\|\s*(?:(task|change|spec):([a-z0-9-]+)\s*\|\s*)?(.+?)\s*(?:-->|\*\/)?$/;

/**
 * Comment styles mapped by file extension
 */
const COMMENT_STYLES: Record<string, CommentStyle> = {
  // Single-line // comments
  '.js': { prefix: '//' },
  '.ts': { prefix: '//' },
  '.jsx': { prefix: '//' },
  '.tsx': { prefix: '//' },
  '.c': { prefix: '//' },
  '.cpp': { prefix: '//' },
  '.java': { prefix: '//' },
  '.swift': { prefix: '//' },
  '.go': { prefix: '//' },
  '.rs': { prefix: '//' },
  '.dart': { prefix: '//' },
  '.kt': { prefix: '//' },
  '.scala': { prefix: '//' },
  '.m': { prefix: '//' },

  // Hash # comments
  '.py': { prefix: '#' },
  '.rb': { prefix: '#' },
  '.sh': { prefix: '#' },
  '.bash': { prefix: '#' },
  '.zsh': { prefix: '#' },
  '.yaml': { prefix: '#' },
  '.yml': { prefix: '#' },
  '.toml': { prefix: '#' },
  '.pl': { prefix: '#' },
  '.r': { prefix: '#' },

  // Double-dash -- comments
  '.sql': { prefix: '--' },
  '.lua': { prefix: '--' },
  '.hs': { prefix: '--' },

  // Semicolon ; comments
  '.lisp': { prefix: ';' },
  '.clj': { prefix: ';' },
  '.el': { prefix: ';' },

  // Block comments (HTML/XML/Markdown)
  '.html': { prefix: '<!--', suffix: '-->' },
  '.xml': { prefix: '<!--', suffix: '-->' },
  '.svg': { prefix: '<!--', suffix: '-->' },
  '.md': { prefix: '<!--', suffix: '-->' },

  // Block comments (CSS)
  '.css': { prefix: '/*', suffix: '*/' },
  '.scss': { prefix: '/*', suffix: '*/' },
  '.less': { prefix: '/*', suffix: '*/' },
};

/**
 * Default comment style for unknown file extensions
 */
const DEFAULT_COMMENT_STYLE: CommentStyle = { prefix: '//' };

/**
 * Gets the comment style for a file based on its extension
 */
export function getCommentStyle(filepath: string): CommentStyle {
  const ext = path.extname(filepath).toLowerCase();
  return COMMENT_STYLES[ext] ?? DEFAULT_COMMENT_STYLE;
}

/**
 * Formats a feedback marker for a specific file type
 */
export function formatFeedbackMarker(
  filepath: string,
  feedback: string,
  parent?: { type: 'task' | 'change' | 'spec'; id: string }
): string {
  const style = getCommentStyle(filepath);
  const parentPart = parent ? `${parent.type}:${parent.id} | ` : '';
  const content = `#FEEDBACK #TODO | ${parentPart}${feedback}`;

  if (style.suffix) {
    return `${style.prefix} ${content} ${style.suffix}`;
  }
  return `${style.prefix} ${content}`;
}

/**
 * Parses a feedback marker from a line of text
 * Returns null if the line does not contain a valid feedback marker
 */
export function parseFeedbackMarker(line: string): ParsedFeedbackMarker | null {
  const match = line.match(FEEDBACK_PATTERN);
  if (!match) {
    return null;
  }

  return {
    feedback: match[3].trim(),
    parentType: (match[1] as 'task' | 'change' | 'spec') ?? null,
    parentId: match[2] ?? null,
  };
}
