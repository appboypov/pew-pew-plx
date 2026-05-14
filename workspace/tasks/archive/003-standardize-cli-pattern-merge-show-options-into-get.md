---
status: done
skill-level: medior
parent-type: change
parent-id: standardize-cli-pattern
---
# Task: Merge Show Options into Get Command

## End Goal

The `splx get change` and `splx get spec` commands support all filtering options from `splx show`.

## Currently

- `splx show <change> --deltas-only` shows only delta content
- `splx show <spec> --requirements` shows requirements in JSON
- `splx show <spec> --no-scenarios` excludes scenarios
- `splx show <spec> -r <id>` shows specific requirement
- `splx get change --id` does not support these options
- `splx get spec --id` does not support these options

## Should

- `splx get change --id <change> --deltas-only` shows only delta content
- `splx get spec --id <spec> --requirements` shows requirements
- `splx get spec --id <spec> --no-scenarios` excludes scenarios
- `splx get spec --id <spec> -r <id>` shows specific requirement
- Options work with `--json` flag for machine-readable output
- Invalid option combinations produce clear error messages

## Constraints

- [ ] Must maintain backward compatibility with existing `splx get change` behavior
- [ ] Options must work identically to their `splx show` counterparts
- [ ] Must not add options that don't exist in `splx show`

## Acceptance Criteria

- [ ] `splx get change --id <id> --deltas-only` produces same output as `splx show <id> --deltas-only`
- [ ] `splx get spec --id <id> --requirements` produces same output as `splx show <id> --requirements`
- [ ] `splx get spec --id <id> --no-scenarios` produces same output as `splx show <id> --no-scenarios`
- [ ] `splx get spec --id <id> -r <req-id>` produces same output as `splx show <id> -r <req-id>`
- [ ] All combinations work with `--json` flag
- [ ] Shell completions include new options

## Implementation Checklist

- [x] 3.1 Add `--deltas-only` option to `get change` subcommand
- [x] 3.2 Add `--requirements` option to `get spec` subcommand
- [x] 3.3 Add `--no-scenarios` option to `get spec` subcommand
- [x] 3.4 Add `-r`/`--requirement` option to `get spec` subcommand
- [x] 3.5 Extract filtering logic from `show.ts` to shared service
- [x] 3.6 Update shell completions with new options
- [x] 3.7 Add unit tests verifying parity with show command
- [x] 3.8 Add integration tests for combined options

## Notes

The filtering logic should be extracted to a shared service used by both `show` and `get` commands to avoid code duplication and ensure identical behavior.
