---
status: done
parent-type: change
parent-id: add-parent-linkage-to-feedback-markers
---
# Task: Update parse-feedback.ts

## End Goal
Implement marker grouping, unassigned marker handling, and multi-review generation.

## Currently
- Command requires `--change-id`, `--spec-id`, or `--task-id` flag (or interactive selection)
- All markers go to a single review with the specified parent

## Should
- Command groups markers by parent from marker content
- Unassigned markers use CLI flag as fallback, or interactive prompt, or fail
- Multiple reviews created if markers have different parents
- Review names suffixed when multiple: `{reviewName}-{parentType}-{index}`

## Constraints
- [x] Interactive prompting must follow existing patterns using `@inquirer/prompts`
- [x] JSON output must include all created reviews
- [x] Error message for non-interactive mode with unassigned markers must be actionable

## Acceptance Criteria
- [x] Markers with parent linkage are grouped by parent
- [x] Unassigned markers assigned to CLI-specified parent when flag provided
- [x] Unassigned markers trigger interactive prompt when no CLI flag and interactive mode
- [x] Unassigned markers cause error when no CLI flag and non-interactive mode
- [x] Single parent group uses original review name
- [x] Multiple parent groups use suffixed review names
- [x] JSON output includes `reviews` array with all created reviews
- [x] Text output summarizes all created reviews

## Implementation Checklist
- [x] Call `groupMarkersByParent()` after scanning
- [x] Implement unassigned marker handling with CLI fallback
- [x] Implement unassigned marker handling with interactive prompt
- [x] Implement unassigned marker handling with non-interactive error
- [x] Update review generation for single parent group
- [x] Update review generation for multiple parent groups with suffixed names
- [x] Update `ParseFeedbackJsonOutput` type for multi-review output
- [x] Update text output for multi-review summary

## Notes
File: `src/commands/parse-feedback.ts`
