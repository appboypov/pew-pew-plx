import { promises as fs } from 'fs';
import path from 'path';
import { loadTemplate, loadTemplateWithReplacements } from './template-loader.js';
import {
  KNOWN_TEMPLATE_TYPES,
  isValidTemplateType,
  buildTaskFrontmatter,
  type TemplateType,
} from '../../utils/task-utils.js';

export interface Template {
  path: string;
  content: string;
}

export interface WorkspaceTemplateResult {
  body: string;
  found: boolean;
  error?: string;
}

export interface ArchitectureContext {
  description?: string;
}

export interface TaskContext {
  title: string;
  skillLevel?: 'junior' | 'medior' | 'senior';
  parentType?: 'change' | 'review';
  parentId?: string;
  type?: string;
  blockedBy?: string[];
}

export interface ChangeContext {
  name: string;
}

export interface SpecContext {
  name: string;
}

export interface RequestContext {
  description: string;
}

export type SlashCommandId =
  | 'archive'
  | 'complete-task'
  | 'copy-next-task'
  | 'copy-review-request'
  | 'copy-test-request'
  | 'get-task'
  | 'implement'
  | 'orchestrate'
  | 'parse-feedback'
  | 'plan-implementation'
  | 'plan-proposal'
  | 'plan-request'
  | 'prepare-compact'
  | 'prepare-release'
  | 'refine-architecture'
  | 'refine-release'
  | 'refine-review'
  | 'refine-testing'
  | 'review'
  | 'sync-tasks'
  | 'sync-workspace'
  | 'test'
  | 'undo-task';

export interface TaskTypeTemplate {
  type: string;
  filename: string;
  content: string;
}

export class TemplateManager {
  static getTemplates(): Template[] {
    return [
      {
        path: 'AGENTS.md',
        content: loadTemplate('workspace/agents.md')
      }
    ];
  }

  static getClaudeTemplate(): string {
    return loadTemplate('workspace/agents-root-stub.md');
  }

  static getClineTemplate(): string {
    return loadTemplate('workspace/agents-root-stub.md');
  }

  static getCostrictTemplate(): string {
    return loadTemplate('workspace/agents-root-stub.md');
  }

  static getAgentsStandardTemplate(): string {
    return loadTemplate('workspace/agents-root-stub.md');
  }

  static getSlashCommandBody(id: SlashCommandId): string {
    return loadTemplate(`slash-commands/${id}.md`);
  }

  static getArchitectureTemplate(context?: ArchitectureContext): string {
    const template = loadTemplate('workspace/architecture.md');
    const description = context?.description || 'TBD - Describe the project purpose and high-level architecture.';
    return template.replace('{{DESCRIPTION}}', description);
  }

  static getReviewTemplate(): string {
    return loadTemplate('workspace/review.md');
  }

  static getReleaseTemplate(): string {
    return loadTemplate('workspace/release.md');
  }

  static getTestingTemplate(): string {
    return loadTemplate('workspace/testing.md');
  }

  static getTaskTemplate(context: TaskContext): string {
    const frontmatter = buildTaskFrontmatter({
      status: 'to-do',
      skillLevel: context.skillLevel,
      parentType: context.parentType,
      parentId: context.parentId,
      type: context.type,
      blockedBy: context.blockedBy,
    });

    const availableTypes = KNOWN_TEMPLATE_TYPES.join(', ');
    const template = loadTemplateWithReplacements('entities/task.md', {
      TITLE: context.title,
      AVAILABLE_TYPES: availableTypes,
    });

    return `${frontmatter}\n\n${template}`;
  }

  static getChangeTemplate(context: ChangeContext): string {
    return loadTemplateWithReplacements('entities/change.md', {
      NAME: context.name,
    });
  }

  static getSpecTemplate(context: SpecContext): string {
    return loadTemplateWithReplacements('entities/spec.md', {
      NAME: context.name,
    });
  }

  static getRequestTemplate(context: RequestContext): string {
    return loadTemplateWithReplacements('entities/request.md', {
      DESCRIPTION: context.description,
    });
  }

  /**
   * Returns the built-in task type templates for workspace/templates/.
   */
  static getTaskTypeTemplates(): TaskTypeTemplate[] {
    return KNOWN_TEMPLATE_TYPES.map(type => ({
      type,
      filename: `${type}.md`,
      content: loadTemplate(`task-types/${type}.md`),
    }));
  }

  /**
   * Returns a specific task type template by type name.
   */
  static getTaskTypeTemplate(type: string): TaskTypeTemplate | undefined {
    if (!isValidTemplateType(type)) return undefined;
    return {
      type,
      filename: `${type}.md`,
      content: loadTemplate(`task-types/${type}.md`),
    };
  }

  /**
   * Returns the list of known template types.
   */
  static getKnownTemplateTypes(): readonly string[] {
    return KNOWN_TEMPLATE_TYPES;
  }

  /**
   * Validates if a template type is known.
   */
  static isValidTemplateType(type: string): type is TemplateType {
    return isValidTemplateType(type);
  }

  /**
   * Reads a template file from workspace/templates/<type>.md and extracts the body.
   * Strips frontmatter (content between --- markers) and template header.
   * Returns the content starting from the first ## section with the user's title.
   *
   * @param workspacePath - Path to the workspace root
   * @param templateType - The template type (e.g., 'implementation', 'bug')
   * @param taskTitle - The title to use in the task header
   * @returns Object with body content, found status, and optional error message
   */
  static async readWorkspaceTemplate(
    workspacePath: string,
    templateType: string,
    taskTitle: string
  ): Promise<WorkspaceTemplateResult> {
    const templatePath = path.join(workspacePath, 'templates', `${templateType}.md`);

    try {
      const content = await fs.readFile(templatePath, 'utf-8');

      // Strip frontmatter (content between --- markers at the start)
      let body = content;
      if (content.startsWith('---')) {
        const endMarkerIndex = content.indexOf('---', 3);
        if (endMarkerIndex !== -1) {
          body = content.substring(endMarkerIndex + 3).trim();
        }
      }

      // Find the first ## section and keep everything from there
      // This skips the template title (# heading) and any description text
      const firstSectionIndex = body.indexOf('\n## ');
      if (firstSectionIndex !== -1) {
        // Extract the emoji from the original # title line if present
        // Handles basic emoji, ZWJ sequences, and variation selectors
        const titleMatch = body.match(/^#\s*([\p{Emoji_Presentation}\p{Emoji}\uFE0F\u200d]+)\s*/u);
        const emoji = titleMatch ? titleMatch[1] : '📋';

        // Build the task title with emoji and user's title
        const taskTitleLine = `# ${emoji} ${taskTitle}`;
        body = taskTitleLine + '\n' + body.substring(firstSectionIndex + 1);
      }

      return { body, found: true };
    } catch (err) {
      const error = err as NodeJS.ErrnoException;
      if (error.code === 'ENOENT') {
        return { body: '', found: false, error: `Template file not found: ${templatePath}` };
      }
      if (error.code === 'EACCES') {
        return { body: '', found: false, error: `Permission denied reading template: ${templatePath}` };
      }
      return { body: '', found: false, error: `Error reading template: ${error.message}` };
    }
  }
}

// Lazy evaluation via getter function - caches on first call
let _agentsTemplateCache: string | undefined;

export function getAgentsTemplate(): string {
  if (_agentsTemplateCache === undefined) {
    _agentsTemplateCache = TemplateManager.getTemplates()[0].content;
  }
  return _agentsTemplateCache;
}

// Deprecated: Use getAgentsTemplate() instead for lazy evaluation
// This const export evaluates immediately at import time
export const agentsTemplate = TemplateManager.getTemplates()[0].content;

export type { TemplateType } from '../../utils/task-utils.js';
export { KNOWN_TEMPLATE_TYPES, isValidTemplateType } from '../../utils/task-utils.js';

// Lazy evaluation for task type templates
export function getTaskTypeTemplate(type: string): TaskTypeTemplate | undefined {
  return TemplateManager.getTaskTypeTemplate(type);
}

// Template discovery exports
export {
  discoverTemplates,
  getBuiltInTemplates,
  getAvailableTypes,
  getTemplateByType,
  type TemplateInfo,
} from './template-discovery.js';
