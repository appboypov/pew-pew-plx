---
status: done
parent-type: change
parent-id: rename-apply-to-implement
---
# Update Documentation

## End Goal

All documentation references use `implement` instead of `apply`.

## Currently

Multiple documentation files reference the `apply` command:
- `CLAUDE.md` - command table
- `AGENTS.md` (root) - command table
- `workspace/AGENTS.md` - agent instructions
- `README.md` - usage examples
- `ARCHITECTURE.md` - fork features section

## Should

- All command references use `implement` instead of `apply`
- All file path examples use `implement` instead of `apply`

## Constraints

- Preserve document structure
- Only update PLX-managed content where appropriate

## Acceptance Criteria

- [x] `CLAUDE.md` updated
- [x] `AGENTS.md` updated
- [x] `workspace/AGENTS.md` updated
- [x] `README.md` updated (if contains apply references)
- [x] `ARCHITECTURE.md` updated

## Implementation Checklist

- [x] Update `CLAUDE.md`: change any `apply` command references to `implement`
- [x] Update `AGENTS.md`: change any `apply` command references to `implement`
- [x] Update `workspace/AGENTS.md`: change any `apply` references to `implement` in workflow instructions
- [x] Update `README.md`: search for `apply` and update to `implement` where applicable
- [x] Update `ARCHITECTURE.md`: update any `apply` references in fork features section
- [x] Search other markdown files with `rg apply workspace/*.md` and update as needed

## Notes

The `workspace/AGENTS.md` template is generated from `src/core/templates/agents-template.ts` - that file may also need updating.
