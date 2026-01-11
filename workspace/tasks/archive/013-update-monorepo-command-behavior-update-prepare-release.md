---
status: done
skill-level: junior
parent-type: change
parent-id: update-monorepo-command-behavior
---

# Task: Update prepare-release command with version and date handling

## End Goal

The `/plx/prepare-release` slash command explicitly instructs AI agents to never use "Unreleased" in changelogs, always determine concrete version numbers, run `date` command for accurate release dates, and suggest appropriate version bumps.

## Currently

The prepare-release command has general changelog guidance but lacks explicit instructions about:
- Avoiding "Unreleased" placeholder
- Running `date` command for release date
- Version bump suggestion criteria

## Should

The command should include explicit guardrails and steps for:
- Never using "Unreleased" - always determine next version number
- Running `date` command to get accurate release date
- Suggesting version bumps based on: breaking changes → major, feat → minor, fix → patch, BREAKING footer → major

## Constraints

- [ ] Keep existing command structure and flow intact
- [ ] Add to guardrails section, not replace existing guardrails
- [ ] Version bump suggestion is advisory, not mandatory

## Acceptance Criteria

- [ ] Command explicitly states to never use "Unreleased"
- [ ] Command instructs to run `date` command for release date
- [ ] Command includes version bump suggestion guidance
- [ ] Existing functionality preserved

## Implementation Checklist

- [x] 1.1 Read current `.claude/commands/plx/prepare-release.md`
- [x] 1.2 Add guardrail: "Never use 'Unreleased' in changelog - always determine concrete next version"
- [x] 1.3 Add guardrail: "Run `date` command to get accurate release date"
- [x] 1.4 Add version bump suggestion guidance in changelog update step
- [x] 1.5 Verify command still validates and reads correctly

## Notes

This is a prompt-only change - no TypeScript code modifications required.
