---
status: done
---

# Task: Update template instructions

## End Goal

Template instructions explicitly tell agents to stop after completing one task and await user confirmation before proceeding.

## Currently

- `plx-slash-command-templates.ts` Step 4 says "get next task" implying automatic continuation
- `agents-template.ts` Stage 2, Step 6 says "Repeat - Continue until all tasks are done"

## Should

- Both templates include explicit "Stop and await user confirmation" instruction
- No implication of automatic continuation to subsequent tasks

## Constraints

- [ ] Changes must not break existing CLI functionality
- [ ] Template changes must maintain consistent messaging between AGENTS.md and slash commands

## Acceptance Criteria

- [ ] `getTaskSteps` in `plx-slash-command-templates.ts` includes explicit stop instruction
- [ ] Stage 2 in `agents-template.ts` replaces "Repeat" with stop-and-wait instruction
- [ ] TypeScript compiles without errors

## Implementation Checklist

- [x] 1.1 Update `getTaskSteps` in `src/core/templates/plx-slash-command-templates.ts` to replace step 4 with explicit completion and stop instructions
- [x] 1.2 Update Stage 2 in `src/core/templates/agents-template.ts` to replace step 6 "Repeat" with "Stop and await user confirmation"
- [x] 1.3 Run `npm run build` to verify TypeScript compiles

## Notes

The change affects two template constants:
- `getTaskSteps` in `plx-slash-command-templates.ts` (lines 29-35)
- Stage 2 workflow in `agents-template.ts` (lines 49-57)
