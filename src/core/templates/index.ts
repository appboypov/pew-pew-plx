import { agentsTemplate } from './agents-template.js';
import { projectTemplate, ProjectContext } from './project-template.js';
import { claudeTemplate } from './claude-template.js';
import { clineTemplate } from './cline-template.js';
import { costrictTemplate } from './costrict-template.js';
import { agentsRootStubTemplate } from './agents-root-stub.js';
import { getSlashCommandBody, SlashCommandId } from './slash-command-templates.js';
import { getPlxSlashCommandBody, PlxSlashCommandId } from './plx-slash-command-templates.js';
import { architectureTemplate, ArchitectureContext } from './architecture-template.js';

export interface Template {
  path: string;
  content: string | ((context: ProjectContext) => string);
}

export class TemplateManager {
  static getTemplates(context: ProjectContext = {}): Template[] {
    return [
      {
        path: 'AGENTS.md',
        content: agentsTemplate
      },
      {
        path: 'project.md',
        content: projectTemplate(context)
      }
    ];
  }

  static getClaudeTemplate(): string {
    return claudeTemplate;
  }

  static getClineTemplate(): string {
    return clineTemplate;
  }

  static getCostrictTemplate(): string {
    return costrictTemplate;
  }

  static getAgentsStandardTemplate(): string {
    return agentsRootStubTemplate;
  }

  static getSlashCommandBody(id: SlashCommandId): string {
    return getSlashCommandBody(id);
  }

  static getPlxSlashCommandBody(id: PlxSlashCommandId): string {
    return getPlxSlashCommandBody(id);
  }

  static getArchitectureTemplate(context?: ArchitectureContext): string {
    return architectureTemplate(context);
  }
}

export { ProjectContext } from './project-template.js';
export type { SlashCommandId } from './slash-command-templates.js';
export type { PlxSlashCommandId } from './plx-slash-command-templates.js';
export type { ArchitectureContext } from './architecture-template.js';
