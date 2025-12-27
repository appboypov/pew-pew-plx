## ADDED Requirements

### Requirement: Get Task Stop Behavior

The `plx/get-task` slash command SHALL instruct agents to stop after completing the retrieved task and await user confirmation before proceeding.

#### Scenario: Get-task command includes stop instruction

- **WHEN** the `plx/get-task` slash command is generated
- **THEN** include a step instructing agents to stop after task completion
- **AND** include instruction to await user confirmation before proceeding to the next task
- **AND** NOT include instruction to automatically get the next task after completion
