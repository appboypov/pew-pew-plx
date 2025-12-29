## ADDED Requirements

### Requirement: Single Task Execution

`workspace/AGENTS.md` SHALL instruct agents to stop after completing one task and await user confirmation before proceeding to the next task.

#### Scenario: Documenting stop-and-wait behavior

- **WHEN** an agent reads Stage 2: Implementing Changes
- **THEN** find instruction to stop after completing the current task
- **AND** find instruction to await user confirmation before proceeding to the next task
- **AND** NOT find instruction to automatically repeat or continue until all tasks are done
