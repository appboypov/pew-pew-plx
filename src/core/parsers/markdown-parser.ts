import { Spec, Change, Requirement, Scenario, Delta, DeltaOperation, TrackedIssue } from '../schemas/index.js';

export interface Section {
  level: number;
  title: string;
  content: string;
  children: Section[];
}

export interface Frontmatter {
  trackedIssues?: TrackedIssue[];
  parentType?: string;
  parentId?: string;
  status?: string;
  archivedAt?: string;
  specUpdatesApplied?: boolean;
  raw?: Record<string, unknown>;
}

export interface FrontmatterResult {
  frontmatter: Frontmatter | null;
  content: string;
}

export class MarkdownParser {
  private lines: string[];
  private currentLine: number;
  private frontmatter: Frontmatter | null = null;

  constructor(content: string) {
    const normalized = MarkdownParser.normalizeContent(content);
    const { frontmatter, content: bodyContent } = MarkdownParser.extractFrontmatter(normalized);
    this.frontmatter = frontmatter;
    this.lines = bodyContent.split('\n');
    this.currentLine = 0;
  }

  protected static normalizeContent(content: string): string {
    return content.replace(/\r\n?/g, '\n');
  }

  static extractFrontmatter(content: string): FrontmatterResult {
    const lines = content.split('\n');

    if (lines.length === 0 || lines[0].trim() !== '---') {
      return { frontmatter: null, content };
    }

    let endIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        endIndex = i;
        break;
      }
    }

    if (endIndex === -1) {
      return { frontmatter: null, content };
    }

    const yamlLines = lines.slice(1, endIndex);
    const remainingContent = lines.slice(endIndex + 1).join('\n');

    const frontmatter = MarkdownParser.parseSimpleYaml(yamlLines);

    return { frontmatter, content: remainingContent };
  }

  static updateFrontmatter(content: string, updates: Record<string, unknown>): string {
    const lines = content.split('\n');

    // Check if frontmatter exists
    if (lines.length === 0 || lines[0].trim() !== '---') {
      // No frontmatter exists - create one
      const yamlLines = MarkdownParser.serializeUpdatesToYaml(updates);
      return `---\n${yamlLines}---\n${content}`;
    }

    // Find end of frontmatter
    let endIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        endIndex = i;
        break;
      }
    }

    if (endIndex === -1) {
      // Malformed frontmatter - create new one
      const yamlLines = MarkdownParser.serializeUpdatesToYaml(updates);
      return `---\n${yamlLines}---\n${content}`;
    }

    // Parse existing frontmatter and merge updates
    const existingYamlLines = lines.slice(1, endIndex);
    const remainingContent = lines.slice(endIndex + 1).join('\n');

    // Build merged frontmatter
    const mergedLines: string[] = [];
    const updatedKeys = new Set<string>();

    // Process existing lines and update values where needed
    for (const line of existingYamlLines) {
      const keyMatch = line.match(/^(\w[\w-]*)\s*:/);
      if (keyMatch) {
        const yamlKey = keyMatch[1];
        const jsKey = MarkdownParser.yamlKeyToJsKey(yamlKey);
        if (jsKey in updates) {
          // Replace with updated value
          const value = updates[jsKey];
          mergedLines.push(MarkdownParser.serializeKeyValue(yamlKey, value));
          updatedKeys.add(jsKey);
        } else {
          mergedLines.push(line);
        }
      } else {
        mergedLines.push(line);
      }
    }

    // Add new keys that weren't in original
    for (const [key, value] of Object.entries(updates)) {
      if (!updatedKeys.has(key)) {
        const yamlKey = MarkdownParser.jsKeyToYamlKey(key);
        mergedLines.push(MarkdownParser.serializeKeyValue(yamlKey, value));
      }
    }

    return `---\n${mergedLines.join('\n')}\n---${remainingContent}`;
  }

  private static yamlKeyToJsKey(yamlKey: string): string {
    return yamlKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }

  private static jsKeyToYamlKey(jsKey: string): string {
    return jsKey.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  private static serializeKeyValue(key: string, value: unknown): string {
    if (typeof value === 'boolean') {
      return `${key}: ${value}`;
    }
    if (typeof value === 'string') {
      return `${key}: ${value}`;
    }
    if (typeof value === 'number') {
      return `${key}: ${value}`;
    }
    return `${key}: ${String(value)}`;
  }

  private static serializeUpdatesToYaml(updates: Record<string, unknown>): string {
    const lines: string[] = [];
    for (const [key, value] of Object.entries(updates)) {
      const yamlKey = MarkdownParser.jsKeyToYamlKey(key);
      lines.push(MarkdownParser.serializeKeyValue(yamlKey, value));
    }
    return lines.join('\n') + '\n';
  }

  private static parseSimpleYaml(lines: string[]): Frontmatter {
    const result: Frontmatter = { raw: {} };
    const trackedIssues: TrackedIssue[] = [];

    let inTrackedIssues = false;
    let currentIssue: Partial<TrackedIssue> | null = null;

    for (const line of lines) {
      if (line.trim() === '' || line.trim().startsWith('#')) continue;

      const topLevelMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
      if (topLevelMatch && !line.startsWith(' ') && !line.startsWith('\t')) {
        const key = topLevelMatch[1];
        const value = topLevelMatch[2].trim().replace(/^["']|["']$/g, '');

        if (key === 'tracked-issues') {
          inTrackedIssues = true;
          continue;
        } else {
          inTrackedIssues = false;
          currentIssue = null;
        }

        if (key === 'parent-type' && value) {
          result.parentType = value;
        } else if (key === 'parent-id' && value) {
          result.parentId = value;
        }
      }

      if (inTrackedIssues) {
        if (line.match(/^\s+-\s+\w/)) {
          if (currentIssue && currentIssue.tracker && currentIssue.id && currentIssue.url) {
            trackedIssues.push(currentIssue as TrackedIssue);
          }
          currentIssue = {};
          const inlineMatch = line.match(/^\s+-\s+(\w+)\s*:\s*(.+)$/);
          if (inlineMatch) {
            const key = inlineMatch[1] as keyof TrackedIssue;
            currentIssue[key] = inlineMatch[2].trim().replace(/^["']|["']$/g, '');
          }
        } else if (currentIssue) {
          const propMatch = line.match(/^\s+(\w+)\s*:\s*(.+)$/);
          if (propMatch) {
            const key = propMatch[1] as keyof TrackedIssue;
            currentIssue[key] = propMatch[2].trim().replace(/^["']|["']$/g, '');
          }
        }
      }
    }

    if (currentIssue && currentIssue.tracker && currentIssue.id && currentIssue.url) {
      trackedIssues.push(currentIssue as TrackedIssue);
    }

    if (trackedIssues.length > 0) {
      result.trackedIssues = trackedIssues;
    }

    return result;
  }

  getFrontmatter(): Frontmatter | null {
    return this.frontmatter;
  }

  parseSpec(name: string): Spec {
    const sections = this.parseSections();
    const purpose = this.findSection(sections, 'Purpose')?.content || '';
    
    const requirementsSection = this.findSection(sections, 'Requirements');
    
    if (!purpose) {
      throw new Error('Spec must have a Purpose section');
    }
    
    if (!requirementsSection) {
      throw new Error('Spec must have a Requirements section');
    }

    const requirements = this.parseRequirements(requirementsSection);

    return {
      name,
      overview: purpose.trim(),
      requirements,
      metadata: {
        version: '1.0.0',
        format: 'plx',
      },
    };
  }

  parseChange(name: string): Change {
    const sections = this.parseSections();
    const why = this.findSection(sections, 'Why')?.content || '';
    const whatChanges = this.findSection(sections, 'What Changes')?.content || '';
    
    if (!why) {
      throw new Error('Change must have a Why section');
    }
    
    if (!whatChanges) {
      throw new Error('Change must have a What Changes section');
    }

    const deltas = this.parseDeltas(whatChanges);

    return {
      name,
      why: why.trim(),
      whatChanges: whatChanges.trim(),
      deltas,
      metadata: {
        version: '1.0.0',
        format: 'plx-change',
      },
    };
  }

  protected parseSections(): Section[] {
    const sections: Section[] = [];
    const stack: Section[] = [];
    
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      
      if (headerMatch) {
        const level = headerMatch[1].length;
        const title = headerMatch[2].trim();
        const content = this.getContentUntilNextHeader(i + 1, level);
        
        const section: Section = {
          level,
          title,
          content,
          children: [],
        };

        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        if (stack.length === 0) {
          sections.push(section);
        } else {
          stack[stack.length - 1].children.push(section);
        }
        
        stack.push(section);
      }
    }
    
    return sections;
  }

  protected getContentUntilNextHeader(startLine: number, currentLevel: number): string {
    const contentLines: string[] = [];
    
    for (let i = startLine; i < this.lines.length; i++) {
      const line = this.lines[i];
      const headerMatch = line.match(/^(#{1,6})\s+/);
      
      if (headerMatch && headerMatch[1].length <= currentLevel) {
        break;
      }
      
      contentLines.push(line);
    }
    
    return contentLines.join('\n').trim();
  }

  protected findSection(sections: Section[], title: string): Section | undefined {
    for (const section of sections) {
      if (section.title.toLowerCase() === title.toLowerCase()) {
        return section;
      }
      const child = this.findSection(section.children, title);
      if (child) {
        return child;
      }
    }
    return undefined;
  }

  protected parseRequirements(section: Section): Requirement[] {
    const requirements: Requirement[] = [];
    
    for (const child of section.children) {
      // Extract requirement text from first non-empty content line, fall back to heading
      let text = child.title;
      
      // Get content before any child sections (scenarios)
      if (child.content.trim()) {
        // Split content into lines and find content before any child headers
        const lines = child.content.split('\n');
        const contentBeforeChildren: string[] = [];
        
        for (const line of lines) {
          // Stop at child headers (scenarios start with ####)
          if (line.trim().startsWith('#')) {
            break;
          }
          contentBeforeChildren.push(line);
        }
        
        // Find first non-empty line
        const directContent = contentBeforeChildren.join('\n').trim();
        if (directContent) {
          const firstLine = directContent.split('\n').find(l => l.trim());
          if (firstLine) {
            text = firstLine.trim();
          }
        }
      }
      
      const scenarios = this.parseScenarios(child);
      
      requirements.push({
        text,
        scenarios,
      });
    }
    
    return requirements;
  }

  protected parseScenarios(requirementSection: Section): Scenario[] {
    const scenarios: Scenario[] = [];
    
    for (const scenarioSection of requirementSection.children) {
      // Store the raw text content of the scenario section
      if (scenarioSection.content.trim()) {
        scenarios.push({
          rawText: scenarioSection.content
        });
      }
    }
    
    return scenarios;
  }


  protected parseDeltas(content: string): Delta[] {
    const deltas: Delta[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Match both formats: **spec:** and **spec**:
      const deltaMatch = line.match(/^\s*-\s*\*\*([^*:]+)(?::\*\*|\*\*:)\s*(.+)$/);
      if (deltaMatch) {
        const specName = deltaMatch[1].trim();
        const description = deltaMatch[2].trim();
        
        let operation: DeltaOperation = 'MODIFIED';
        const lowerDesc = description.toLowerCase();
        
        // Use word boundaries to avoid false matches (e.g., "address" matching "add")
        // Check RENAMED first since it's more specific than patterns containing "new"
        if (/\brename(s|d|ing)?\b/.test(lowerDesc) || /\brenamed\s+(to|from)\b/.test(lowerDesc)) {
          operation = 'RENAMED';
        } else if (/\badd(s|ed|ing)?\b/.test(lowerDesc) || /\bcreate(s|d|ing)?\b/.test(lowerDesc) || /\bnew\b/.test(lowerDesc)) {
          operation = 'ADDED';
        } else if (/\bremove(s|d|ing)?\b/.test(lowerDesc) || /\bdelete(s|d|ing)?\b/.test(lowerDesc)) {
          operation = 'REMOVED';
        }
        
        deltas.push({
          spec: specName,
          operation,
          description,
        });
      }
    }
    
    return deltas;
  }
}