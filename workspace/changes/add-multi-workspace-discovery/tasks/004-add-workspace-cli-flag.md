---
status: to-do
---

# Task: Add global --workspace CLI flag

## End Goal
The CLI program in `src/cli/index.ts` has a global `--workspace <name>` option that filters operations to a specific workspace.

## Currently
No global workspace filter exists. Commands operate on the single `{cwd}/workspace/` path.

## Should
Add to CLI program definition:
- Global `--workspace <name>` option
- Store filter value in accessible location (process.env or commander option context)
- Commands can access the filter to scope their operations

## Constraints
- [ ] Flag is optional - omitted means all workspaces
- [ ] Flag value is the projectName (directory name containing workspace/)
- [ ] Flag must be accessible to all subcommands

## Acceptance Criteria
- [ ] `plx list --workspace project-a` only shows project-a items
- [ ] `plx --workspace project-a list` works (global flag position)
- [ ] Commands without --workspace show all workspaces
- [ ] Invalid workspace name produces clear error

## Implementation Checklist
- [ ] 4.1 Add `.option('--workspace <name>', 'Filter to specific workspace')` to program
- [ ] 4.2 Add preAction hook to validate workspace if provided
- [ ] 4.3 Store workspace filter in accessible context (environment variable or opts)
- [ ] 4.4 Create helper function `getWorkspaceFilter()` for commands to use
- [ ] 4.5 Export helper from cli module or create shared location

## Notes
This provides the infrastructure for commands to filter. Individual commands will use this in subsequent tasks.
