---
status: done
---

# Task: Implement Review CLI Command

## End Goal

CLI command for outputting review context: `plx review --change-id <id>`, `plx review --spec-id <id>`, `plx review --task-id <id>`.

## Currently

No review command exists.

## Should

Create `/src/commands/review.ts` with `ReviewCommand` class:
- `execute(options)`: Output review context for a change, spec, or task
- Support `--change-id`, `--spec-id`, `--task-id` flags (one required)
- Output REVIEW.md guidelines + parent documents (proposal, design, tasks)

Register in `/src/cli/index.ts` as `plx review` command.

## Constraints

- Must follow verb-first CLI pattern
- Must support `--json` output
- Must handle missing parent gracefully with usage hints
- Must support interactive prompts when no parent specified

## Acceptance Criteria

- [x] `plx review --change-id <id>` outputs REVIEW.md + change documents
- [x] `plx review --spec-id <id>` outputs REVIEW.md + spec document
- [x] `plx review --task-id <id>` outputs REVIEW.md + task and parent change documents
- [x] `plx review --json` outputs JSON with documents array
- [x] Missing parent shows error with usage hint and exits with code 1
- [x] Interactive mode prompts for parent type and ID

## Implementation Checklist

- [x] Create `/src/commands/review.ts`
- [x] Implement ReviewCommand class
- [x] Implement execute(options) method with parent type detection
- [x] Implement outputReviewContext() for text output
- [x] Implement buildJsonOutput() for JSON output
- [x] Implement parent-specific document retrieval (change, spec, task)
- [x] Add interactive prompts for missing parent
- [x] Register in `/src/cli/index.ts` with --change-id, --spec-id, --task-id options

## Notes

Output format:
```
═══ Review: change/add-feature-x ═══

═══ REVIEW.md ═══
[contents of REVIEW.md]

═══ Proposal: add-feature-x ═══
[contents of proposal.md]

═══ Design ═══
[contents of design.md]

═══ Tasks ═══
--- 001-task.md ---
[contents]

═══ Next Steps ═══
1. Review the implementation against the requirements above
2. Add feedback markers in code: // #FEEDBACK #TODO | {feedback}
3. Parse feedback: plx parse feedback <review-name> --change-id add-feature-x
```
