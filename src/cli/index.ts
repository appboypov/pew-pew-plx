import { Command } from 'commander';
import { createRequire } from 'module';
import ora from 'ora';
import path from 'path';
import { promises as fs } from 'fs';
import { AI_TOOLS } from '../core/config.js';
import { UpdateCommand } from '../core/update.js';
import { UpgradeCommand } from '../core/upgrade.js';
import { ListCommand } from '../core/list.js';
import { ArchiveCommand } from '../core/archive.js';
import { ViewCommand } from '../core/view.js';
import { registerSpecCommand } from '../commands/spec.js';
import { ChangeCommand } from '../commands/change.js';
import { ValidateCommand } from '../commands/validate.js';
import { ShowCommand } from '../commands/show.js';
import { CompletionCommand } from '../commands/completion.js';
import { registerConfigCommand } from '../commands/config.js';
import { GetCommand } from '../commands/get.js';
import { CompleteCommand } from '../commands/complete.js';
import { UndoCommand } from '../commands/undo.js';
import { ParseFeedbackCommand } from '../commands/parse-feedback.js';
import { ReviewCommand } from '../commands/review.js';
import { PasteCommand } from '../commands/paste.js';
import { CreateCommand } from '../commands/create.js';
import { MigrateCommand } from '../commands/migrate.js';
import { emitDeprecationWarning } from '../utils/deprecation.js';

// Import command name detection utility
import { commandName } from '../utils/command-name.js';

const program = new Command();
const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

program
  .name(commandName)
  .description('AI-native system for spec-driven development')
  .version(version);

// Global options
program.option('--no-color', 'Disable color output');
program.option('--workspace <name>', 'Filter operations to a specific workspace');
program.option('--no-deprecation-warnings', 'Suppress deprecation warnings');

// Apply global flags before any command runs
program.hook('preAction', (thisCommand) => {
  const opts = thisCommand.opts();
  if (opts.color === false) {
    process.env.NO_COLOR = '1';
  }
  if (opts.workspace) {
    process.env.PLX_WORKSPACE_FILTER = opts.workspace;
  }
  if (opts.deprecationWarnings === false) {
    process.env.PLX_NO_DEPRECATION_WARNINGS = '1';
  }
});

const availableToolIds = AI_TOOLS.filter((tool) => tool.available).map((tool) => tool.value);
const toolsOptionDescription = `Configure AI tools non-interactively. Use "all", "none", or a comma-separated list of: ${availableToolIds.join(', ')}`;

program
  .command('init [path]')
  .description('Initialize Pew Pew Plx in your project')
  .option('--tools <tools>', toolsOptionDescription)
  .action(async (targetPath = '.', options?: { tools?: string }) => {
    try {
      // Validate that the path is a valid directory
      const resolvedPath = path.resolve(targetPath);
      
      try {
        const stats = await fs.stat(resolvedPath);
        if (!stats.isDirectory()) {
          throw new Error(`Path "${targetPath}" is not a directory`);
        }
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          // Directory doesn't exist, but we can create it
          console.log(`Directory "${targetPath}" doesn't exist, it will be created.`);
        } else if (error.message && error.message.includes('not a directory')) {
          throw error;
        } else {
          throw new Error(`Cannot access path "${targetPath}": ${error.message}`);
        }
      }
      
      const { InitCommand } = await import('../core/init.js');
      const initCommand = new InitCommand({
        tools: options?.tools,
      });
      await initCommand.execute(targetPath);
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('update [path]')
  .description('Update Pew Pew Plx instruction files')
  .action(async (targetPath = '.') => {
    try {
      const resolvedPath = path.resolve(targetPath);
      const updateCommand = new UpdateCommand();
      await updateCommand.execute(resolvedPath);
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('upgrade')
  .description('Upgrade the PLX CLI to the latest version')
  .option('--check', 'Only check for updates without installing')
  .action(async (options?: { check?: boolean }) => {
    try {
      const upgradeCommand = new UpgradeCommand();
      await upgradeCommand.execute(options);
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List items (changes by default). Use --specs or --reviews to list other types.')
  .option('--specs', 'List specs instead of changes')
  .option('--reviews', 'List reviews instead of changes')
  .option('--changes', 'List changes explicitly (default)')
  .action(async (options?: { specs?: boolean; reviews?: boolean; changes?: boolean }) => {
    try {
      const listCommand = new ListCommand();
      let mode: 'changes' | 'specs' | 'reviews' = 'changes';
      if (options?.specs) mode = 'specs';
      else if (options?.reviews) mode = 'reviews';
      await listCommand.execute('.', mode);
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('view')
  .description('Display an interactive dashboard of specs and changes')
  .action(async () => {
    try {
      const viewCommand = new ViewCommand();
      await viewCommand.execute('.');
    } catch (error) {
      console.log(); // Empty line for spacing
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Change command with subcommands
const changeCmd = program
  .command('change')
  .description('Manage Pew Pew Plx change proposals');

// Deprecation notice for noun-based commands
changeCmd.hook('preAction', () => {
  console.error('Warning: The "plx change ..." commands are deprecated. Prefer verb-first commands (e.g., "plx get changes", "plx validate changes").');
});

changeCmd
  .command('show [change-name]')
  .description('Show a change proposal in JSON or markdown format')
  .option('--json', 'Output as JSON')
  .option('--deltas-only', 'Show only deltas (JSON only)')
  .option('--requirements-only', 'Alias for --deltas-only (deprecated)')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (changeName?: string, options?: { json?: boolean; requirementsOnly?: boolean; deltasOnly?: boolean; noInteractive?: boolean }) => {
    try {
      emitDeprecationWarning('plx change show <id>', 'plx get change --id <id>');
      const changeCommand = new ChangeCommand();
      await changeCommand.show(changeName, options);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exitCode = 1;
    }
  });

changeCmd
  .command('list')
  .description('List all active changes (DEPRECATED: use "plx get changes" instead)')
  .option('--json', 'Output as JSON')
  .option('--long', 'Show id and title with counts')
  .action(async (options?: { json?: boolean; long?: boolean }) => {
    try {
      emitDeprecationWarning('plx change list', 'plx get changes');
      const changeCommand = new ChangeCommand();
      await changeCommand.list(options);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exitCode = 1;
    }
  });

changeCmd
  .command('validate [change-name]')
  .description('Validate a change proposal')
  .option('--strict', 'Enable strict validation mode')
  .option('--json', 'Output validation report as JSON')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (changeName?: string, options?: { strict?: boolean; json?: boolean; noInteractive?: boolean }) => {
    try {
      emitDeprecationWarning('plx change validate <id>', 'plx validate change --id <id>');
      const changeCommand = new ChangeCommand();
      await changeCommand.validate(changeName, options);
      if (typeof process.exitCode === 'number' && process.exitCode !== 0) {
        process.exit(process.exitCode);
      }
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exitCode = 1;
    }
  });

// Archive command with subcommands
const archiveCmd = program
  .command('archive [item-name]')
  .description('Archive a completed change or review and update main specs')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('--skip-specs', 'Skip spec update operations (useful for infrastructure, tooling, or doc-only changes)')
  .option('--no-validate', 'Skip validation (not recommended, requires confirmation)')
  .option('--type <type>', 'Specify item type when ambiguous: change|review (DEPRECATED)')
  .action(async (itemName?: string, options?: { yes?: boolean; skipSpecs?: boolean; noValidate?: boolean; validate?: boolean; type?: string }) => {
    try {
      if (itemName) {
        emitDeprecationWarning('plx archive <id>', 'plx archive change --id <id> or plx archive review --id <id>');
      }
      if (options?.type) {
        emitDeprecationWarning('plx archive --type <type>', 'plx archive change --id <id> or plx archive review --id <id>');
      }
      const archiveCommand = new ArchiveCommand();
      const entityType = options?.type as 'change' | 'review' | undefined;
      await archiveCommand.execute(itemName, { ...options, type: entityType });
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

archiveCmd
  .command('change')
  .description('Archive a completed change and update main specs')
  .requiredOption('--id <id>', 'Change ID to archive')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('--skip-specs', 'Skip spec update operations (useful for infrastructure, tooling, or doc-only changes)')
  .option('--no-validate', 'Skip validation (not recommended, requires confirmation)')
  .action(async (options: { id: string; yes?: boolean; skipSpecs?: boolean; noValidate?: boolean; validate?: boolean }) => {
    try {
      const archiveCommand = new ArchiveCommand();
      await archiveCommand.archiveChangeById(options.id, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

archiveCmd
  .command('review')
  .description('Archive a completed review and update main specs')
  .requiredOption('--id <id>', 'Review ID to archive')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('--skip-specs', 'Skip spec update operations (useful for infrastructure, tooling, or doc-only changes)')
  .option('--no-validate', 'Skip validation (not recommended, requires confirmation)')
  .action(async (options: { id: string; yes?: boolean; skipSpecs?: boolean; noValidate?: boolean; validate?: boolean }) => {
    try {
      const archiveCommand = new ArchiveCommand();
      await archiveCommand.archiveReviewById(options.id, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

registerSpecCommand(program);
registerConfigCommand(program);

// Top-level validate command with subcommands
const validateCmd = program
  .command('validate')
  .description('Validate changes and specs');

validateCmd
  .command('all')
  .description('Validate all changes and specs')
  .option('--strict', 'Enable strict validation mode')
  .option('--json', 'Output validation results as JSON')
  .option('--concurrency <n>', 'Max concurrent validations (defaults to env PLX_CONCURRENCY or 6)')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (options?: { strict?: boolean; json?: boolean; concurrency?: string; noInteractive?: boolean }) => {
    try {
      const validateCommand = new ValidateCommand();
      await validateCommand.execute(undefined, { ...options, all: true });
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

validateCmd
  .command('change')
  .description('Validate a specific change')
  .requiredOption('--id <id>', 'Change ID to validate')
  .option('--strict', 'Enable strict validation mode')
  .option('--json', 'Output validation results as JSON')
  .option('--concurrency <n>', 'Max concurrent validations (defaults to env PLX_CONCURRENCY or 6)')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (options: { id: string; strict?: boolean; json?: boolean; concurrency?: string; noInteractive?: boolean }) => {
    try {
      const validateCommand = new ValidateCommand();
      await validateCommand.validateChange(options.id, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

validateCmd
  .command('changes')
  .description('Validate all changes')
  .option('--strict', 'Enable strict validation mode')
  .option('--json', 'Output validation results as JSON')
  .option('--concurrency <n>', 'Max concurrent validations (defaults to env PLX_CONCURRENCY or 6)')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (options?: { strict?: boolean; json?: boolean; concurrency?: string; noInteractive?: boolean }) => {
    try {
      const validateCommand = new ValidateCommand();
      await validateCommand.validateChanges(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

validateCmd
  .command('spec')
  .description('Validate a specific spec')
  .requiredOption('--id <id>', 'Spec ID to validate')
  .option('--strict', 'Enable strict validation mode')
  .option('--json', 'Output validation results as JSON')
  .option('--concurrency <n>', 'Max concurrent validations (defaults to env PLX_CONCURRENCY or 6)')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (options: { id: string; strict?: boolean; json?: boolean; concurrency?: string; noInteractive?: boolean }) => {
    try {
      const validateCommand = new ValidateCommand();
      await validateCommand.validateSpec(options.id, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

validateCmd
  .command('specs')
  .description('Validate all specs')
  .option('--strict', 'Enable strict validation mode')
  .option('--json', 'Output validation results as JSON')
  .option('--concurrency <n>', 'Max concurrent validations (defaults to env PLX_CONCURRENCY or 6)')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (options?: { strict?: boolean; json?: boolean; concurrency?: string; noInteractive?: boolean }) => {
    try {
      const validateCommand = new ValidateCommand();
      await validateCommand.validateSpecs(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Top-level show command
program
  .command('show [item-name]')
  .description('Show a change or spec')
  .option('--json', 'Output as JSON')
  .option('--type <type>', 'Specify item type when ambiguous: change|spec')
  .option('--no-interactive', 'Disable interactive prompts')
  // change-only flags
  .option('--deltas-only', 'Show only deltas (JSON only, change)')
  .option('--requirements-only', 'Alias for --deltas-only (deprecated, change)')
  // spec-only flags
  .option('--requirements', 'JSON only: Show only requirements (exclude scenarios)')
  .option('--no-scenarios', 'JSON only: Exclude scenario content')
  .option('-r, --requirement <id>', 'JSON only: Show specific requirement by ID (1-based)')
  // allow unknown options to pass-through to underlying command implementation
  .allowUnknownOption(true)
  .action(async (itemName?: string, options?: { json?: boolean; type?: string; noInteractive?: boolean; [k: string]: any }) => {
    try {
      const showCommand = new ShowCommand();
      await showCommand.execute(itemName, options ?? {});
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Completion command with subcommands
const completionCmd = program
  .command('completion')
  .description('Manage shell completions for Pew Pew Plx CLI');

completionCmd
  .command('generate [shell]')
  .description('Generate completion script for a shell (outputs to stdout)')
  .action(async (shell?: string) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.generate({ shell });
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

completionCmd
  .command('install [shell]')
  .description('Install completion script for a shell')
  .option('--verbose', 'Show detailed installation output')
  .action(async (shell?: string, options?: { verbose?: boolean }) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.install({ shell, verbose: options?.verbose });
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

completionCmd
  .command('uninstall [shell]')
  .description('Uninstall completion script for a shell')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(async (shell?: string, options?: { yes?: boolean }) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.uninstall({ shell, yes: options?.yes });
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Hidden command for machine-readable completion data
program
  .command('__complete <type>', { hidden: true })
  .description('Output completion data in machine-readable format (internal use)')
  .action(async (type: string) => {
    try {
      const completionCommand = new CompletionCommand();
      await completionCommand.complete({ type });
    } catch (error) {
      // Silently fail for graceful shell completion experience
      process.exitCode = 1;
    }
  });

// Get command with subcommands
const getCmd = program
  .command('get')
  .description('Retrieve project artifacts');

getCmd
  .command('task')
  .description('Show the next task from the highest-priority change')
  .option('--id <id>', 'Retrieve a specific task by ID')
  .option('--did-complete-previous', 'Complete the in-progress task and advance to next')
  .option('--constraints', 'Show only Constraints section')
  .option('--acceptance-criteria', 'Show only Acceptance Criteria section')
  .option('--json', 'Output as JSON')
  .action(async (options?: { id?: string; didCompletePrevious?: boolean; constraints?: boolean; acceptanceCriteria?: boolean; json?: boolean }) => {
    try {
      const getCommand = new GetCommand();
      await getCommand.task(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

getCmd
  .command('change')
  .description('Retrieve a change proposal by ID')
  .requiredOption('--id <id>', 'Change ID to retrieve')
  .option('--json', 'Output as JSON')
  .option('--deltas-only', 'Show only deltas (JSON only)')
  .action(async (options: { id: string; json?: boolean; deltasOnly?: boolean }) => {
    try {
      const getCommand = new GetCommand();
      await getCommand.change(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

getCmd
  .command('spec')
  .description('Retrieve a spec by ID')
  .requiredOption('--id <id>', 'Spec ID to retrieve')
  .option('--json', 'Output as JSON')
  .option('--requirements', 'JSON only: Show only requirements (exclude scenarios)')
  .option('--no-scenarios', 'JSON only: Exclude scenario content')
  .option('-r, --requirement <id>', 'JSON only: Show specific requirement by ID (1-based)')
  .action(async (options: { id: string; json?: boolean; requirements?: boolean; scenarios?: boolean; requirement?: string }) => {
    try {
      const getCommand = new GetCommand();
      await getCommand.spec(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

getCmd
  .command('tasks')
  .description('List all open tasks or tasks for a specific parent')
  .option('--parent-id <id>', 'List tasks for a specific parent (change/review/spec)')
  .option('--id <id>', 'List tasks for a specific parent (deprecated, use --parent-id)')
  .option('--parent-type <type>', 'Filter by parent type: change, review, or spec')
  .option('--json', 'Output as JSON')
  .action(async (options?: { parentId?: string; id?: string; parentType?: string; json?: boolean }) => {
    try {
      const getCommand = new GetCommand();
      const parentId = options?.parentId || options?.id;
      const parentType = options?.parentType as 'change' | 'review' | 'spec' | undefined;
      await getCommand.tasks({ parentId, parentType, json: options?.json });
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

getCmd
  .command('changes')
  .description('List all active changes')
  .option('--json', 'Output as JSON')
  .action(async (options?: { json?: boolean }) => {
    try {
      const getCommand = new GetCommand();
      await getCommand.changes(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

getCmd
  .command('specs')
  .description('List all specs')
  .option('--json', 'Output as JSON')
  .action(async (options?: { json?: boolean }) => {
    try {
      const getCommand = new GetCommand();
      await getCommand.specs(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

getCmd
  .command('reviews')
  .description('List all active reviews')
  .option('--json', 'Output as JSON')
  .action(async (options?: { json?: boolean }) => {
    try {
      const getCommand = new GetCommand();
      await getCommand.reviews(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

getCmd
  .command('review')
  .description('Retrieve a review by ID')
  .requiredOption('--id <id>', 'Review ID to retrieve')
  .option('--json', 'Output as JSON')
  .action(async (options: { id: string; json?: boolean }) => {
    try {
      const getCommand = new GetCommand();
      await getCommand.review(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Complete command with subcommands
const completeCmd = program
  .command('complete')
  .description('Mark tasks or changes as complete');

completeCmd
  .command('task')
  .description('Mark a task as complete')
  .requiredOption('--id <id>', 'Task ID to complete')
  .option('--json', 'Output as JSON')
  .action(async (options: { id: string; json?: boolean }) => {
    try {
      const completeCommand = new CompleteCommand();
      await completeCommand.task(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

completeCmd
  .command('change')
  .description('Mark all tasks in a change as complete')
  .requiredOption('--id <id>', 'Change ID to complete')
  .option('--json', 'Output as JSON')
  .action(async (options: { id: string; json?: boolean }) => {
    try {
      const completeCommand = new CompleteCommand();
      await completeCommand.change(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

completeCmd
  .command('review')
  .description('Mark all tasks in a review as complete')
  .requiredOption('--id <id>', 'Review ID to complete')
  .option('--json', 'Output as JSON')
  .action(async (options: { id: string; json?: boolean }) => {
    try {
      const completeCommand = new CompleteCommand();
      await completeCommand.review(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

completeCmd
  .command('spec')
  .description('Mark all tasks in a spec as complete')
  .requiredOption('--id <id>', 'Spec ID to complete')
  .option('--json', 'Output as JSON')
  .action(async (options: { id: string; json?: boolean }) => {
    try {
      const completeCommand = new CompleteCommand();
      await completeCommand.spec(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Undo command with subcommands
const undoCmd = program
  .command('undo')
  .description('Revert tasks or changes to to-do status');

undoCmd
  .command('task')
  .description('Revert a task to to-do status')
  .requiredOption('--id <id>', 'Task ID to undo')
  .option('--json', 'Output as JSON')
  .action(async (options: { id: string; json?: boolean }) => {
    try {
      const undoCommand = new UndoCommand();
      await undoCommand.task(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

undoCmd
  .command('change')
  .description('Revert all tasks in a change to to-do status')
  .requiredOption('--id <id>', 'Change ID to undo')
  .option('--json', 'Output as JSON')
  .action(async (options: { id: string; json?: boolean }) => {
    try {
      const undoCommand = new UndoCommand();
      await undoCommand.change(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

undoCmd
  .command('review')
  .description('Revert all tasks in a review to to-do status')
  .requiredOption('--id <id>', 'Review ID to undo')
  .option('--json', 'Output as JSON')
  .action(async (options: { id: string; json?: boolean }) => {
    try {
      const undoCommand = new UndoCommand();
      await undoCommand.review(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

undoCmd
  .command('spec')
  .description('Revert all tasks in a spec to to-do status')
  .requiredOption('--id <id>', 'Spec ID to undo')
  .option('--json', 'Output as JSON')
  .action(async (options: { id: string; json?: boolean }) => {
    try {
      const undoCommand = new UndoCommand();
      await undoCommand.spec(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Parse command with subcommands
const parseCmd = program
  .command('parse')
  .description('Parse project artifacts');

parseCmd
  .command('feedback [review-name]')
  .description('Scan codebase for feedback markers and generate review tasks')
  .option('--parent-id <id>', 'Link review to a parent (change/spec/task)')
  .option('--parent-type <type>', 'Specify parent type: change, spec, or task (optional if ID is unambiguous)')
  .option('--change-id <id>', 'Link review to a change (DEPRECATED: use --parent-id)')
  .option('--spec-id <id>', 'Link review to a spec (DEPRECATED: use --parent-id)')
  .option('--task-id <id>', 'Link review to a task (DEPRECATED: use --parent-id)')
  .option('--exclude <patterns>', 'Additional exclude patterns (comma-separated)')
  .option('--no-default-excludes', 'Disable default feedback-specific excludes')
  .option('--json', 'Output as JSON')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (reviewName?: string, options?: { parentId?: string; parentType?: string; changeId?: string; specId?: string; taskId?: string; exclude?: string; defaultExcludes?: boolean; json?: boolean; noInteractive?: boolean; interactive?: boolean }) => {
    try {
      const command = new ParseFeedbackCommand();
      await command.execute(reviewName, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Review command with subcommands
const reviewCmd = program
  .command('review')
  .description('Output review context for a change, spec, or task')
  .option('--change-id <id>', 'Review a change (DEPRECATED: use "plx review change --id <id>")')
  .option('--spec-id <id>', 'Review a spec (DEPRECATED: use "plx review spec --id <id>")')
  .option('--task-id <id>', 'Review a task (DEPRECATED: use "plx review task --id <id>")')
  .option('--json', 'Output as JSON')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (options?: { changeId?: string; specId?: string; taskId?: string; json?: boolean; noInteractive?: boolean; interactive?: boolean }) => {
    try {
      // Emit deprecation warnings for legacy flags
      if (options?.changeId) {
        emitDeprecationWarning('plx review --change-id <id>', 'plx review change --id <id>');
      }
      if (options?.specId) {
        emitDeprecationWarning('plx review --spec-id <id>', 'plx review spec --id <id>');
      }
      if (options?.taskId) {
        emitDeprecationWarning('plx review --task-id <id>', 'plx review task --id <id>');
      }

      const command = new ReviewCommand();
      await command.execute(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

reviewCmd
  .command('change')
  .description('Review a change proposal')
  .requiredOption('--id <id>', 'Change ID to review')
  .option('--json', 'Output as JSON')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (options: { id: string; json?: boolean; noInteractive?: boolean; interactive?: boolean }) => {
    try {
      const command = new ReviewCommand();
      await command.reviewChange(options.id, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

reviewCmd
  .command('spec')
  .description('Review a specification')
  .requiredOption('--id <id>', 'Spec ID to review')
  .option('--json', 'Output as JSON')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (options: { id: string; json?: boolean; noInteractive?: boolean; interactive?: boolean }) => {
    try {
      const command = new ReviewCommand();
      await command.reviewSpec(options.id, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

reviewCmd
  .command('task')
  .description('Review a task')
  .requiredOption('--id <id>', 'Task ID to review')
  .option('--json', 'Output as JSON')
  .option('--no-interactive', 'Disable interactive prompts')
  .action(async (options: { id: string; json?: boolean; noInteractive?: boolean; interactive?: boolean }) => {
    try {
      const command = new ReviewCommand();
      await command.reviewTask(options.id, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Paste command with subcommands
const pasteCmd = program
  .command('paste')
  .description('Paste content from clipboard');

pasteCmd
  .command('request')
  .description('Paste clipboard content as a draft request')
  .option('--json', 'Output as JSON')
  .action(async (options?: { json?: boolean }) => {
    try {
      const pasteCommand = new PasteCommand();
      await pasteCommand.request(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

pasteCmd
  .command('task')
  .description('Paste clipboard content as a new task')
  .option('--parent-id <id>', 'Link task to a parent (change or review)')
  .option('--parent-type <type>', 'Specify parent type: change or review')
  .option('--skill-level <level>', 'Task skill level: junior, medior, or senior')
  .option('--json', 'Output as JSON')
  .action(async (options: { parentId?: string; parentType?: string; skillLevel?: string; json?: boolean }) => {
    try {
      const pasteCommand = new PasteCommand();
      await pasteCommand.task({
        parentId: options.parentId,
        parentType: options.parentType as 'change' | 'review' | 'spec' | undefined,
        skillLevel: options.skillLevel as 'junior' | 'medior' | 'senior' | undefined,
        json: options.json,
      });
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

pasteCmd
  .command('change')
  .description('Paste clipboard content as a new change proposal')
  .option('--json', 'Output as JSON')
  .action(async (options?: { json?: boolean }) => {
    try {
      const pasteCommand = new PasteCommand();
      await pasteCommand.change(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

pasteCmd
  .command('spec')
  .description('Paste clipboard content as a new specification')
  .option('--json', 'Output as JSON')
  .action(async (options?: { json?: boolean }) => {
    try {
      const pasteCommand = new PasteCommand();
      await pasteCommand.spec(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Create command with subcommands
const createCmd = program
  .command('create')
  .description('Create new project artifacts');

createCmd
  .command('task <title>')
  .description('Create a new task')
  .option('--parent-id <id>', 'Link task to a parent (change or review)')
  .option('--parent-type <type>', 'Specify parent type: change or review')
  .option('--skill-level <level>', 'Task skill level: junior, medior, or senior')
  .option('--json', 'Output as JSON')
  .action(async (title: string, options: { parentId?: string; parentType?: string; skillLevel?: string; json?: boolean }) => {
    try {
      const createCommand = new CreateCommand();
      await createCommand.createTask(title, {
        parentId: options.parentId,
        parentType: options.parentType as 'change' | 'review' | 'spec' | undefined,
        skillLevel: options.skillLevel as 'junior' | 'medior' | 'senior' | undefined,
        json: options.json,
      });
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

createCmd
  .command('change <name>')
  .description('Create a new change proposal')
  .option('--json', 'Output as JSON')
  .action(async (name: string, options: { json?: boolean }) => {
    try {
      const createCommand = new CreateCommand();
      await createCommand.createChange(name, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

createCmd
  .command('spec <name>')
  .description('Create a new specification')
  .option('--json', 'Output as JSON')
  .action(async (name: string, options: { json?: boolean }) => {
    try {
      const createCommand = new CreateCommand();
      await createCommand.createSpec(name, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

createCmd
  .command('request <description>')
  .description('Create a new request')
  .option('--json', 'Output as JSON')
  .action(async (description: string, options: { json?: boolean }) => {
    try {
      const createCommand = new CreateCommand();
      await createCommand.createRequest(description, options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Migrate command with subcommands
const migrateCmd = program
  .command('migrate')
  .description('Migration commands');

migrateCmd
  .command('tasks')
  .description('Migrate nested tasks to centralized storage')
  .option('--dry-run', 'Preview changes without executing')
  .option('--json', 'Output results as JSON')
  .action(async (options?: { dryRun?: boolean; json?: boolean }) => {
    try {
      const migrateCommand = new MigrateCommand();
      await migrateCommand.tasks(options);
    } catch (error) {
      console.log();
      ora().fail(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
