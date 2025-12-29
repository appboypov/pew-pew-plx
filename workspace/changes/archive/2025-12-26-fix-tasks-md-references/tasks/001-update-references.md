# Task: Update tasks.md references to tasks/ directory

## End Goal

All framework instruction files reference `tasks/` directory structure instead of `tasks.md`.

## Currently

9+ references to `tasks.md` remain in instruction files despite the migration being completed.

## Should

All instruction files consistently reference the `tasks/` directory structure.

## Constraints

- Migration utilities (`src/utils/task-migration.ts`) retain `tasks.md` references for backward compatibility
- Only update documentation/instruction files, not migration logic

## Acceptance Criteria

- [ ] No `tasks.md` references in AGENTS.md (except archive examples if any)
- [ ] No `tasks.md` references in agents-template.ts
- [ ] No `tasks.md` references in slash-command-templates.ts proposal steps

## Implementation Checklist

- [x] 1.1 Update `workspace/AGENTS.md` line 45: `tasks.md` → `tasks/` directory
- [x] 1.2 Update `workspace/AGENTS.md` lines 53, 55: Stage 2 workflow references
- [x] 1.3 Update `workspace/AGENTS.md` line 172: Directory structure diagram
- [x] 1.4 Update `workspace/AGENTS.md` lines 235-242: Task creation example
- [x] 1.5 Update `workspace/AGENTS.md` line 369: Happy path script
- [x] 1.6 Update `workspace/AGENTS.md` line 391: Multi-capability example
- [x] 1.7 Update `workspace/AGENTS.md` line 481: Quick reference
- [x] 1.8 Update `src/core/templates/agents-template.ts` (same changes)
- [x] 1.9 Update `src/core/templates/slash-command-templates.ts` lines 13, 17

## Notes

- The source template (`agents-template.ts`) generates `AGENTS.md` via `plx update`
- Both files must be updated to fix current and future projects
