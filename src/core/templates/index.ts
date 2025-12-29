import { agentsTemplate } from './agents-template.js';
import { claudeTemplate } from './claude-template.js';
import { clineTemplate } from './cline-template.js';
import { costrictTemplate } from './costrict-template.js';
import { agentsRootStubTemplate } from './agents-root-stub.js';
import { getSlashCommandBody, SlashCommandId } from './slash-command-templates.js';
import { getPlxSlashCommandBody, PlxSlashCommandId } from './plx-slash-command-templates.js';
import { architectureTemplate, ArchitectureContext } from './architecture-template.js';
import { reviewTemplate } from './review-template.js';
import { releaseTemplate } from './release-template.js';

export interface Template {
  path: string;
  content: string;
}

export class TemplateManager {
  static getTemplates(): Template[] {
    return [
      {
        path: 'AGENTS.md',
        content: agentsTemplate
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

  static getReviewTemplate(): string {
    return reviewTemplate();
  }

  static getReleaseTemplate(): string {
    return releaseTemplate();
  }
}

export type { SlashCommandId } from './slash-command-templates.js';
export type { PlxSlashCommandId } from './plx-slash-command-templates.js';
export type { ArchitectureContext } from './architecture-template.js';
