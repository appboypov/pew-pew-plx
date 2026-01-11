---
status: done
skill-level: junior
parent-type: change
parent-id: standardize-cli-pattern
---
# Task: Add Deprecation Warnings to List and Show Commands

## End Goal

The `plx list` and `plx show` commands emit deprecation warnings directing users to the new `plx get` equivalents.

## Currently

- `plx list` lists changes without warnings
- `plx list --specs` lists specs without warnings
- `plx list --reviews` lists reviews without warnings
- `plx show <item>` displays item without warnings
- No deprecation messaging exists

## Should

- `plx list` warns: "Deprecation: 'plx list' is deprecated. Use 'plx get changes' instead."
- `plx list --specs` warns: "Deprecation: 'plx list --specs' is deprecated. Use 'plx get specs' instead."
- `plx list --reviews` warns: "Deprecation: 'plx list --reviews' is deprecated. Use 'plx get reviews' instead."
- `plx show <item>` warns: "Deprecation: 'plx show' is deprecated. Use 'plx get <type> --id <item>' instead."
- Warnings go to stderr, not stdout (for script compatibility)
- Warnings appear once per invocation, not repeated
- `--quiet` or `--no-deprecation-warnings` suppresses warnings

## Constraints

- [ ] Commands must continue to function identically after deprecation
- [ ] Warnings must not break JSON output (use stderr)
- [ ] Warnings must include clear migration path

## Acceptance Criteria

- [ ] `plx list` shows deprecation warning on stderr
- [ ] `plx list --specs` shows appropriate deprecation warning
- [ ] `plx list --reviews` shows appropriate deprecation warning
- [ ] `plx show <item>` shows deprecation warning
- [ ] JSON output remains valid (warnings on stderr only)
- [ ] Deprecated commands produce identical results to before
- [ ] Warnings include specific replacement command

## Implementation Checklist

- [x] 4.1 Create deprecation warning utility in `src/utils/`
- [x] 4.2 Add deprecation warning to `plx list` command
- [x] 4.3 Add deprecation warning to `plx show` command
- [x] 4.4 Ensure warnings go to stderr
- [x] 4.5 Add global `--no-deprecation-warnings` flag
- [x] 4.6 Add unit tests for deprecation warning output
- [x] 4.7 Verify JSON output remains unaffected

## Notes

Deprecation warnings should be standardized to allow easy suppression in CI/CD environments. Consider using a common warning format: `Deprecation: '<old>' is deprecated. Use '<new>' instead.`
