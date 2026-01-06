import { CommandDefinition, FlagDefinition } from './types.js';

/**
 * Common flags used across multiple commands
 */
const COMMON_FLAGS = {
  json: {
    name: 'json',
    description: 'Output as JSON',
  } as FlagDefinition,
  jsonValidation: {
    name: 'json',
    description: 'Output validation results as JSON',
  } as FlagDefinition,
  strict: {
    name: 'strict',
    description: 'Enable strict validation mode',
  } as FlagDefinition,
  noInteractive: {
    name: 'no-interactive',
    description: 'Disable interactive prompts',
  } as FlagDefinition,
  type: {
    name: 'type',
    description: 'Specify item type when ambiguous',
    takesValue: true,
    values: ['change', 'spec'],
  } as FlagDefinition,
} as const;

/**
 * Registry of all PLX CLI commands with their flags and metadata.
 * This registry is used to generate shell completion scripts.
 */
export const COMMAND_REGISTRY: CommandDefinition[] = [
  {
    name: 'init',
    description: 'Initialize Pew Pew Plx in your project',
    acceptsPositional: true,
    positionalType: 'path',
    flags: [
      {
        name: 'tools',
        description: 'Configure AI tools non-interactively (e.g., "all", "none", or comma-separated tool IDs)',
        takesValue: true,
      },
    ],
  },
  {
    name: 'update',
    description: 'Update Pew Pew Plx instruction files',
    acceptsPositional: true,
    positionalType: 'path',
    flags: [],
  },
  {
    name: 'list',
    description: 'List items (changes by default, or specs with --specs)',
    flags: [
      {
        name: 'specs',
        description: 'List specs instead of changes',
      },
      {
        name: 'changes',
        description: 'List changes explicitly (default)',
      },
    ],
  },
  {
    name: 'view',
    description: 'Display an interactive dashboard of specs and changes',
    flags: [],
  },
  {
    name: 'validate',
    description: 'Validate changes and specs',
    flags: [],
    subcommands: [
      {
        name: 'all',
        description: 'Validate all changes and specs',
        flags: [
          COMMON_FLAGS.strict,
          COMMON_FLAGS.jsonValidation,
          {
            name: 'concurrency',
            description: 'Max concurrent validations (defaults to env PLX_CONCURRENCY or 6)',
            takesValue: true,
          },
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: 'change',
        description: 'Validate a specific change',
        flags: [
          {
            name: 'id',
            description: 'Change ID to validate',
            takesValue: true,
            valueType: 'change-id',
          },
          COMMON_FLAGS.strict,
          COMMON_FLAGS.jsonValidation,
          {
            name: 'concurrency',
            description: 'Max concurrent validations (defaults to env PLX_CONCURRENCY or 6)',
            takesValue: true,
          },
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: 'changes',
        description: 'Validate all changes',
        flags: [
          COMMON_FLAGS.strict,
          COMMON_FLAGS.jsonValidation,
          {
            name: 'concurrency',
            description: 'Max concurrent validations (defaults to env PLX_CONCURRENCY or 6)',
            takesValue: true,
          },
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: 'spec',
        description: 'Validate a specific spec',
        flags: [
          {
            name: 'id',
            description: 'Spec ID to validate',
            takesValue: true,
            valueType: 'spec-id',
          },
          COMMON_FLAGS.strict,
          COMMON_FLAGS.jsonValidation,
          {
            name: 'concurrency',
            description: 'Max concurrent validations (defaults to env PLX_CONCURRENCY or 6)',
            takesValue: true,
          },
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: 'specs',
        description: 'Validate all specs',
        flags: [
          COMMON_FLAGS.strict,
          COMMON_FLAGS.jsonValidation,
          {
            name: 'concurrency',
            description: 'Max concurrent validations (defaults to env PLX_CONCURRENCY or 6)',
            takesValue: true,
          },
          COMMON_FLAGS.noInteractive,
        ],
      },
    ],
  },
  {
    name: 'show',
    description: 'Show a change or spec',
    acceptsPositional: true,
    positionalType: 'change-or-spec-id',
    flags: [
      COMMON_FLAGS.json,
      COMMON_FLAGS.type,
      COMMON_FLAGS.noInteractive,
      {
        name: 'deltas-only',
        description: 'Show only deltas (JSON only, change-specific)',
      },
      {
        name: 'requirements-only',
        description: 'Alias for --deltas-only (deprecated, change-specific)',
      },
      {
        name: 'requirements',
        description: 'Show only requirements, exclude scenarios (JSON only, spec-specific)',
      },
      {
        name: 'no-scenarios',
        description: 'Exclude scenario content (JSON only, spec-specific)',
      },
      {
        name: 'requirement',
        short: 'r',
        description: 'Show specific requirement by ID (JSON only, spec-specific)',
        takesValue: true,
      },
    ],
  },
  {
    name: 'archive',
    description: 'Archive completed changes and reviews',
    flags: [],
    subcommands: [
      {
        name: 'change',
        description: 'Archive a completed change and update main specs',
        flags: [
          {
            name: 'id',
            description: 'Change ID to archive',
            takesValue: true,
            valueType: 'change-id',
          },
          {
            name: 'yes',
            short: 'y',
            description: 'Skip confirmation prompts',
          },
          {
            name: 'skip-specs',
            description: 'Skip spec update operations',
          },
          {
            name: 'no-validate',
            description: 'Skip validation (not recommended)',
          },
        ],
      },
      {
        name: 'review',
        description: 'Archive a completed review and update main specs',
        flags: [
          {
            name: 'id',
            description: 'Review ID to archive',
            takesValue: true,
            valueType: 'review-id',
          },
          {
            name: 'yes',
            short: 'y',
            description: 'Skip confirmation prompts',
          },
          {
            name: 'skip-specs',
            description: 'Skip spec update operations',
          },
          {
            name: 'no-validate',
            description: 'Skip validation (not recommended)',
          },
        ],
      },
    ],
  },
  {
    name: 'change',
    description: 'Manage Pew Pew Plx change proposals (deprecated)',
    flags: [],
    subcommands: [
      {
        name: 'show',
        description: 'Show a change proposal',
        acceptsPositional: true,
        positionalType: 'change-id',
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'deltas-only',
            description: 'Show only deltas (JSON only)',
          },
          {
            name: 'requirements-only',
            description: 'Alias for --deltas-only (deprecated)',
          },
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: 'list',
        description: 'List all active changes (deprecated)',
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'long',
            description: 'Show id and title with counts',
          },
        ],
      },
      {
        name: 'validate',
        description: 'Validate a change proposal',
        acceptsPositional: true,
        positionalType: 'change-id',
        flags: [
          COMMON_FLAGS.strict,
          COMMON_FLAGS.jsonValidation,
          COMMON_FLAGS.noInteractive,
        ],
      },
    ],
  },
  {
    name: 'spec',
    description: 'Manage Pew Pew Plx specifications',
    flags: [],
    subcommands: [
      {
        name: 'show',
        description: 'Show a specification',
        acceptsPositional: true,
        positionalType: 'spec-id',
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'requirements',
            description: 'Show only requirements, exclude scenarios (JSON only)',
          },
          {
            name: 'no-scenarios',
            description: 'Exclude scenario content (JSON only)',
          },
          {
            name: 'requirement',
            short: 'r',
            description: 'Show specific requirement by ID (JSON only)',
            takesValue: true,
          },
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: 'list',
        description: 'List all specifications',
        flags: [
          COMMON_FLAGS.json,
          {
            name: 'long',
            description: 'Show id and title with counts',
          },
        ],
      },
      {
        name: 'validate',
        description: 'Validate a specification',
        acceptsPositional: true,
        positionalType: 'spec-id',
        flags: [
          COMMON_FLAGS.strict,
          COMMON_FLAGS.jsonValidation,
          COMMON_FLAGS.noInteractive,
        ],
      },
    ],
  },
  {
    name: 'completion',
    description: 'Manage shell completions for Pew Pew Plx CLI',
    flags: [],
    subcommands: [
      {
        name: 'generate',
        description: 'Generate completion script for a shell (outputs to stdout)',
        acceptsPositional: true,
        positionalType: 'shell',
        flags: [],
      },
      {
        name: 'install',
        description: 'Install completion script for a shell',
        acceptsPositional: true,
        positionalType: 'shell',
        flags: [
          {
            name: 'verbose',
            description: 'Show detailed installation output',
          },
        ],
      },
      {
        name: 'uninstall',
        description: 'Uninstall completion script for a shell',
        acceptsPositional: true,
        positionalType: 'shell',
        flags: [],
      },
    ],
  },
  {
    name: 'config',
    description: 'View and modify global Pew Pew Plx configuration',
    flags: [
      {
        name: 'scope',
        description: 'Config scope (only "global" supported currently)',
        takesValue: true,
        values: ['global'],
      },
    ],
    subcommands: [
      {
        name: 'path',
        description: 'Show config file location',
        flags: [],
      },
      {
        name: 'list',
        description: 'Show all current settings',
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'get',
        description: 'Get a specific value (raw, scriptable)',
        acceptsPositional: true,
        flags: [],
      },
      {
        name: 'set',
        description: 'Set a value (auto-coerce types)',
        acceptsPositional: true,
        flags: [
          {
            name: 'string',
            description: 'Force value to be stored as string',
          },
          {
            name: 'allow-unknown',
            description: 'Allow setting unknown keys',
          },
        ],
      },
      {
        name: 'unset',
        description: 'Remove a key (revert to default)',
        acceptsPositional: true,
        flags: [],
      },
      {
        name: 'reset',
        description: 'Reset configuration to defaults',
        flags: [
          {
            name: 'all',
            description: 'Reset all configuration (required)',
          },
          {
            name: 'yes',
            short: 'y',
            description: 'Skip confirmation prompts',
          },
        ],
      },
      {
        name: 'edit',
        description: 'Open config in $EDITOR',
        flags: [],
      },
    ],
  },
  {
    name: 'get',
    description: 'Retrieve project artifacts',
    flags: [],
    subcommands: [
      {
        name: 'task',
        description: 'Show the next task from the highest-priority change',
        flags: [
          {
            name: 'id',
            description: 'Retrieve a specific task by ID',
            takesValue: true,
          },
          {
            name: 'did-complete-previous',
            description: 'Complete the in-progress task and advance to next',
          },
          {
            name: 'constraints',
            description: 'Show only Constraints section',
          },
          {
            name: 'acceptance-criteria',
            description: 'Show only Acceptance Criteria section',
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'change',
        description: 'Retrieve a change proposal by ID',
        flags: [
          {
            name: 'id',
            description: 'Change ID to retrieve',
            takesValue: true,
            valueType: 'change-id',
          },
          COMMON_FLAGS.json,
          {
            name: 'deltas-only',
            description: 'Show only deltas (JSON only)',
          },
        ],
      },
      {
        name: 'spec',
        description: 'Retrieve a spec by ID',
        flags: [
          {
            name: 'id',
            description: 'Spec ID to retrieve',
            takesValue: true,
            valueType: 'spec-id',
          },
          COMMON_FLAGS.json,
          {
            name: 'requirements',
            description: 'Show only requirements, exclude scenarios (JSON only)',
          },
          {
            name: 'no-scenarios',
            description: 'Exclude scenario content (JSON only)',
          },
          {
            name: 'requirement',
            short: 'r',
            description: 'Show specific requirement by ID (JSON only)',
            takesValue: true,
          },
        ],
      },
      {
        name: 'tasks',
        description: 'List all open tasks or tasks for a specific parent',
        flags: [
          {
            name: 'parent-id',
            description: 'List tasks for a specific parent (change/review/spec)',
            takesValue: true,
          },
          {
            name: 'id',
            description: 'List tasks for a specific parent (deprecated, use --parent-id)',
            takesValue: true,
          },
          {
            name: 'parent-type',
            description: 'Filter by parent type',
            takesValue: true,
            values: ['change', 'review', 'spec'],
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'changes',
        description: 'List all active changes',
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'specs',
        description: 'List all specs',
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'reviews',
        description: 'List all active reviews',
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'review',
        description: 'Retrieve a review by ID',
        flags: [
          {
            name: 'id',
            description: 'Review ID to retrieve',
            takesValue: true,
            valueType: 'review-id',
          },
          COMMON_FLAGS.json,
        ],
      },
    ],
  },
  {
    name: 'review',
    description: 'Output review context for a change, spec, or task',
    flags: [
      COMMON_FLAGS.json,
      COMMON_FLAGS.noInteractive,
    ],
    subcommands: [
      {
        name: 'change',
        description: 'Review a change proposal',
        flags: [
          {
            name: 'id',
            description: 'Change ID to review',
            takesValue: true,
            valueType: 'change-id',
          },
          COMMON_FLAGS.json,
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: 'spec',
        description: 'Review a specification',
        flags: [
          {
            name: 'id',
            description: 'Spec ID to review',
            takesValue: true,
            valueType: 'spec-id',
          },
          COMMON_FLAGS.json,
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: 'task',
        description: 'Review a task',
        flags: [
          {
            name: 'id',
            description: 'Task ID to review',
            takesValue: true,
          },
          COMMON_FLAGS.json,
          COMMON_FLAGS.noInteractive,
        ],
      },
    ],
  },
  {
    name: 'complete',
    description: 'Mark tasks, changes, reviews, or specs as complete',
    flags: [],
    subcommands: [
      {
        name: 'task',
        description: 'Mark a task as complete',
        flags: [
          {
            name: 'id',
            description: 'Task ID to complete',
            takesValue: true,
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'change',
        description: 'Mark all tasks in a change as complete',
        flags: [
          {
            name: 'id',
            description: 'Change ID to complete',
            takesValue: true,
            valueType: 'change-id',
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'review',
        description: 'Mark all tasks in a review as complete',
        flags: [
          {
            name: 'id',
            description: 'Review ID to complete',
            takesValue: true,
            valueType: 'review-id',
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'spec',
        description: 'Mark all tasks in a spec as complete',
        flags: [
          {
            name: 'id',
            description: 'Spec ID to complete',
            takesValue: true,
            valueType: 'spec-id',
          },
          COMMON_FLAGS.json,
        ],
      },
    ],
  },
  {
    name: 'undo',
    description: 'Revert tasks, changes, reviews, or specs to to-do status',
    flags: [],
    subcommands: [
      {
        name: 'task',
        description: 'Revert a task to to-do status',
        flags: [
          {
            name: 'id',
            description: 'Task ID to undo',
            takesValue: true,
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'change',
        description: 'Revert all tasks in a change to to-do status',
        flags: [
          {
            name: 'id',
            description: 'Change ID to undo',
            takesValue: true,
            valueType: 'change-id',
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'review',
        description: 'Revert all tasks in a review to to-do status',
        flags: [
          {
            name: 'id',
            description: 'Review ID to undo',
            takesValue: true,
            valueType: 'review-id',
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'spec',
        description: 'Revert all tasks in a spec to to-do status',
        flags: [
          {
            name: 'id',
            description: 'Spec ID to undo',
            takesValue: true,
            valueType: 'spec-id',
          },
          COMMON_FLAGS.json,
        ],
      },
    ],
  },
  {
    name: 'parse',
    description: 'Parse project artifacts',
    flags: [],
    subcommands: [
      {
        name: 'feedback',
        description: 'Scan codebase for feedback markers and generate review tasks',
        acceptsPositional: true,
        flags: [
          {
            name: 'parent-id',
            description: 'Parent entity ID to link review to',
            takesValue: true,
          },
          {
            name: 'parent-type',
            description: 'Parent type',
            takesValue: true,
            values: ['change', 'spec', 'task'],
          },
          {
            name: 'change-id',
            description: 'Link review to a change (deprecated, use --parent-id --parent-type change)',
            takesValue: true,
            valueType: 'change-id',
          },
          {
            name: 'spec-id',
            description: 'Link review to a spec (deprecated, use --parent-id --parent-type spec)',
            takesValue: true,
            valueType: 'spec-id',
          },
          {
            name: 'task-id',
            description: 'Link review to a task (deprecated, use --parent-id --parent-type task)',
            takesValue: true,
          },
          COMMON_FLAGS.json,
          COMMON_FLAGS.noInteractive,
        ],
      },
    ],
  },
  {
    name: 'migrate',
    description: 'Migrate Pew Pew Plx project to newer versions',
    flags: [],
    subcommands: [
      {
        name: 'tasks',
        description: 'Migrate tasks to updated schema',
        flags: [
          {
            name: 'dry-run',
            description: 'Show changes without applying them',
          },
          COMMON_FLAGS.json,
        ],
      },
    ],
  },
  {
    name: 'paste',
    description: 'Paste content from clipboard',
    flags: [],
    subcommands: [
      {
        name: 'request',
        description: 'Paste clipboard content as a draft request',
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'task',
        description: 'Paste clipboard content as a new task',
        flags: [
          {
            name: 'parent-id',
            description: 'Link task to a parent (change or review)',
            takesValue: true,
            valueType: 'change-id',
          },
          {
            name: 'parent-type',
            description: 'Specify parent type: change or review',
            takesValue: true,
            values: ['change', 'review'],
          },
          {
            name: 'skill-level',
            description: 'Task skill level: junior, medior, or senior',
            takesValue: true,
            values: ['junior', 'medior', 'senior'],
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'change',
        description: 'Paste clipboard content as a new change proposal',
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'spec',
        description: 'Paste clipboard content as a new specification',
        flags: [
          COMMON_FLAGS.json,
        ],
      },
    ],
  },
  {
    name: 'create',
    description: 'Create new project artifacts',
    flags: [],
    subcommands: [
      {
        name: 'task',
        description: 'Create a new task',
        acceptsPositional: true,
        flags: [
          {
            name: 'parent-id',
            description: 'Link task to a parent (change or review)',
            takesValue: true,
          },
          {
            name: 'parent-type',
            description: 'Specify parent type',
            takesValue: true,
            values: ['change', 'review'],
          },
          {
            name: 'skill-level',
            description: 'Task skill level',
            takesValue: true,
            values: ['junior', 'medior', 'senior'],
          },
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'change',
        description: 'Create a new change proposal',
        acceptsPositional: true,
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'spec',
        description: 'Create a new specification',
        acceptsPositional: true,
        flags: [
          COMMON_FLAGS.json,
        ],
      },
      {
        name: 'request',
        description: 'Create a new request',
        acceptsPositional: true,
        flags: [
          COMMON_FLAGS.json,
        ],
      },
    ],
  },
];
