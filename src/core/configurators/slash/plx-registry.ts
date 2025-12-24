import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxClaudeSlashCommandConfigurator } from './plx-claude.js';
import { PlxCodeBuddySlashCommandConfigurator } from './plx-codebuddy.js';
import { PlxQoderSlashCommandConfigurator } from './plx-qoder.js';
import { PlxCursorSlashCommandConfigurator } from './plx-cursor.js';
import { PlxWindsurfSlashCommandConfigurator } from './plx-windsurf.js';
import { PlxKiloCodeSlashCommandConfigurator } from './plx-kilocode.js';
import { PlxOpenCodeSlashCommandConfigurator } from './plx-opencode.js';
import { PlxCodexSlashCommandConfigurator } from './plx-codex.js';
import { PlxGitHubCopilotSlashCommandConfigurator } from './plx-github-copilot.js';
import { PlxAmazonQSlashCommandConfigurator } from './plx-amazon-q.js';
import { PlxFactorySlashCommandConfigurator } from './plx-factory.js';
import { PlxGeminiSlashCommandConfigurator } from './plx-gemini.js';
import { PlxAuggieSlashCommandConfigurator } from './plx-auggie.js';
import { PlxClineSlashCommandConfigurator } from './plx-cline.js';
import { PlxCrushSlashCommandConfigurator } from './plx-crush.js';
import { PlxCostrictSlashCommandConfigurator } from './plx-costrict.js';
import { PlxQwenSlashCommandConfigurator } from './plx-qwen.js';
import { PlxRooCodeSlashCommandConfigurator } from './plx-roocode.js';
import { PlxAntigravitySlashCommandConfigurator } from './plx-antigravity.js';
import { PlxIflowSlashCommandConfigurator } from './plx-iflow.js';

export class PlxSlashCommandRegistry {
  private static configurators: Map<string, PlxSlashCommandConfigurator> = new Map();

  static {
    const claude = new PlxClaudeSlashCommandConfigurator();
    const codeBuddy = new PlxCodeBuddySlashCommandConfigurator();
    const qoder = new PlxQoderSlashCommandConfigurator();
    const cursor = new PlxCursorSlashCommandConfigurator();
    const windsurf = new PlxWindsurfSlashCommandConfigurator();
    const kilocode = new PlxKiloCodeSlashCommandConfigurator();
    const opencode = new PlxOpenCodeSlashCommandConfigurator();
    const codex = new PlxCodexSlashCommandConfigurator();
    const githubCopilot = new PlxGitHubCopilotSlashCommandConfigurator();
    const amazonQ = new PlxAmazonQSlashCommandConfigurator();
    const factory = new PlxFactorySlashCommandConfigurator();
    const gemini = new PlxGeminiSlashCommandConfigurator();
    const auggie = new PlxAuggieSlashCommandConfigurator();
    const cline = new PlxClineSlashCommandConfigurator();
    const crush = new PlxCrushSlashCommandConfigurator();
    const costrict = new PlxCostrictSlashCommandConfigurator();
    const qwen = new PlxQwenSlashCommandConfigurator();
    const roocode = new PlxRooCodeSlashCommandConfigurator();
    const antigravity = new PlxAntigravitySlashCommandConfigurator();
    const iflow = new PlxIflowSlashCommandConfigurator();

    this.configurators.set(claude.toolId, claude);
    this.configurators.set(codeBuddy.toolId, codeBuddy);
    this.configurators.set(qoder.toolId, qoder);
    this.configurators.set(cursor.toolId, cursor);
    this.configurators.set(windsurf.toolId, windsurf);
    this.configurators.set(kilocode.toolId, kilocode);
    this.configurators.set(opencode.toolId, opencode);
    this.configurators.set(codex.toolId, codex);
    this.configurators.set(githubCopilot.toolId, githubCopilot);
    this.configurators.set(amazonQ.toolId, amazonQ);
    this.configurators.set(factory.toolId, factory);
    this.configurators.set(gemini.toolId, gemini);
    this.configurators.set(auggie.toolId, auggie);
    this.configurators.set(cline.toolId, cline);
    this.configurators.set(crush.toolId, crush);
    this.configurators.set(costrict.toolId, costrict);
    this.configurators.set(qwen.toolId, qwen);
    this.configurators.set(roocode.toolId, roocode);
    this.configurators.set(antigravity.toolId, antigravity);
    this.configurators.set(iflow.toolId, iflow);
  }

  static get(toolId: string): PlxSlashCommandConfigurator | undefined {
    return this.configurators.get(toolId);
  }

  static getAll(): PlxSlashCommandConfigurator[] {
    return Array.from(this.configurators.values());
  }
}
