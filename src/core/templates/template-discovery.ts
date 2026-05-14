import { promises as fs } from 'fs';
import path from 'path';
import { MarkdownParser } from '../parsers/markdown-parser.js';
import { loadTemplate } from './template-loader.js';
import { KNOWN_TEMPLATE_TYPES } from '../../utils/task-utils.js';

export interface TemplateInfo {
  type: string;
  content: string;
  source: 'built-in' | 'user';
  filePath?: string;
}

/**
 * Discovers task templates from the workspace/templates/ directory.
 * Returns user-defined templates with their type and content.
 */
export async function discoverTemplates(workspacePath: string): Promise<TemplateInfo[]> {
  const templatesDir = path.join(workspacePath, 'templates');
  const templates: TemplateInfo[] = [];

  try {
    // Check if templates directory exists
    await fs.access(templatesDir);
  } catch {
    // Directory doesn't exist, return empty array
    return templates;
  }

  try {
    const entries = await fs.readdir(templatesDir);
    const markdownFiles = entries.filter((f) => f.endsWith('.md'));

    for (const filename of markdownFiles) {
      const filePath = path.join(templatesDir, filename);

      try {
        // Check if it's a file (not directory)
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) continue;

        // Read file content
        const content = await fs.readFile(filePath, 'utf-8');

        // Use MarkdownParser to extract frontmatter and get the type
        const parser = new MarkdownParser(content);
        const frontmatter = parser.getFrontmatter();
        const typeValue = frontmatter?.type;

        // Skip files without valid type in frontmatter
        if (!typeValue) {
          continue;
        }

        templates.push({
          type: typeValue,
          content,
          source: 'user',
          filePath,
        });
      } catch {
        // Skip files that can't be read
        continue;
      }
    }
  } catch {
    // Error reading directory, return what we have
    return templates;
  }

  return templates;
}

/**
 * Returns all built-in templates by loading them from assets/templates/task-types/.
 * Templates are loaded dynamically from the filesystem, not hardcoded.
 */
export function getBuiltInTemplates(): TemplateInfo[] {
  const templates: TemplateInfo[] = [];

  for (const type of KNOWN_TEMPLATE_TYPES) {
    try {
      const content = loadTemplate(`task-types/${type}.md`);
      templates.push({
        type,
        content,
        source: 'built-in',
      });
    } catch {
      // Skip templates that can't be loaded
      continue;
    }
  }

  return templates;
}

/**
 * Returns all available template types, with user templates overriding built-in templates.
 */
export async function getAvailableTypes(workspacePath: string): Promise<TemplateInfo[]> {
  const userTemplates = await discoverTemplates(workspacePath);
  const builtInTemplates = getBuiltInTemplates();

  // Create a map to handle overrides (user templates override built-in)
  const templateMap = new Map<string, TemplateInfo>();

  // Add built-in templates first
  for (const template of builtInTemplates) {
    templateMap.set(template.type, template);
  }

  // Override with user templates
  for (const template of userTemplates) {
    templateMap.set(template.type, template);
  }

  return Array.from(templateMap.values());
}

/**
 * Returns the template content for a specific type.
 * Checks user templates first, then falls back to built-in templates.
 * Returns null if the type is not found.
 */
export async function getTemplateByType(
  type: string,
  workspacePath: string
): Promise<string | null> {
  // Check user templates first
  const userTemplates = await discoverTemplates(workspacePath);
  const userTemplate = userTemplates.find((t) => t.type === type);
  if (userTemplate) {
    return userTemplate.content;
  }

  // Fall back to built-in templates loaded from assets
  try {
    return loadTemplate(`task-types/${type}.md`);
  } catch {
    // Type not found
    return null;
  }
}
