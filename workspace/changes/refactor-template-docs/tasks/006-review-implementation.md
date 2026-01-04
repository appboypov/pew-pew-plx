---
status: done
---

# Task: Review implementation

## End Goal

All changes verified complete, consistent, and following project conventions.

## Currently

Implementation tasks 001-005 completed.

## Should

All template docs follow consistent pattern:
- .md files are minimal configs (~30-60 lines)
- refine-* commands contain option documentation
- prepare-*/action commands read config and execute

## Constraints

- [ ] Follow project conventions from ARCHITECTURE.md
- [ ] Verify all tool configurators updated

## Acceptance Criteria

- [ ] RELEASE.md under 60 lines, config-style
- [ ] REVIEW.md under 50 lines, config-style
- [ ] TESTING.md under 50 lines, config-style
- [ ] refine-release, refine-review, refine-testing contain option documentation
- [ ] test command accepts --change-id, --task-id, --spec-id
- [ ] All tool configurator files regenerated

## Implementation Checklist

- [x] 6.1 Run `plx validate refactor-template-docs --strict`
- [x] 6.2 Verify line counts: RELEASE.md, REVIEW.md, TESTING.md
- [x] 6.3 Verify command bodies contain expected documentation
- [x] 6.4 Verify .claude/commands/plx/ contains all new commands
- [x] 6.5 Run `pnpm test` to ensure no regressions
- [x] 6.6 Run `pnpm build` to verify compilation

## Notes

Final review before marking change complete.
