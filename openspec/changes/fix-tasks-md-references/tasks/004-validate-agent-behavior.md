# Task: Validate agent behavior with updated instructions

## End Goal

AI agents using the `/proposal` command:
1. Create `tasks/` directory instead of `tasks.md`
2. Create minimum 3 task files
3. Follow the documented task file template

## Currently

Updated instruction files need behavioral validation.

## Should

An agent following the updated instructions creates the correct structure when scaffolding a new change.

## Constraints

- Cannot fully automate agent behavior testing
- Manual verification with test proposal required

## Acceptance Criteria

- [ ] Instructions clearly specify `tasks/` directory structure
- [ ] Instructions specify minimum 3 task files
- [ ] Task file template is documented
- [ ] Test proposal creates correct structure

## Implementation Checklist

- [x] 4.1 Read updated AGENTS.md task creation section
- [x] 4.2 Verify happy path script creates `tasks/` directory
- [x] 4.3 Run `openspec validate --strict` on entire project
- [x] 4.4 Create test change and verify: tasks/ directory created, 3+ files, correct template

## Notes

- This proposal itself serves as the test case
- If this proposal has correct `tasks/` directory with 3+ files following the template, the fix works
