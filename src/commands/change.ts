import { promises as fs } from 'fs';
import path from 'path';
import { JsonConverter } from '../core/converters/json-converter.js';
import { Validator } from '../core/validation/validator.js';
import { ChangeParser } from '../core/parsers/change-parser.js';
import { Change, TrackedIssue } from '../core/schemas/index.js';
import { isInteractive } from '../utils/interactive.js';
import { getActiveChangeIdsMulti, ChangeIdWithWorkspace } from '../utils/item-discovery.js';
import { migrateIfNeeded } from '../utils/task-migration.js';
import { getTaskStructureForChange } from '../utils/task-progress.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import { isMultiWorkspace, DiscoveredWorkspace } from '../utils/workspace-discovery.js';

interface ChangeListItem {
  id: string;
  title: string;
  deltaCount: number;
  taskStatus: { total: number; completed: number };
  trackedIssues?: TrackedIssue[];
  projectName?: string;
  displayId?: string;
}

export class ChangeCommand {
  private converter: JsonConverter;
  private workspaces: DiscoveredWorkspace[] = [];
  private isMulti: boolean = false;

  constructor() {
    this.converter = new JsonConverter();
  }

  private async ensureInitialized(): Promise<void> {
    if (this.workspaces.length > 0) return;
    this.workspaces = await getFilteredWorkspaces(process.cwd());
    this.isMulti = isMultiWorkspace(this.workspaces);
  }

  private parseWorkspacePrefixedId(input: string): { projectName: string | null; itemId: string } {
    if (input.includes('/')) {
      const slashIndex = input.indexOf('/');
      return {
        projectName: input.slice(0, slashIndex),
        itemId: input.slice(slashIndex + 1),
      };
    }
    return { projectName: null, itemId: input };
  }

  private findWorkspaceForItem(
    projectName: string | null,
    itemId: string,
    changeItems: ChangeIdWithWorkspace[]
  ): ChangeIdWithWorkspace | undefined {
    if (projectName) {
      return changeItems.find(
        (c) => c.projectName.toLowerCase() === projectName.toLowerCase() && c.id === itemId
      );
    }
    return changeItems.find((c) => c.id === itemId);
  }

  /**
   * Show a change proposal.
   * - Text mode: raw markdown passthrough (no filters)
   * - JSON mode: minimal object with deltas; --deltas-only returns same object with filtered deltas
   *   Note: --requirements-only is deprecated alias for --deltas-only
   */
  async show(changeName?: string, options?: { json?: boolean; requirementsOnly?: boolean; deltasOnly?: boolean; noInteractive?: boolean }): Promise<void> {
    await this.ensureInitialized();
    const changeItems = await getActiveChangeIdsMulti(this.workspaces);

    let resolvedChange: ChangeIdWithWorkspace | undefined;

    if (!changeName) {
      const canPrompt = isInteractive(options);
      if (canPrompt && changeItems.length > 0) {
        const { select } = await import('@inquirer/prompts');
        const selected = await select({
          message: 'Select a change to show',
          choices: changeItems.map((c) => ({ name: c.displayId, value: c })),
        });
        resolvedChange = selected;
        changeName = resolvedChange.id;
      } else {
        if (changeItems.length === 0) {
          console.error('No change specified. No active changes found.');
        } else {
          const displayIds = changeItems.map((c) => c.displayId);
          console.error(`No change specified. Available IDs: ${displayIds.join(', ')}`);
        }
        console.error('Hint: use "plx change list" to view available changes.');
        process.exitCode = 1;
        return;
      }
    } else {
      const { projectName, itemId } = this.parseWorkspacePrefixedId(changeName);
      resolvedChange = this.findWorkspaceForItem(projectName, itemId, changeItems);
      if (resolvedChange) {
        changeName = resolvedChange.id;
      }
    }

    if (!resolvedChange) {
      throw new Error(`Change "${changeName}" not found`);
    }

    const changesPath = path.join(resolvedChange.workspacePath, 'changes');
    const proposalPath = path.join(changesPath, changeName, 'proposal.md');

    try {
      await fs.access(proposalPath);
    } catch {
      throw new Error(`Change "${changeName}" not found at ${proposalPath}`);
    }

    // Trigger migration if needed
    const changeDir = path.join(changesPath, changeName);
    const migrationResult = await migrateIfNeeded(changeDir);
    if (migrationResult?.migrated) {
      console.log(`Migrated tasks.md → tasks/001-tasks.md`);
    }

    if (options?.json) {
      const jsonOutput = await this.converter.convertChangeToJson(proposalPath);

      if (options.requirementsOnly) {
        console.error('Flag --requirements-only is deprecated; use --deltas-only instead.');
      }

      const parsed: Change = JSON.parse(jsonOutput);
      const contentForTitle = await fs.readFile(proposalPath, 'utf-8');
      const title = this.extractTitle(contentForTitle, changeName);
      const id = parsed.name;
      const deltas = parsed.deltas || [];
      const trackedIssues = parsed.trackedIssues;

      const output: Record<string, unknown> = {
        id,
        title,
        deltaCount: deltas.length,
        deltas,
      };

      if (trackedIssues && trackedIssues.length > 0) {
        output.trackedIssues = trackedIssues;
      }

      if (this.isMulti && resolvedChange.projectName) {
        output.projectName = resolvedChange.projectName;
        output.displayId = resolvedChange.displayId;
      }

      console.log(JSON.stringify(output, null, 2));
    } else {
      const content = await fs.readFile(proposalPath, 'utf-8');
      console.log(content);
    }
  }

  /**
   * List active changes.
   * - Text default: IDs only; --long prints minimal details (title, counts)
   * - JSON: array of { id, title, deltaCount, taskStatus }, sorted by id
   */
  async list(options?: { json?: boolean; long?: boolean }): Promise<void> {
    await this.ensureInitialized();
    const changeItems = await getActiveChangeIdsMulti(this.workspaces);

    if (options?.json) {
      const changeDetails = await Promise.all(
        changeItems.map(async (changeItem) => {
          const changesPath = path.join(changeItem.workspacePath, 'changes');
          const proposalPath = path.join(changesPath, changeItem.id, 'proposal.md');
          const changeDir = path.join(changesPath, changeItem.id);

          try {
            // Trigger migration silently in JSON mode
            await migrateIfNeeded(changeDir);

            const content = await fs.readFile(proposalPath, 'utf-8');
            const parser = new ChangeParser(content, changeDir);
            const change = await parser.parseChangeWithDeltas(changeItem.id);

            // Use task structure to get aggregate progress
            const taskStructure = await getTaskStructureForChange(changesPath, changeItem.id);
            const taskStatus = taskStructure.aggregateProgress;

            const result: ChangeListItem = {
              id: changeItem.id,
              title: this.extractTitle(content, changeItem.id),
              deltaCount: change.deltas.length,
              taskStatus,
            };

            if (change.trackedIssues && change.trackedIssues.length > 0) {
              result.trackedIssues = change.trackedIssues;
            }

            if (this.isMulti && changeItem.projectName) {
              result.projectName = changeItem.projectName;
              result.displayId = changeItem.displayId;
            }

            return result;
          } catch {
            const result: ChangeListItem = {
              id: changeItem.id,
              title: 'Unknown',
              deltaCount: 0,
              taskStatus: { total: 0, completed: 0 },
            };
            if (this.isMulti && changeItem.projectName) {
              result.projectName = changeItem.projectName;
              result.displayId = changeItem.displayId;
            }
            return result;
          }
        })
      );

      const sorted = changeDetails.sort((a, b) => {
        if (!a.projectName && b.projectName) return -1;
        if (a.projectName && !b.projectName) return 1;
        const projCmp = (a.projectName || '').localeCompare(b.projectName || '');
        if (projCmp !== 0) return projCmp;
        return a.id.localeCompare(b.id);
      });
      console.log(JSON.stringify(sorted, null, 2));
    } else {
      if (changeItems.length === 0) {
        console.log('No items found');
        return;
      }

      if (!options?.long) {
        // IDs only
        for (const changeItem of changeItems) {
          const displayName = this.isMulti ? changeItem.displayId : changeItem.id;
          console.log(displayName);
        }
        return;
      }

      // Long format: id: title and minimal counts
      for (const changeItem of changeItems) {
        const changesPath = path.join(changeItem.workspacePath, 'changes');
        const proposalPath = path.join(changesPath, changeItem.id, 'proposal.md');
        const changeDir = path.join(changesPath, changeItem.id);
        try {
          // Trigger migration if needed
          const migrationResult = await migrateIfNeeded(changeDir);
          if (migrationResult?.migrated) {
            console.log(`Migrated tasks.md → tasks/001-tasks.md`);
          }

          const content = await fs.readFile(proposalPath, 'utf-8');
          const title = this.extractTitle(content, changeItem.id);

          // Use task structure to get aggregate progress
          const taskStructure = await getTaskStructureForChange(changesPath, changeItem.id);
          const { total, completed } = taskStructure.aggregateProgress;
          const taskStatusText = total > 0 ? ` [tasks ${completed}/${total}]` : '';

          const parser = new ChangeParser(await fs.readFile(proposalPath, 'utf-8'), changeDir);
          const change = await parser.parseChangeWithDeltas(changeItem.id);
          const deltaCountText = ` [deltas ${change.deltas.length}]`;
          const issueText = change.trackedIssues && change.trackedIssues.length > 0
            ? ` (${change.trackedIssues[0].id})`
            : '';
          const displayName = this.isMulti ? changeItem.displayId : changeItem.id;
          console.log(`${displayName}: ${title}${issueText}${deltaCountText}${taskStatusText}`);
        } catch {
          const displayName = this.isMulti ? changeItem.displayId : changeItem.id;
          console.log(`${displayName}: (unable to read)`);
        }
      }
    }
  }

  async validate(changeName?: string, options?: { strict?: boolean; json?: boolean; noInteractive?: boolean }): Promise<void> {
    await this.ensureInitialized();
    const changeItems = await getActiveChangeIdsMulti(this.workspaces);

    let resolvedChange: ChangeIdWithWorkspace | undefined;

    if (!changeName) {
      const canPrompt = isInteractive(options);
      if (canPrompt && changeItems.length > 0) {
        const { select } = await import('@inquirer/prompts');
        const selected = await select({
          message: 'Select a change to validate',
          choices: changeItems.map((c) => ({ name: c.displayId, value: c })),
        });
        resolvedChange = selected;
        changeName = resolvedChange.id;
      } else {
        if (changeItems.length === 0) {
          console.error('No change specified. No active changes found.');
        } else {
          const displayIds = changeItems.map((c) => c.displayId);
          console.error(`No change specified. Available IDs: ${displayIds.join(', ')}`);
        }
        console.error('Hint: use "plx change list" to view available changes.');
        process.exitCode = 1;
        return;
      }
    } else {
      const { projectName, itemId } = this.parseWorkspacePrefixedId(changeName);
      resolvedChange = this.findWorkspaceForItem(projectName, itemId, changeItems);
      if (resolvedChange) {
        changeName = resolvedChange.id;
      }
    }

    if (!resolvedChange) {
      throw new Error(`Change "${changeName}" not found`);
    }

    const changesPath = path.join(resolvedChange.workspacePath, 'changes');
    const changeDir = path.join(changesPath, changeName);

    try {
      await fs.access(changeDir);
    } catch {
      throw new Error(`Change "${changeName}" not found at ${changeDir}`);
    }

    // Trigger migration if needed
    const migrationResult = await migrateIfNeeded(changeDir);
    if (migrationResult?.migrated) {
      console.log(`Migrated tasks.md → tasks/001-tasks.md`);
    }

    const validator = new Validator(options?.strict || false);
    const report = await validator.validateChangeDeltaSpecs(changeDir);

    const displayName = this.isMulti ? resolvedChange.displayId : changeName;

    if (options?.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      if (report.valid) {
        console.log(`Change "${displayName}" is valid`);
      } else {
        console.error(`Change "${displayName}" has issues`);
        report.issues.forEach(issue => {
          const label = issue.level === 'ERROR' ? 'ERROR' : 'WARNING';
          const prefix = issue.level === 'ERROR' ? '✗' : '⚠';
          console.error(`${prefix} [${label}] ${issue.path}: ${issue.message}`);
        });
        // Next steps footer to guide fixing issues
        this.printNextSteps();
        if (!options?.json) {
          process.exitCode = 1;
        }
      }
    }
  }

  private extractTitle(content: string, changeName: string): string {
    const match = content.match(/^#\s+(?:Change:\s+)?(.+)$/im);
    return match ? match[1].trim() : changeName;
  }

  private printNextSteps(): void {
    const bullets: string[] = [];
    bullets.push('- Ensure change has deltas in specs/: use headers ## ADDED/MODIFIED/REMOVED/RENAMED Requirements');
    bullets.push('- Each requirement MUST include at least one #### Scenario: block');
    bullets.push('- Debug parsed deltas: plx change show <id> --json --deltas-only');
    console.error('Next steps:');
    bullets.forEach(b => console.error(`  ${b}`));
  }
}
