---
status: done
skill-level: medior
parent-type: change
parent-id: update-monorepo-command-behavior
---

# Task: Test slash commands in monorepo scenario

## End Goal

Slash commands behave correctly in both single-workspace and monorepo scenarios.

## Currently

Commands have been updated with monorepo awareness instructions but not tested.

## Should

Commands should be manually tested to verify:
- Single-workspace projects work as before
- Monorepo projects prompt for clarification when needed
- Artifacts are created in correct package workspaces
- prepare-release uses concrete versions and correct dates

## Constraints

- [ ] Manual testing only - no automated tests for slash commands
- [ ] Test in both single-workspace and monorepo contexts

## Acceptance Criteria

- [ ] prepare-release generates changelog with concrete version (not "Unreleased")
- [ ] prepare-release uses accurate date from `date` command
- [ ] plan-proposal in monorepo asks for/detects target package
- [ ] Artifacts created in package workspace, not root workspace
- [ ] Single-workspace behavior unchanged

## Implementation Checklist

- [x] 4.1 Test prepare-release in single-workspace project
- [x] 4.2 Verify changelog has concrete version and correct date
- [x] 4.3 Test plan-proposal in single-workspace project
- [x] 4.4 Test plan-proposal in monorepo - verify package detection
- [x] 4.5 Verify artifacts go to correct workspace folder
- [x] 4.6 Test prepare-release in monorepo with multiple packages

## Notes

Testing requires projects with PLX workspaces. Use pew-pew-plx itself for single-workspace testing. For monorepo testing, may need to create or use an existing monorepo project.
