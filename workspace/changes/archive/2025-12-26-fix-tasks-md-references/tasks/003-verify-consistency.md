# Task: Verify all changes are complete and consistent

## End Goal

All instruction files are verified to have:
1. No remaining `tasks.md` references (except migration utilities)
2. Minimum 3 files guideline documented
3. Task file template documented
4. Numbering convention documented

## Currently

Changes from tasks 001 and 002 have been applied but need verification.

## Should

Every aspect of the task directory documentation is complete and consistent across all files.

## Constraints

- Migration utilities retain backward compatibility references
- Template and generated file must match

## Acceptance Criteria

- [ ] Search confirms no unintended `tasks.md` references
- [ ] Minimum 3 files guideline is present
- [ ] Task file template section is present
- [ ] Template and AGENTS.md are in sync

## Implementation Checklist

- [x] 3.1 Run `rg "tasks\.md" workspace/AGENTS.md` - should find no matches
- [x] 3.2 Run `rg "tasks\.md" src/core/templates/agents-template.ts` - should find no matches
- [x] 3.3 Run `rg "tasks\.md" src/core/templates/slash-command-templates.ts` - verify only apply command has it
- [x] 3.4 Verify "minimum 3 files" or equivalent is present in AGENTS.md
- [x] 3.5 Verify task file template section exists with all required sections
- [x] 3.6 Run `plx update` and verify no diff in AGENTS.md

## Notes

- The apply command in slash-command-templates.ts may legitimately reference reading existing task files
