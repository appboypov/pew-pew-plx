---
status: done
---

# Task: Update documentation

## End Goal

All documentation references the new `get task` command with accurate descriptions of checkbox completion behavior.

## Currently

- `.claude/commands/plx/act-next.md` documents slash command
- `README.md` has "Act Next Command" section
- Command examples use `plx act next`

## Should

- `.claude/commands/plx/get-task.md` documents slash command
- `README.md` has "Get Task Command" section
- Command examples use `plx get task`
- Documentation describes checkbox completion behavior

## Constraints

- [x] Keep documentation concise
- [x] Include examples of new output format

## Acceptance Criteria

- [x] Slash command file renamed and content updated
- [x] README section renamed with updated examples
- [x] CHANGELOG entry added for breaking change

## Implementation Checklist

- [x] 5.1 Rename `.claude/commands/plx/act-next.md` to `get-task.md`
- [x] 5.2 Update frontmatter `name` from "PLX: Act Next" to "PLX: Get Task"
- [x] 5.3 Update command references in slash command file
- [x] 5.4 Update README.md section title to "Get Task Command"
- [x] 5.5 Update README.md command examples to use `get task`
- [x] 5.6 Update README.md slash command reference to `/plx/get-task`
- [x] 5.7 Add description of checkbox completion behavior to README
- [x] 5.8 Add CHANGELOG entry documenting breaking change and new feature

## Notes

CHANGELOG format:
```
## [Unreleased]

### Changed
- **BREAKING**: Renamed `plx act next` command to `plx get task`

### Added
- `--did-complete-previous` now automatically marks Implementation Checklist items as complete
```
