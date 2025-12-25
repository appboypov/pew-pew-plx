---
status: to-do
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

- [ ] Keep documentation concise
- [ ] Include examples of new output format

## Acceptance Criteria

- [ ] Slash command file renamed and content updated
- [ ] README section renamed with updated examples
- [ ] CHANGELOG entry added for breaking change

## Implementation Checklist

- [ ] 5.1 Rename `.claude/commands/plx/act-next.md` to `get-task.md`
- [ ] 5.2 Update frontmatter `name` from "PLX: Act Next" to "PLX: Get Task"
- [ ] 5.3 Update command references in slash command file
- [ ] 5.4 Update README.md section title to "Get Task Command"
- [ ] 5.5 Update README.md command examples to use `get task`
- [ ] 5.6 Update README.md slash command reference to `/plx/get-task`
- [ ] 5.7 Add description of checkbox completion behavior to README
- [ ] 5.8 Add CHANGELOG entry documenting breaking change and new feature

## Notes

CHANGELOG format:
```
## [Unreleased]

### Changed
- **BREAKING**: Renamed `plx act next` command to `plx get task`

### Added
- `--did-complete-previous` now automatically marks Implementation Checklist items as complete
```
