---
status: done
skill-level: junior
parent-type: change
parent-id: simplify-command-names
---

# Task: Update frontmatter names in slash command configurators

## End Goal
All slash command frontmatter uses simple title case names derived from filenames, without the `Pew Pew Plx: ` prefix.

## Currently
Commands have names like `Pew Pew Plx: Refine Architecture` which is redundant since the category already groups them.

## Should
Commands have names like `Refine Architecture` - clean title case of the filename.

## Constraints
- [ ] Category must remain `Pew Pew Plx` (this groups commands in UI)
- [ ] Tags must still include `plx`
- [ ] Descriptions remain unchanged

## Acceptance Criteria
- [ ] All 18 commands use title case names without prefix
- [ ] Names match filename pattern: `get-task.md` → `Get Task`
- [ ] Build succeeds
- [ ] `plx update` regenerates command files with new names

## Implementation Checklist
- [x] 1.1 Update `src/core/configurators/slash/claude.ts` - change all 18 `name:` values
- [x] 1.2 Update `src/core/configurators/slash/codebuddy.ts` - change all `name:` values
- [x] 1.3 Update `src/core/configurators/slash/crush.ts` - change all `name:` values
- [x] 1.4 Update `src/core/configurators/slash/qoder.ts` - change all `name:` values
- [x] 1.5 Run `pnpm build` and verify success
- [x] 1.6 Run `plx update` to regenerate command files
- [x] 1.7 Verify `.claude/commands/plx/implement.md` has `name: Implement`

## Notes
Other configurators (cursor, gemini, etc.) use different naming patterns that don't need changes.
