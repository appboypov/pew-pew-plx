---
status: done
skill-level: junior
parent-type: change
parent-id: update-infrastructure
---
# Task: Update CLAUDE.md Command Tables

## End Goal

The root `CLAUDE.md` file contains accurate command tables reflecting the new standardized CLI patterns.

## Currently

CLAUDE.md contains:
- Command tables with `plx list`, `plx list --specs`
- References to `plx show`
- Entity-specific flags pattern

## Should

CLAUDE.md contains:
- Command tables with `plx get changes`, `plx get specs`, `plx get reviews`
- No references to deprecated commands
- Updated flag documentation for `--id`, `--parent-id`, `--parent-type`
- Updated examples using new command patterns

## Constraints

- [ ] Only update content within PLX markers
- [ ] Keep content outside markers unchanged
- [ ] Mirror the command table updates from AGENTS.md
- [ ] Do not change project-specific fork configuration sections

## Acceptance Criteria

- [ ] All command tables use new CLI patterns
- [ ] No deprecated commands appear in tables
- [ ] Command examples are consistent with AGENTS.md
- [ ] PLX marker structure preserved

## Implementation Checklist

- [x] 2.1 Update Project Setup command table
- [x] 2.2 Update Navigation & Listing command table (replace list with get commands)
- [x] 2.3 Update Task Management command table with new patterns
- [x] 2.4 Update Item Retrieval command table
- [x] 2.5 Update Display & Inspection command table (remove show, add get)
- [x] 2.6 Update Validation command table with entity subcommands
- [x] 2.7 Update Archival command table with entity subcommands
- [x] 2.8 Update Global Flags table with --parent-id, --parent-type
- [x] 2.9 Update Configuration and Shell Completions tables if needed

## Notes

CLAUDE.md is auto-generated from AGENTS.md managed content. Ensure consistency between both files.
