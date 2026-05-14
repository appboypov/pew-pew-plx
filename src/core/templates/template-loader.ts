import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Navigate from dist/core/templates/ to assets/templates/
const TEMPLATES_DIR = path.resolve(__dirname, '../../../assets/templates');

const templateCache = new Map<string, string>();

/**
 * Loads a template file from the assets/templates directory.
 * Results are cached for performance.
 *
 * @param relativePath - Path relative to assets/templates/ (e.g., 'workspace/agents.md')
 * @returns The template content as a string
 * @throws Error if the template file cannot be read
 */
export function loadTemplate(relativePath: string): string {
  if (!templateCache.has(relativePath)) {
    const fullPath = path.join(TEMPLATES_DIR, relativePath);
    try {
      templateCache.set(relativePath, readFileSync(fullPath, 'utf-8'));
    } catch (error) {
      throw new Error(
        `Template '${relativePath}' not found at ${fullPath}. The assets/templates/ directory may be missing from your installation.`
      );
    }
  }
  return templateCache.get(relativePath)!;
}

/**
 * Loads a template and replaces {{PLACEHOLDER}} patterns with provided values.
 *
 * @param relativePath - Path relative to assets/templates/
 * @param replacements - Object mapping placeholder names to replacement values
 * @returns The template content with placeholders replaced
 */
export function loadTemplateWithReplacements(
  relativePath: string,
  replacements: Record<string, string>
): string {
  let content = loadTemplate(relativePath);
  for (const [key, value] of Object.entries(replacements)) {
    // Use function form to prevent $& $' $` $n special replacement patterns
    content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), () => value);
  }
  return content;
}

/**
 * Clears the template cache. Useful for testing.
 */
export function clearTemplateCache(): void {
  templateCache.clear();
}
