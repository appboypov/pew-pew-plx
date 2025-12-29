import { promises as fs } from 'fs';
import path from 'path';
import ignore, { Ignore } from 'ignore';
import {
  CommentStyle,
  getCommentStyle,
  parseFeedbackMarker,
} from '../utils/comment-markers.js';
import { ReviewParent } from '../core/schemas/index.js';

/**
 * Feedback marker found in a source file
 */
export interface FeedbackMarker {
  file: string;
  line: number;
  feedback: string;
  parentType: 'task' | 'change' | 'spec' | null;
  parentId: string | null;
  commentStyle: CommentStyle;
}

/**
 * Group of markers sharing the same parent
 */
export interface GroupedMarkers {
  parentType: ReviewParent;
  parentId: string;
  markers: FeedbackMarker[];
}

/**
 * Markers separated into assigned (with parent) and unassigned (no parent)
 */
export interface MarkerGroups {
  assigned: GroupedMarkers[];
  unassigned: FeedbackMarker[];
}

/**
 * Extensions that can contain feedback markers
 */
const SCANNABLE_EXTENSIONS = new Set([
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
  '.sql',
  '.lua',
  '.hs',
  '.lisp',
  '.clj',
  '.el',
  '.html',
  '.xml',
  '.svg',
  '.md',
  '.css',
  '.scss',
  '.less',
]);

/**
 * Directories always excluded from scanning
 */
const ALWAYS_EXCLUDED = ['node_modules', 'dist', 'build', '.git'];

/**
 * Service for scanning codebase for feedback markers and generating review entities
 */
export class FeedbackScannerService {
  private root: string;
  private reviewsPath: string;
  private ig: Ignore | null = null;

  constructor(root: string = process.cwd()) {
    this.root = root;
    this.reviewsPath = path.join(root, 'workspace', 'reviews');
  }

  /**
   * Scans a directory recursively for feedback markers
   */
  async scanDirectory(dir: string): Promise<FeedbackMarker[]> {
    await this.initIgnore();
    const markers: FeedbackMarker[] = [];
    const files = await this.walkDirectory(dir);

    for (const file of files) {
      const fileMarkers = await this.scanFile(file);
      markers.push(...fileMarkers);
    }

    return markers;
  }

  /**
   * Generates a review entity from feedback markers
   */
  async generateReview(
    reviewId: string,
    markers: FeedbackMarker[],
    parentType: ReviewParent,
    parentId: string
  ): Promise<void> {
    const reviewDir = path.join(this.reviewsPath, reviewId);
    const tasksDir = path.join(reviewDir, 'tasks');

    await fs.mkdir(tasksDir, { recursive: true });

    const reviewContent = this.generateReviewContent(reviewId, markers, parentType, parentId);
    await fs.writeFile(path.join(reviewDir, 'review.md'), reviewContent);

    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      const sequence = String(i + 1).padStart(3, '0');
      const taskName = this.generateTaskName(marker.feedback);
      const filename = `${sequence}-${taskName}.md`;
      const taskContent = this.generateTaskContent(marker);
      await fs.writeFile(path.join(tasksDir, filename), taskContent);
    }
  }

  /**
   * Removes feedback markers from source files
   */
  async removeFeedbackMarkers(markers: FeedbackMarker[]): Promise<void> {
    const fileGroups = new Map<string, FeedbackMarker[]>();

    for (const marker of markers) {
      const existing = fileGroups.get(marker.file) ?? [];
      existing.push(marker);
      fileGroups.set(marker.file, existing);
    }

    for (const [file, fileMarkers] of fileGroups) {
      const filepath = path.join(this.root, file);
      const content = await fs.readFile(filepath, 'utf-8');
      const lines = content.split('\n');

      const linesToRemove = new Set(fileMarkers.map((m) => m.line - 1));
      const newLines = lines.filter((_, i) => !linesToRemove.has(i));

      await fs.writeFile(filepath, newLines.join('\n'));
    }
  }

  /**
   * Groups markers by their parent, separating assigned from unassigned
   */
  groupMarkersByParent(markers: FeedbackMarker[]): MarkerGroups {
    const groups = new Map<string, GroupedMarkers>();
    const unassigned: FeedbackMarker[] = [];

    for (const marker of markers) {
      if (marker.parentType && marker.parentId) {
        const key = `${marker.parentType}:${marker.parentId}`;
        const existing = groups.get(key);
        if (existing) {
          existing.markers.push(marker);
        } else {
          groups.set(key, {
            parentType: marker.parentType,
            parentId: marker.parentId,
            markers: [marker],
          });
        }
      } else {
        unassigned.push(marker);
      }
    }

    return {
      assigned: Array.from(groups.values()),
      unassigned,
    };
  }

  private async initIgnore(): Promise<void> {
    if (this.ig) return;

    this.ig = ignore();
    this.ig.add(ALWAYS_EXCLUDED);

    try {
      const gitignorePath = path.join(this.root, '.gitignore');
      const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
      this.ig.add(gitignoreContent);
    } catch {
      // .gitignore may not exist
    }
  }

  private async walkDirectory(dir: string): Promise<string[]> {
    const files: string[] = [];
    const absoluteDir = path.isAbsolute(dir) ? dir : path.join(this.root, dir);

    try {
      const entries = await fs.readdir(absoluteDir, { withFileTypes: true });

      for (const entry of entries) {
        const relativePath = path.relative(
          this.root,
          path.join(absoluteDir, entry.name)
        );

        if (this.ig?.ignores(relativePath)) {
          continue;
        }

        if (entry.isDirectory()) {
          const subFiles = await this.walkDirectory(
            path.join(absoluteDir, entry.name)
          );
          files.push(...subFiles);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (SCANNABLE_EXTENSIONS.has(ext)) {
            files.push(relativePath.replace(/\\/g, '/'));
          }
        }
      }
    } catch {
      // Directory may not exist or be inaccessible
    }

    return files;
  }

  private async scanFile(relativePath: string): Promise<FeedbackMarker[]> {
    const markers: FeedbackMarker[] = [];
    const filepath = path.join(this.root, relativePath);
    const commentStyle = getCommentStyle(filepath);

    try {
      const content = await fs.readFile(filepath, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const parsed = parseFeedbackMarker(lines[i]);
        if (parsed) {
          markers.push({
            file: relativePath.replace(/\\/g, '/'),
            line: i + 1,
            feedback: parsed.feedback,
            parentType: parsed.parentType,
            parentId: parsed.parentId,
            commentStyle,
          });
        }
      }
    } catch {
      // File may not be readable
    }

    return markers;
  }

  private generateReviewContent(
    reviewId: string,
    markers: FeedbackMarker[],
    parentType: ReviewParent,
    parentId: string
  ): string {
    const timestamp = new Date().toISOString();
    const uniqueFiles = [...new Set(markers.map((m) => m.file))];

    return `---
parent-type: ${parentType}
parent-id: ${parentId}
reviewed-at: ${timestamp}
---

# Review: ${reviewId}

## Summary
Parsed ${markers.length} feedback marker${markers.length === 1 ? '' : 's'} from ${uniqueFiles.length} file${uniqueFiles.length === 1 ? '' : 's'}.

## Scope
${uniqueFiles.map((f) => `- ${f}`).join('\n')}
`;
  }

  private generateTaskContent(marker: FeedbackMarker): string {
    return `---
status: to-do
---

# Task: ${this.truncateFeedback(marker.feedback, 60)}

## Feedback
${marker.feedback}

## End Goal
Address feedback: ${marker.feedback}

## Currently
Feedback marker exists at ${marker.file}:${marker.line}

## Should
Implement the required change.

## Constraints
- None specified

## Acceptance Criteria
- [ ] Feedback addressed

## Implementation Checklist
- [ ] Address feedback
- [ ] Remove feedback marker

## Notes
Generated from feedback marker at ${marker.file}:${marker.line}
`;
  }

  private generateTaskName(feedback: string): string {
    const words = feedback
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 0)
      .slice(0, 5);

    const name = words.join('-').slice(0, 50);
    return name || 'feedback-task';
  }

  private truncateFeedback(feedback: string, maxLength: number): string {
    if (feedback.length <= maxLength) {
      return feedback;
    }
    return feedback.slice(0, maxLength - 3) + '...';
  }
}
