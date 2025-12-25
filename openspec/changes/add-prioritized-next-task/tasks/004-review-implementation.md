# Task: Review implementation

## End Goal

Verify all implementation tasks are complete and consistent with the proposal and spec.

## Currently

Implementation tasks 001-003 are complete.

## Should

All code is reviewed for:
- Consistency with proposal requirements
- Adherence to spec scenarios
- Code quality and patterns
- Error handling completeness

## Constraints

- [ ] Must verify all spec scenarios are implemented
- [ ] Must verify all acceptance criteria from tasks 001-003 are met

## Acceptance Criteria

- [ ] All utilities export correctly from src/utils/index.ts
- [ ] Command registers correctly in CLI
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No lint errors (`npm run lint`)
- [ ] All edge cases handled per spec

## Implementation Checklist

- [ ] 4.1 Run `npm run typecheck` and fix any errors
- [ ] 4.2 Run `npm run lint` and fix any errors
- [ ] 4.3 Verify task-status.ts exports and functionality
- [ ] 4.4 Verify change-prioritization.ts exports and functionality
- [ ] 4.5 Verify next-task command registration and help text
- [ ] 4.6 Test command manually: `openspec next-task --help`

## Notes

This is a verification task, not implementation.
