---
status: done
skill-level: medior
---

# Task: Verify All Changes are Complete and Consistent

## End Goal

All infrastructure updates are verified complete, consistent, and working together.

## Currently

Infrastructure updates may have:
- Inconsistencies between different documentation files
- Command patterns that don't match between code and docs
- Missing updates in some files
- Broken cross-references

## Should

Verification confirms:
- AGENTS.md, CLAUDE.md, ARCHITECTURE.md are consistent
- All slash commands use same patterns
- All configurators generate consistent output
- All templates match documentation
- All tests pass
- All help text matches behavior
- Shell completions work correctly

## Constraints

- [ ] Do not make implementation changes
- [ ] Only verify and report issues
- [ ] Create follow-up tasks for any issues found
- [ ] Focus on consistency, not new features

## Acceptance Criteria

- [ ] `plx validate --all --strict` passes
- [ ] `pnpm test` passes with no failures
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] Manual verification of key workflows completed

## Implementation Checklist

- [ ] 10.1 Run `plx validate --all --strict` and fix any issues
- [ ] 10.2 Run `pnpm test` and verify all tests pass
- [ ] 10.3 Run `pnpm lint` and fix any lint errors
- [ ] 10.4 Run `pnpm build` and verify clean build
- [ ] 10.5 Cross-check AGENTS.md command table with CLAUDE.md
- [ ] 10.6 Cross-check ARCHITECTURE.md with implementation
- [ ] 10.7 Verify slash command patterns match CLI commands
- [ ] 10.8 Verify help text matches documentation
- [ ] 10.9 Test shell completion generation
- [ ] 10.10 Run `plx init --tools claude` in temp directory and verify output
- [ ] 10.11 Test key workflows manually (get task, complete, create)
- [ ] 10.12 Document any inconsistencies found and create follow-up tasks

## Notes

This is the final quality gate before the infrastructure update is complete. Be thorough in checking consistency across all files.
