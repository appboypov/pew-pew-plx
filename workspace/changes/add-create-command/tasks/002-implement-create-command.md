---
status: done
skill-level: medior
---

# Task: Implement CreateCommand class with subcommands

## End Goal

A `CreateCommand` class exists that handles `plx create {entity}` subcommands for task, change, spec, and request entities.

## Currently

No `plx create` command exists. Entity creation happens manually or via other commands.

## Should

- `src/commands/create.ts` exports `CreateCommand` class
- Command registered in `src/cli/index.ts`
- Subcommands: `task`, `change`, `spec`, `request`
- Each subcommand accepts positional content argument
- Task subcommand supports `--parent-id` and `--parent-type` flags
- All subcommands support `--json` flag

## Constraints

- [ ] Follow existing command patterns (`GetCommand`, `CompleteCommand`)
- [ ] Use Commander.js subcommand pattern
- [ ] Use TemplateManager for content generation
- [ ] Use existing utilities for slugification and file operations
- [ ] Handle errors gracefully with appropriate exit codes

## Acceptance Criteria

- [ ] `plx create task "Title"` creates standalone task file
- [ ] `plx create task "Title" --parent-id <id>` creates parented task
- [ ] `plx create task "Title" --parent-id <id> --parent-type change` creates task with explicit parent type
- [ ] `plx create change "Name"` scaffolds change directory with proposal.md, tasks/, specs/
- [ ] `plx create spec "Name"` scaffolds spec directory with spec.md
- [ ] `plx create request "Description"` creates change directory with request.md
- [ ] All subcommands display success message with created paths
- [ ] `--json` flag outputs machine-readable JSON

## Implementation Checklist

- [x] 2.1 Create `src/commands/create.ts` with `CreateCommand` class
- [x] 2.2 Implement `createTask` method with parent resolution logic
- [x] 2.3 Implement `createChange` method with directory scaffolding
- [x] 2.4 Implement `createSpec` method with directory scaffolding
- [x] 2.5 Implement `createRequest` method with change directory creation
- [x] 2.6 Add slugification utility (or reuse existing if available)
- [x] 2.7 Register command in `src/cli/index.ts`
- [x] 2.8 Add help text for command and all subcommands

## Notes

- Parent resolution must search changes, reviews, and specs for matching ID
- Duplicate detection should check for existing directories before creation
- Use ora spinners for progress feedback consistent with other commands
