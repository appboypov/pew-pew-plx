# Change: Add splx create command for entity creation

## Why

Provide a unified command for creating PLX entities (tasks, changes, specs, requests) with positional content arguments and frontmatter-controlling flags. This enables both standalone and parented entity creation with consistent patterns.

## What Changes

- **ADDED** `splx create` command with subcommands for each entity type
- **ADDED** `splx create task "Title"` - create standalone task
- **ADDED** `splx create task "Title" --parent-id <id>` - create parented task (requires `--parent-type` if ambiguous)
- **ADDED** `splx create change "Name"` - scaffold change proposal directory structure
- **ADDED** `splx create spec "Name"` - scaffold spec directory structure
- **ADDED** `splx create request "Description"` - create request file in change directory
- **ADDED** Entity templates for task, change, spec, and request scaffolding
- **ADDED** `CreateCommand` class in `src/commands/create.ts`

## Impact

- Affected specs: New `cli-create` spec
- Affected code:
  - `src/commands/create.ts` (new)
  - `src/cli/index.ts` (register command)
  - `src/core/templates/index.ts` (add entity templates)
  - `src/core/templates/task-template.ts` (new)
  - `src/core/templates/change-template.ts` (new)
  - `src/core/templates/spec-template.ts` (new)
  - `src/core/templates/request-template.ts` (new)
  - Tests for new command
