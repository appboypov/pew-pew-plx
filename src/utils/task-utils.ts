/**
 * Known task template types that can be used with --type option.
 */
export const KNOWN_TEMPLATE_TYPES = [
  'story',
  'bug',
  'implementation',
  'components',
  'business-logic',
  'research',
  'discovery',
  'chore',
  'refactor',
  'infrastructure',
  'documentation',
  'release',
] as const;

export type TemplateType = (typeof KNOWN_TEMPLATE_TYPES)[number];

/**
 * Validates if a string is a known template type.
 */
export function isValidTemplateType(type: string): type is TemplateType {
  return KNOWN_TEMPLATE_TYPES.includes(type as TemplateType);
}

/**
 * Converts a string to kebab-case, removing special characters and truncating to 50 chars.
 */
export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Parses a potentially workspace-prefixed ID (e.g., "project-a/change-name").
 * Returns just the item ID portion without the workspace prefix.
 */
export function parseItemId(id: string): string {
  const slashIndex = id.indexOf('/');
  if (slashIndex === -1) {
    return id;
  }
  return id.substring(slashIndex + 1);
}

/**
 * Parses a prefixed ID and returns both the project name (if present) and item ID.
 */
export function parsePrefixedId(
  id: string,
  workspaces: Array<{ projectName: string }>
): { projectName: string | null; itemId: string } {
  const slashIndex = id.indexOf('/');
  if (slashIndex === -1) {
    return { projectName: null, itemId: id };
  }

  const candidateProjectName = id.substring(0, slashIndex);
  const candidateItemId = id.substring(slashIndex + 1);

  const hasMatchingWorkspace = workspaces.some(
    w => w.projectName.toLowerCase() === candidateProjectName.toLowerCase()
  );

  if (!hasMatchingWorkspace) {
    return { projectName: null, itemId: id };
  }

  return {
    projectName: candidateProjectName,
    itemId: candidateItemId,
  };
}

export interface FrontmatterOptions {
  status?: string;
  skillLevel?: 'junior' | 'medior' | 'senior';
  parentType?: 'change' | 'review';
  parentId?: string;
  type?: string;
  blockedBy?: string[];
}

/**
 * Builds YAML frontmatter string for a task.
 */
export function buildTaskFrontmatter(options: FrontmatterOptions): string {
  const lines = ['---', `status: ${options.status ?? 'to-do'}`];

  if (options.skillLevel) {
    lines.push(`skill-level: ${options.skillLevel}`);
  }
  if (options.parentType) {
    lines.push(`parent-type: ${options.parentType}`);
  }
  if (options.parentId) {
    lines.push(`parent-id: ${options.parentId}`);
  }
  if (options.type) {
    lines.push(`type: ${options.type}`);
  }
  if (options.blockedBy && options.blockedBy.length > 0) {
    lines.push('blocked-by:');
    options.blockedBy.forEach(b => lines.push(`  - ${b}`));
  }

  lines.push('---');
  return lines.join('\n');
}
