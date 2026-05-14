---
status: done
skill-level: junior
parent-type: change
parent-id: standardize-cli-pattern
---
# Task: Deprecate Change and Spec Parent Commands

## End Goal

The `splx change` and `splx spec` parent commands emit deprecation warnings directing users to the standardized alternatives.

## Currently

- `splx change show <id>` shows change details
- `splx change list` lists changes
- `splx change validate <id>` validates a change
- `splx spec show <id>` shows spec details
- `splx spec list` lists specs
- `splx spec validate <id>` validates a spec
- No deprecation warnings exist

## Should

- `splx change show <id>` warns: "Deprecation: 'splx change show' is deprecated. Use 'splx get change --id <id>' instead."
- `splx change list` warns: "Deprecation: 'splx change list' is deprecated. Use 'splx get changes' instead."
- `splx change validate <id>` warns: "Deprecation: 'splx change validate' is deprecated. Use 'splx validate change --id <id>' instead."
- Same pattern for `splx spec` subcommands
- Commands continue to function identically
- Warnings use stderr for script compatibility

## Constraints

- [ ] Commands must continue to function identically
- [ ] Warnings must not break existing scripts (stderr only)
- [ ] Warning format must be consistent with other deprecations

## Acceptance Criteria

- [ ] `splx change show <id>` shows deprecation warning
- [ ] `splx change list` shows deprecation warning
- [ ] `splx change validate <id>` shows deprecation warning
- [ ] `splx spec show <id>` shows deprecation warning
- [ ] `splx spec list` shows deprecation warning
- [ ] `splx spec validate <id>` shows deprecation warning
- [ ] All commands produce identical results
- [ ] `--no-deprecation-warnings` suppresses warnings

## Implementation Checklist

- [x] 5.1 Add deprecation warning to `splx change show` subcommand
- [x] 5.2 Add deprecation warning to `splx change list` subcommand
- [x] 5.3 Add deprecation warning to `splx change validate` subcommand
- [x] 5.4 Add deprecation warning to `splx spec show` subcommand
- [x] 5.5 Add deprecation warning to `splx spec list` subcommand
- [x] 5.6 Add deprecation warning to `splx spec validate` subcommand
- [x] 5.7 Add unit tests verifying deprecation warnings
- [x] 5.8 Verify all deprecated commands still function correctly

## Notes

Reuse the deprecation warning utility created in task 004. The warnings should be consistent in format and behavior.
