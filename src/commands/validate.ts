import ora from 'ora';
import path from 'path';
import { Validator } from '../core/validation/validator.js';
import { isInteractive, resolveNoInteractive } from '../utils/interactive.js';
import {
  getActiveChangeIdsMulti,
  getSpecIdsMulti,
  ChangeIdWithWorkspace,
  SpecIdWithWorkspace,
} from '../utils/item-discovery.js';
import { nearestMatches } from '../utils/match.js';
import { migrateIfNeeded } from '../utils/task-migration.js';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import {
  isMultiWorkspace,
  DiscoveredWorkspace,
} from '../utils/workspace-discovery.js';

type ItemType = 'change' | 'spec';

interface ExecuteOptions {
  all?: boolean;
  changes?: boolean;
  specs?: boolean;
  type?: string;
  strict?: boolean;
  json?: boolean;
  noInteractive?: boolean;
  interactive?: boolean; // Commander sets this to false when --no-interactive is used
  concurrency?: string;
}

interface BulkItemResult {
  id: string;
  type: ItemType;
  valid: boolean;
  issues: { level: 'ERROR' | 'WARNING' | 'INFO'; path: string; message: string }[];
  durationMs: number;
  workspacePath?: string;
  projectName?: string;
  displayId?: string;
}

export class ValidateCommand {
  async execute(itemName: string | undefined, options: ExecuteOptions = {}): Promise<void> {
    const interactive = isInteractive(options);

    // Handle bulk flags first
    if (options.all || options.changes || options.specs) {
      await this.runBulkValidation({
        changes: !!options.all || !!options.changes,
        specs: !!options.all || !!options.specs,
      }, { strict: !!options.strict, json: !!options.json, concurrency: options.concurrency, noInteractive: resolveNoInteractive(options) });
      return;
    }

    // No item and no flags
    if (!itemName) {
      if (interactive) {
        await this.runInteractiveSelector({ strict: !!options.strict, json: !!options.json, concurrency: options.concurrency });
        return;
      }
      this.printNonInteractiveHint();
      process.exitCode = 1;
      return;
    }

    // Direct item validation with type detection or override
    const typeOverride = this.normalizeType(options.type);
    await this.validateDirectItem(itemName, { typeOverride, strict: !!options.strict, json: !!options.json });
  }

  private normalizeType(value?: string): ItemType | undefined {
    if (!value) return undefined;
    const v = value.toLowerCase();
    if (v === 'change' || v === 'spec') return v;
    return undefined;
  }

  private async runInteractiveSelector(opts: { strict: boolean; json: boolean; concurrency?: string }): Promise<void> {
    const { select } = await import('@inquirer/prompts');
    const choice = await select({
      message: 'What would you like to validate?',
      choices: [
        { name: 'All (changes + specs)', value: 'all' },
        { name: 'All changes', value: 'changes' },
        { name: 'All specs', value: 'specs' },
        { name: 'Pick a specific change or spec', value: 'one' },
      ],
    });

    if (choice === 'all') return this.runBulkValidation({ changes: true, specs: true }, opts);
    if (choice === 'changes') return this.runBulkValidation({ changes: true, specs: false }, opts);
    if (choice === 'specs') return this.runBulkValidation({ changes: false, specs: true }, opts);

    // one
    const workspaces = await getFilteredWorkspaces();
    const isMulti = isMultiWorkspace(workspaces);
    const [changes, specs] = await Promise.all([
      getActiveChangeIdsMulti(workspaces),
      getSpecIdsMulti(workspaces),
    ]);
    const items: { name: string; value: { type: ItemType; id: string; workspacePath: string } }[] = [];
    items.push(...changes.map(c => ({
      name: `change/${isMulti ? c.displayId : c.id}`,
      value: { type: 'change' as const, id: c.id, workspacePath: c.workspacePath },
    })));
    items.push(...specs.map(s => ({
      name: `spec/${isMulti ? s.displayId : s.id}`,
      value: { type: 'spec' as const, id: s.id, workspacePath: s.workspacePath },
    })));
    if (items.length === 0) {
      console.error('No items found to validate.');
      process.exitCode = 1;
      return;
    }
    const picked = await select<{ type: ItemType; id: string; workspacePath: string }>({ message: 'Pick an item', choices: items });
    await this.validateByType(picked.type, picked.id, opts, picked.workspacePath);
  }

  private printNonInteractiveHint(): void {
    console.error('Nothing to validate. Try one of:');
    console.error('  plx validate --all');
    console.error('  plx validate --changes');
    console.error('  plx validate --specs');
    console.error('  plx validate <item-name>');
    console.error('Or run in an interactive terminal.');
  }

  private async validateDirectItem(itemName: string, opts: { typeOverride?: ItemType; strict: boolean; json: boolean }): Promise<void> {
    const workspaces = await getFilteredWorkspaces();
    const isMulti = isMultiWorkspace(workspaces);

    // Parse potential workspace prefix (e.g., "project-a/add-feature")
    const slashIndex = itemName.indexOf('/');
    let projectPrefix: string | null = null;
    let actualItemName = itemName;

    if (slashIndex !== -1) {
      const potentialPrefix = itemName.substring(0, slashIndex);
      // Check if it's a valid workspace prefix
      if (workspaces.some(w => w.projectName === potentialPrefix)) {
        projectPrefix = potentialPrefix;
        actualItemName = itemName.substring(slashIndex + 1);
      }
    }

    // Get all changes and specs from all workspaces
    const [changes, specs] = await Promise.all([
      getActiveChangeIdsMulti(workspaces),
      getSpecIdsMulti(workspaces),
    ]);

    // Find matching items
    const matchingChange = changes.find(c =>
      c.id === actualItemName &&
      (projectPrefix === null || c.projectName === projectPrefix)
    );
    const matchingSpec = specs.find(s =>
      s.id === actualItemName &&
      (projectPrefix === null || s.projectName === projectPrefix)
    );

    const isChange = !!matchingChange;
    const isSpec = !!matchingSpec;

    const type = opts.typeOverride ?? (isChange ? 'change' : isSpec ? 'spec' : undefined);

    if (!type) {
      console.error(`Unknown item '${itemName}'`);
      // Generate suggestions from all items
      const allIds = [
        ...changes.map(c => isMulti ? c.displayId : c.id),
        ...specs.map(s => isMulti ? s.displayId : s.id),
      ];
      const suggestions = nearestMatches(itemName, allIds);
      if (suggestions.length) console.error(`Did you mean: ${suggestions.join(', ')}?`);
      process.exitCode = 1;
      return;
    }

    if (!opts.typeOverride && isChange && isSpec) {
      const displayName = isMulti && projectPrefix ? `${projectPrefix}/${actualItemName}` : actualItemName;
      console.error(`Ambiguous item '${displayName}' matches both a change and a spec.`);
      console.error('Pass --type change|spec, or use: plx change validate / plx spec validate');
      process.exitCode = 1;
      return;
    }

    // Get the workspace path for the matched item
    const matchedItem = type === 'change' ? matchingChange : matchingSpec;
    const workspacePath = matchedItem?.workspacePath;
    const displayId = matchedItem?.displayId;

    await this.validateByType(type, actualItemName, opts, workspacePath, displayId);
  }

  private async validateByType(
    type: ItemType,
    id: string,
    opts: { strict: boolean; json: boolean },
    workspacePath?: string,
    displayId?: string
  ): Promise<void> {
    const validator = new Validator(opts.strict);

    // Use provided workspacePath or fall back to default
    const basePath = workspacePath
      ? workspacePath
      : path.join(process.cwd(), 'workspace');

    if (type === 'change') {
      const changeDir = path.join(basePath, 'changes', id);

      // Trigger migration if needed (silent in JSON mode)
      const migrationResult = await migrateIfNeeded(changeDir);
      if (migrationResult?.migrated && !opts.json) {
        console.log(`Migrated tasks.md → tasks/001-tasks.md`);
      }

      const start = Date.now();
      const report = await validator.validateChangeDeltaSpecs(changeDir);
      const durationMs = Date.now() - start;
      this.printReport('change', id, report, durationMs, opts.json, displayId);
      // Non-zero exit if invalid (keeps enriched output test semantics)
      process.exitCode = report.valid ? 0 : 1;
      return;
    }
    const file = path.join(basePath, 'specs', id, 'spec.md');
    const start = Date.now();
    const report = await validator.validateSpec(file);
    const durationMs = Date.now() - start;
    this.printReport('spec', id, report, durationMs, opts.json, displayId);
    process.exitCode = report.valid ? 0 : 1;
  }

  private printReport(type: ItemType, id: string, report: { valid: boolean; issues: any[] }, durationMs: number, json: boolean, displayId?: string): void {
    const outputId = displayId || id;
    if (json) {
      const out = { items: [{ id, type, valid: report.valid, issues: report.issues, durationMs, displayId }], summary: { totals: { items: 1, passed: report.valid ? 1 : 0, failed: report.valid ? 0 : 1 }, byType: { [type]: { items: 1, passed: report.valid ? 1 : 0, failed: report.valid ? 0 : 1 } } }, version: '1.0' };
      console.log(JSON.stringify(out, null, 2));
      return;
    }
    if (report.valid) {
      console.log(`${type === 'change' ? 'Change' : 'Specification'} '${outputId}' is valid`);
    } else {
      console.error(`${type === 'change' ? 'Change' : 'Specification'} '${outputId}' has issues`);
      for (const issue of report.issues) {
        const label = issue.level === 'ERROR' ? 'ERROR' : issue.level;
        const prefix = issue.level === 'ERROR' ? '✗' : issue.level === 'WARNING' ? '⚠' : 'ℹ';
        console.error(`${prefix} [${label}] ${issue.path}: ${issue.message}`);
      }
      this.printNextSteps(type);
    }
  }

  private printNextSteps(type: ItemType): void {
    const bullets: string[] = [];
    if (type === 'change') {
      bullets.push('- Ensure change has deltas in specs/: use headers ## ADDED/MODIFIED/REMOVED/RENAMED Requirements');
      bullets.push('- Each requirement MUST include at least one #### Scenario: block');
      bullets.push('- Debug parsed deltas: plx change show <id> --json --deltas-only');
    } else {
      bullets.push('- Ensure spec includes ## Purpose and ## Requirements sections');
      bullets.push('- Each requirement MUST include at least one #### Scenario: block');
      bullets.push('- Re-run with --json to see structured report');
    }
    console.error('Next steps:');
    bullets.forEach(b => console.error(`  ${b}`));
  }

  private async runBulkValidation(scope: { changes: boolean; specs: boolean }, opts: { strict: boolean; json: boolean; concurrency?: string; noInteractive?: boolean }): Promise<void> {
    const spinner = !opts.json && !opts.noInteractive ? ora('Validating...').start() : undefined;

    const workspaces = await getFilteredWorkspaces();
    const isMulti = isMultiWorkspace(workspaces);

    const [changeItems, specItems] = await Promise.all([
      scope.changes ? getActiveChangeIdsMulti(workspaces) : Promise.resolve<ChangeIdWithWorkspace[]>([]),
      scope.specs ? getSpecIdsMulti(workspaces) : Promise.resolve<SpecIdWithWorkspace[]>([]),
    ]);

    const DEFAULT_CONCURRENCY = 6;
    const concurrency = normalizeConcurrency(opts.concurrency) ?? normalizeConcurrency(process.env.PLX_CONCURRENCY) ?? DEFAULT_CONCURRENCY;
    const validator = new Validator(opts.strict);
    const queue: Array<() => Promise<BulkItemResult>> = [];

    for (const change of changeItems) {
      queue.push(async () => {
        const changeDir = path.join(change.workspacePath, 'changes', change.id);

        // Trigger migration if needed
        const migrationResult = await migrateIfNeeded(changeDir);
        if (migrationResult?.migrated) {
          console.log(`Migrated tasks.md → tasks/001-tasks.md`);
        }

        const start = Date.now();
        const report = await validator.validateChangeDeltaSpecs(changeDir);
        const durationMs = Date.now() - start;
        return {
          id: change.id,
          type: 'change' as const,
          valid: report.valid,
          issues: report.issues,
          durationMs,
          workspacePath: change.workspacePath,
          projectName: change.projectName,
          displayId: change.displayId,
        };
      });
    }
    for (const spec of specItems) {
      queue.push(async () => {
        const start = Date.now();
        const file = path.join(spec.workspacePath, 'specs', spec.id, 'spec.md');
        const report = await validator.validateSpec(file);
        const durationMs = Date.now() - start;
        return {
          id: spec.id,
          type: 'spec' as const,
          valid: report.valid,
          issues: report.issues,
          durationMs,
          workspacePath: spec.workspacePath,
          projectName: spec.projectName,
          displayId: spec.displayId,
        };
      });
    }

    if (queue.length === 0) {
      spinner?.stop();

      const summary = {
        totals: { items: 0, passed: 0, failed: 0 },
        byType: {
          ...(scope.changes ? { change: { items: 0, passed: 0, failed: 0 } } : {}),
          ...(scope.specs ? { spec: { items: 0, passed: 0, failed: 0 } } : {}),
        },
      } as const;

      if (opts.json) {
        const out = { items: [] as BulkItemResult[], summary, version: '1.0' };
        console.log(JSON.stringify(out, null, 2));
      } else {
        console.log('No items found to validate.');
      }

      process.exitCode = 0;
      return;
    }

    const results: BulkItemResult[] = [];
    let index = 0;
    let running = 0;
    let passed = 0;
    let failed = 0;

    await new Promise<void>((resolve) => {
      const next = () => {
        while (running < concurrency && index < queue.length) {
          const currentIndex = index++;
          const task = queue[currentIndex];
          running++;
          if (spinner) spinner.text = `Validating (${currentIndex + 1}/${queue.length})...`;
          task()
            .then(res => {
              results.push(res);
              if (res.valid) passed++; else failed++;
            })
            .catch((error: any) => {
              const message = error?.message || 'Unknown error';
              const plannedItem = getPlannedItem(currentIndex, changeItems, specItems);
              const res: BulkItemResult = {
                id: plannedItem?.id ?? 'unknown',
                type: plannedItem?.type ?? 'change',
                valid: false,
                issues: [{ level: 'ERROR', path: 'file', message }],
                durationMs: 0,
                workspacePath: plannedItem?.workspacePath,
                projectName: plannedItem?.projectName,
                displayId: plannedItem?.displayId,
              };
              results.push(res);
              failed++;
            })
            .finally(() => {
              running--;
              if (index >= queue.length && running === 0) resolve();
              else next();
            });
        }
      };
      next();
    });

    spinner?.stop();

    // Sort by displayId for consistent multi-workspace output, fall back to id
    results.sort((a, b) => {
      const aKey = a.displayId || a.id;
      const bKey = b.displayId || b.id;
      return aKey.localeCompare(bKey);
    });

    const summary = {
      totals: { items: results.length, passed, failed },
      byType: {
        ...(scope.changes ? { change: summarizeType(results, 'change') } : {}),
        ...(scope.specs ? { spec: summarizeType(results, 'spec') } : {}),
      },
    } as const;

    if (opts.json) {
      const out = { items: results, summary, version: '1.0' };
      console.log(JSON.stringify(out, null, 2));
    } else {
      for (const res of results) {
        const displayName = isMulti && res.displayId ? res.displayId : res.id;
        if (res.valid) console.log(`✓ ${res.type}/${displayName}`);
        else console.error(`✗ ${res.type}/${displayName}`);
      }
      console.log(`Totals: ${summary.totals.passed} passed, ${summary.totals.failed} failed (${summary.totals.items} items)`);
    }

    process.exitCode = failed > 0 ? 1 : 0;
  }
}

function summarizeType(results: BulkItemResult[], type: ItemType) {
  const filtered = results.filter(r => r.type === type);
  const items = filtered.length;
  const passed = filtered.filter(r => r.valid).length;
  const failed = items - passed;
  return { items, passed, failed };
}

function normalizeConcurrency(value?: string): number | undefined {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  if (Number.isNaN(n) || n <= 0) return undefined;
  return n;
}

interface PlannedItemInfo {
  id: string;
  type: ItemType;
  workspacePath?: string;
  projectName?: string;
  displayId?: string;
}

function getPlannedItem(
  index: number,
  changeItems: ChangeIdWithWorkspace[],
  specItems: SpecIdWithWorkspace[]
): PlannedItemInfo | undefined {
  const totalChanges = changeItems.length;
  if (index < totalChanges) {
    const item = changeItems[index];
    return {
      id: item.id,
      type: 'change',
      workspacePath: item.workspacePath,
      projectName: item.projectName,
      displayId: item.displayId,
    };
  }
  const specIndex = index - totalChanges;
  if (specIndex >= 0 && specIndex < specItems.length) {
    const item = specItems[specIndex];
    return {
      id: item.id,
      type: 'spec',
      workspacePath: item.workspacePath,
      projectName: item.projectName,
      displayId: item.displayId,
    };
  }
  return undefined;
}
