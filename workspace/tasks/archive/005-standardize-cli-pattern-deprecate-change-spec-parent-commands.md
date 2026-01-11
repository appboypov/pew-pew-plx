---
status: done
skill-level: junior
parent-type: change
parent-id: standardize-cli-pattern
---
# Task: Deprecate Change and Spec Parent Commands

## End Goal

The `plx change` and `plx spec` parent commands emit deprecation warnings directing users to the standardized alternatives.

## Currently

- `plx change show <id>` shows change details
- `plx change list` lists changes
- `plx change validate <id>` validates a change
- `plx spec show <id>` shows spec details
- `plx spec list` lists specs
- `plx spec validate <id>` validates a spec
- No deprecation warnings exist

## Should

- `plx change show <id>` warns: "Deprecation: 'plx change show' is deprecated. Use 'plx get change --id <id>' instead."
- `plx change list` warns: "Deprecation: 'plx change list' is deprecated. Use 'plx get changes' instead."
- `plx change validate <id>` warns: "Deprecation: 'plx change validate' is deprecated. Use 'plx validate change --id <id>' instead."
- Same pattern for `plx spec` subcommands
- Commands continue to function identically
- Warnings use stderr for script compatibility

## Constraints

- [ ] Commands must continue to function identically
- [ ] Warnings must not break existing scripts (stderr only)
- [ ] Warning format must be consistent with other deprecations

## Acceptance Criteria

- [ ] `plx change show <id>` shows deprecation warning
- [ ] `plx change list` shows deprecation warning
- [ ] `plx change validate <id>` shows deprecation warning
- [ ] `plx spec show <id>` shows deprecation warning
- [ ] `plx spec list` shows deprecation warning
- [ ] `plx spec validate <id>` shows deprecation warning
- [ ] All commands produce identical results
- [ ] `--no-deprecation-warnings` suppresses warnings

## Implementation Checklist

- [x] 5.1 Add deprecation warning to `plx change show` subcommand
- [x] 5.2 Add deprecation warning to `plx change list` subcommand
- [x] 5.3 Add deprecation warning to `plx change validate` subcommand
- [x] 5.4 Add deprecation warning to `plx spec show` subcommand
- [x] 5.5 Add deprecation warning to `plx spec list` subcommand
- [x] 5.6 Add deprecation warning to `plx spec validate` subcommand
- [x] 5.7 Add unit tests verifying deprecation warnings
- [x] 5.8 Verify all deprecated commands still function correctly

## Notes

Reuse the deprecation warning utility created in task 004. The warnings should be consistent in format and behavior.
