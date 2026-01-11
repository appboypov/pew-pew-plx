---
status: done
skill-level: medior
parent-type: change
parent-id: standardize-cli-pattern
---
# Task: Verify All Changes

## End Goal

All changes from this proposal are verified to work correctly with consistent behavior between new and deprecated commands.

## Currently

- New commands implemented in previous tasks
- Deprecation warnings added to legacy commands
- Shell completions updated
- Individual unit tests exist

## Should

- All new command patterns verified end-to-end
- All deprecated commands verified to produce identical output
- Deprecation warnings verified to appear on stderr only
- JSON output verified for all new commands
- Multi-workspace support verified for new commands
- No regressions in existing functionality

## Constraints

- [ ] Must test both new and deprecated command variants
- [ ] Must verify JSON output is valid and consistent
- [ ] Must verify stderr/stdout separation for deprecation warnings

## Acceptance Criteria

- [ ] `plx get changes` output matches `plx list` (minus deprecation warning)
- [ ] `plx get specs` output matches `plx list --specs` (minus deprecation warning)
- [ ] `plx get reviews` output matches `plx list --reviews` (minus deprecation warning)
- [ ] `plx validate change --id X` output matches `plx validate X`
- [ ] `plx archive change --id X` behavior matches `plx archive X`
- [ ] `plx review change --id X` output matches `plx review --change-id X`
- [ ] All JSON outputs are valid JSON
- [ ] Deprecation warnings go to stderr only
- [ ] Multi-workspace filtering works with new commands

## Implementation Checklist

- [x] 11.1 Run full test suite and verify all tests pass
- [x] 11.2 Manual verification of `plx get changes` vs `plx list`
- [x] 11.3 Manual verification of `plx get specs` vs `plx list --specs`
- [x] 11.4 Manual verification of `plx get reviews` vs `plx list --reviews`
- [x] 11.5 Manual verification of validate command variants
- [x] 11.6 Manual verification of archive command variants
- [x] 11.7 Manual verification of review command variants
- [x] 11.8 Manual verification of parse feedback command variants
- [x] 11.9 Verify deprecation warnings appear correctly
- [x] 11.10 Verify JSON output for all new commands
- [x] 11.11 Test multi-workspace scenarios with new commands

## Notes

This task serves as a final verification gate before the change is considered complete. Focus on end-to-end behavior rather than implementation details.
