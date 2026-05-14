---
status: done
---

# Task: Update AGENTS.md template with get commands documentation

## End Goal

The AGENTS.md template includes documentation for all new get commands so AI agents can discover and use them.

## Currently

- AGENTS.md template in `src/core/templates/agents-template.ts` does not document get subcommands
- AI agents cannot discover the new commands

## Should

- CLI Commands section includes all get subcommands
- Filter flags are documented with examples
- Documentation follows existing style

## Constraints

- [x] Integrate into existing CLI Commands section (not new section)
- [x] Ensure template escaping is correct for backticks
- [x] Documentation must be concise

## Acceptance Criteria

- [x] `splx get task`, `get change`, `get spec`, `get tasks` documented
- [x] Filter flags (`--constraints`, `--acceptance-criteria`) explained
- [x] Usage examples included
- [x] `splx init` creates AGENTS.md with new commands
- [x] `splx update` updates existing projects

## Implementation Checklist

- [x] 4.1 Add get task command with --id and filter flags to CLI Commands section
- [x] 4.2 Add get change command documentation
- [x] 4.3 Add get spec command documentation
- [x] 4.4 Add get tasks command documentation
- [x] 4.5 Add usage examples for common workflows
- [x] 4.6 Test with fresh `splx init` project
- [x] 4.7 Test with `splx update` on existing project

## Notes

Add after the existing `splx list` documentation in CLI Commands section.
