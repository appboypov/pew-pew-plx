## ADDED Requirements

### Requirement: Plan Implementation Command

The system SHALL provide a `/plx:plan-implementation` slash command that orchestrates multi-agent task handoff with verification loops.

#### Scenario: Generating plan-implementation command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/plan-implementation.md`
- **AND** include frontmatter with name "Pew Pew Plx: Plan Implementation", description, category "Pew Pew Plx", and relevant tags
- **AND** wrap the command body in PLX markers
- **AND** include guardrails for: running `plx create progress`, outputting task blocks to chat, verifying agent work
- **AND** include steps for: generating PROGRESS.md, outputting first task block, entering review loop, verifying completions, providing feedback, advancing to next task

#### Scenario: Plan-implementation command accepts change-id argument

- **WHEN** the plan-implementation command is invoked with a change-id argument
- **THEN** pass the change-id to `plx create progress --change-id <id>`
- **AND** generate PROGRESS.md for that specific change

#### Scenario: Task block format is self-contained

- **WHEN** the plan-implementation command outputs a task block
- **THEN** include task title, end goal, constraints, acceptance criteria, and implementation checklist
- **AND** include relevant proposal context (why, what changes)
- **AND** instruct agent to focus ONLY on this task
- **AND** instruct agent to run `plx complete task --id <task-id>` when done
- **AND** NOT mention PROGRESS.md in agent instructions

#### Scenario: Review loop waits for user confirmation

- **WHEN** a task block has been output to chat
- **THEN** wait for user to report completion (e.g., "done")
- **AND** NOT automatically proceed to verification

#### Scenario: Verification checks full criteria

- **WHEN** user reports task completion
- **THEN** verify scope adherence (no unrequested features)
- **AND** verify TracelessChanges (no comments about removed code)
- **AND** verify project conventions adherence
- **AND** verify tests pass
- **AND** verify acceptance criteria met

#### Scenario: Feedback block format is self-contained

- **WHEN** verification finds issues
- **THEN** output feedback block to chat for immediate copy
- **AND** append feedback to PROGRESS.md under the task section
- **AND** reference task by name in feedback
- **AND** list specific issues found
- **AND** provide actionable guidance
- **AND** make feedback understandable by fresh agent (full context)
- **AND** NOT require reading PROGRESS.md history

#### Scenario: Task completion advances workflow

- **WHEN** verification passes
- **THEN** mark task complete with `plx complete task --id <task-id>`
- **AND** output next task block to chat
- **AND** continue until all tasks are complete

#### Scenario: All tasks complete ends workflow

- **WHEN** the last task passes verification
- **THEN** mark task complete
- **AND** display completion summary
- **AND** suggest running `plx validate change --id <change-id>` for final check
