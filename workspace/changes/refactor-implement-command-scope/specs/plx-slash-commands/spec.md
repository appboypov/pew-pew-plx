# plx-slash-commands Delta

## ADDED Requirements

### Requirement: Implement Command Change-Focused Scope

The `/plx:implement` slash command SHALL implement all tasks in a change by default, only focusing on a single task when a task ID is explicitly provided.

#### Scenario: Default behavior implements entire change

- **WHEN** the implement command is invoked without a task ID argument
- **THEN** retrieve the next prioritized task and note its change ID
- **AND** work through each task's Implementation Checklist
- **AND** mark each task complete with `plx complete task --id <task-id>`
- **AND** continue to the next task in the same change
- **AND** stop when the change is complete or a different change is encountered

#### Scenario: Task ID argument limits scope to single task

- **WHEN** the implement command is invoked with a task ID argument
- **THEN** retrieve only that specific task
- **AND** work through that task's Implementation Checklist
- **AND** mark the task complete with `plx complete task --id <task-id>`
- **AND** stop after completing that single task
