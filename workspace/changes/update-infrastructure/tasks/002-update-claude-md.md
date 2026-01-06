---
status: done
skill-level: junior
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

- [ ] 2.1 Update Project Setup command table
- [ ] 2.2 Update Navigation & Listing command table (replace list with get commands)
- [ ] 2.3 Update Task Management command table with new patterns
- [ ] 2.4 Update Item Retrieval command table
- [ ] 2.5 Update Display & Inspection command table (remove show, add get)
- [ ] 2.6 Update Validation command table with entity subcommands
- [ ] 2.7 Update Archival command table with entity subcommands
- [ ] 2.8 Update Global Flags table with --parent-id, --parent-type
- [ ] 2.9 Update Configuration and Shell Completions tables if needed

## Notes

CLAUDE.md is auto-generated from AGENTS.md managed content. Ensure consistency between both files.
