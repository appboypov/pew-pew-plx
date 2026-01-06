---
status: done
parent-type: change
parent-id: add-plan-request-command
---
# Task: Rename proposal to plan-proposal

## End Goal
The `plx/proposal` command is renamed to `plx/plan-proposal` across all files, including the command file, templates, configurators, and tests.

## Currently
- Command exists as `.claude/commands/plx/proposal.md`
- `SlashCommandId` type includes `'proposal'`
- All configurators reference `proposal` in FILE_PATHS and FRONTMATTER

## Should
- Command exists as `.claude/commands/plx/plan-proposal.md`
- `SlashCommandId` type includes `'plan-proposal'`
- All configurators reference `plan-proposal` consistently
- Tests pass with updated references

## Constraints
- [ ] Maintain all existing proposal functionality
- [ ] Update all 14+ configurator files consistently
- [ ] Update template files
- [ ] Update test files

## Acceptance Criteria
- [ ] `.claude/commands/plx/plan-proposal.md` exists with updated frontmatter
- [ ] `SlashCommandId` type is updated in `slash-command-templates.ts`
- [ ] `slashCommandBodies` record key is updated
- [ ] All configurators updated (claude, cursor, windsurf, etc.)
- [ ] `agents-template.ts` references updated
- [ ] All tests pass

## Implementation Checklist
- [x] 2.1 Rename `.claude/commands/plx/proposal.md` to `plan-proposal.md`
- [x] 2.2 Update frontmatter name to "Pew Pew Plx: Plan Proposal"
- [x] 2.3 Update `SlashCommandId` type in `src/core/templates/slash-command-templates.ts`
- [x] 2.4 Update `slashCommandBodies` record key from `proposal` to `plan-proposal`
- [x] 2.5 Update `src/core/configurators/slash/claude.ts` FILE_PATHS and FRONTMATTER
- [x] 2.6 Update `src/core/configurators/slash/cursor.ts`
- [x] 2.7 Update `src/core/configurators/slash/windsurf.ts`
- [x] 2.8 Update `src/core/configurators/slash/kilocode.ts`
- [x] 2.9 Update `src/core/configurators/slash/cline.ts`
- [x] 2.10 Update `src/core/configurators/slash/auggie.ts`
- [x] 2.11 Update `src/core/configurators/slash/codex.ts`
- [x] 2.12 Update `src/core/configurators/slash/gemini.ts`
- [x] 2.13 Update `src/core/configurators/slash/qoder.ts`
- [x] 2.14 Update `src/core/configurators/slash/crush.ts`
- [x] 2.15 Update `src/core/configurators/slash/codebuddy.ts`
- [x] 2.16 Update `src/core/configurators/slash/factory.ts`
- [x] 2.17 Update remaining configurators (search for `proposal` in slash/ directory)
- [x] 2.18 Update `src/core/templates/agents-template.ts` references
- [x] 2.19 Run `npm run build` to verify compilation

## Notes
- Use `rg proposal src/core/configurators/slash` to find all configurator references
- The rename affects file paths like `plx-proposal.md` in tool-specific formats
