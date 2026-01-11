---
status: done
skill-level: medior
parent-type: change
parent-id: update-monorepo-command-behavior
---

# Task: Add monorepo awareness to artifact-creating slash commands

## End Goal

All artifact-creating slash commands detect monorepo context, operate on the correct package workspace, and follow package-specific instructions.

## Currently

Slash commands assume single-workspace projects and always target the root workspace, even when working on package-specific changes in a monorepo.

## Should

Commands should:
- Derive target package from user's request context
- Clarify with user if target package is unclear
- Create artifacts in the relevant package's workspace folder
- Create separate proposals/releases per package when multiple affected
- Follow each package's AGENTS.md/instructions if present

## Constraints

- [ ] Changes are prompt-only - no TypeScript modifications
- [ ] Preserve existing command functionality for single-workspace projects
- [ ] Monorepo detection should be contextual, not require explicit flags

## Acceptance Criteria

- [ ] plan-proposal includes monorepo awareness instructions
- [ ] plan-request includes monorepo awareness instructions
- [ ] prepare-release includes monorepo awareness instructions
- [ ] review includes monorepo awareness instructions
- [ ] parse-feedback includes monorepo awareness instructions
- [ ] refine-architecture includes monorepo awareness instructions
- [ ] refine-release includes monorepo awareness instructions
- [ ] refine-review includes monorepo awareness instructions
- [ ] refine-testing includes monorepo awareness instructions
- [ ] Commands clarify target package when ambiguous

## Implementation Checklist

- [x] 2.1 Create a monorepo awareness snippet/guardrail block to reuse across commands
- [x] 2.2 Update `.claude/commands/plx/plan-proposal.md` with monorepo awareness
- [x] 2.3 Update `.claude/commands/plx/plan-request.md` with monorepo awareness
- [x] 2.4 Update `.claude/commands/plx/prepare-release.md` with monorepo awareness
- [x] 2.5 Update `.claude/commands/plx/review.md` with monorepo awareness
- [x] 2.6 Update `.claude/commands/plx/parse-feedback.md` with monorepo awareness
- [x] 2.7 Update `.claude/commands/plx/refine-architecture.md` with monorepo awareness
- [x] 2.8 Update `.claude/commands/plx/refine-release.md` with monorepo awareness
- [x] 2.9 Update `.claude/commands/plx/refine-review.md` with monorepo awareness
- [x] 2.10 Update `.claude/commands/plx/refine-testing.md` with monorepo awareness
- [x] 2.11 Verify all commands read correctly

## Notes

The monorepo awareness block should be consistent across all commands. Consider creating a reusable snippet pattern that can be included in each command.
