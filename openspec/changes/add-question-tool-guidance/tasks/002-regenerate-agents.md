---
status: done
---

# Task: Regenerate AGENTS.md

## End Goal

The project's `openspec/AGENTS.md` reflects the updated template with question tool guidance.

## Currently

The AGENTS.md file contains the old template without question tool references.

## Should

The AGENTS.md file is regenerated from the updated template.

## Constraints

- [ ] Use `openspec update` command to regenerate
- [ ] Verify the regenerated content includes the new guidance

## Acceptance Criteria

- [ ] `openspec/AGENTS.md` contains question tool guidance in the "Before Creating Specs" section
- [ ] `openspec/AGENTS.md` contains question tool guidance in the "Error Recovery" section

## Implementation Checklist

- [x] 2.1 Run `pnpm build` to compile the updated templates
- [x] 2.2 Run `openspec update` to regenerate AGENTS.md
- [x] 2.3 Verify the regenerated file contains the updated guidance

## Notes

This task depends on task 001 being complete.
