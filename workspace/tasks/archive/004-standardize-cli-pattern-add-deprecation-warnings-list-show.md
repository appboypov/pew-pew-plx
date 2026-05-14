---
status: done
skill-level: junior
parent-type: change
parent-id: standardize-cli-pattern
---
# Task: Add Deprecation Warnings to List and Show Commands

## End Goal

The `splx list` and `splx show` commands emit deprecation warnings directing users to the new `splx get` equivalents.

## Currently

- `splx list` lists changes without warnings
- `splx list --specs` lists specs without warnings
- `splx list --reviews` lists reviews without warnings
- `splx show <item>` displays item without warnings
- No deprecation messaging exists

## Should

- `splx list` warns: "Deprecation: 'splx list' is deprecated. Use 'splx get changes' instead."
- `splx list --specs` warns: "Deprecation: 'splx list --specs' is deprecated. Use 'splx get specs' instead."
- `splx list --reviews` warns: "Deprecation: 'splx list --reviews' is deprecated. Use 'splx get reviews' instead."
- `splx show <item>` warns: "Deprecation: 'splx show' is deprecated. Use 'splx get <type> --id <item>' instead."
- Warnings go to stderr, not stdout (for script compatibility)
- Warnings appear once per invocation, not repeated
- `--quiet` or `--no-deprecation-warnings` suppresses warnings

## Constraints

- [ ] Commands must continue to function identically after deprecation
- [ ] Warnings must not break JSON output (use stderr)
- [ ] Warnings must include clear migration path

## Acceptance Criteria

- [ ] `splx list` shows deprecation warning on stderr
- [ ] `splx list --specs` shows appropriate deprecation warning
- [ ] `splx list --reviews` shows appropriate deprecation warning
- [ ] `splx show <item>` shows deprecation warning
- [ ] JSON output remains valid (warnings on stderr only)
- [ ] Deprecated commands produce identical results to before
- [ ] Warnings include specific replacement command

## Implementation Checklist

- [x] 4.1 Create deprecation warning utility in `src/utils/`
- [x] 4.2 Add deprecation warning to `splx list` command
- [x] 4.3 Add deprecation warning to `splx show` command
- [x] 4.4 Ensure warnings go to stderr
- [x] 4.5 Add global `--no-deprecation-warnings` flag
- [x] 4.6 Add unit tests for deprecation warning output
- [x] 4.7 Verify JSON output remains unaffected

## Notes

Deprecation warnings should be standardized to allow easy suppression in CI/CD environments. Consider using a common warning format: `Deprecation: '<old>' is deprecated. Use '<new>' instead.`
