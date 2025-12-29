---
tracked-issues:
  - tracker: linear
    id: PLX-15
    url: https://linear.app/de-app-specialist/issue/PLX-15/user-can-retrieve-specific-items-and-filter-task-content-with-cli
---

# Change: Add get subcommands for item retrieval and content filtering

## Why

Users need to retrieve specific tasks, changes, and specs by ID without going through prioritization. Additionally, users need to filter task content to show only constraints or acceptance criteria sections. AI agents need these commands documented to assist with task workflows.

## What Changes

- Add `get change --id <change-id>` subcommand to retrieve a specific change proposal
- Add `get spec --id <spec-id>` subcommand to retrieve a specific spec
- Add `get tasks` subcommand to list all open tasks or tasks for a specific change
- Add `--id <task-id>` flag to `get task` for retrieving specific tasks
- Add `--constraints` flag to filter task output to constraints section only
- Add `--acceptance-criteria` flag to filter task output to acceptance criteria section only
- Add `get` command to shell completion registry (currently missing)
- Update AGENTS.md template with new command documentation

## Impact

- Affected specs: cli-get-task
- Affected code:
  - `src/commands/get.ts` - new subcommands and flags
  - `src/services/content-filter.ts` - new service for section extraction
  - `src/services/item-retrieval.ts` - new service for ID-based retrieval
  - `src/utils/markdown-sections.ts` - new utility for section parsing
  - `src/core/completions/command-registry.ts` - add get command
  - `src/core/templates/agents-template.ts` - add command documentation
