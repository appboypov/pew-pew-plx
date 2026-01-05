## ADDED Requirements

### Requirement: Orchestrate Model Selection

The plx/orchestrate slash command SHALL instruct agents to select sub-agent models based on task skill level.

#### Scenario: Model selection guidance in orchestrate

- **WHEN** the plx/orchestrate slash command is generated
- **THEN** include guidance for selecting sub-agent model based on task skill level
- **AND** include the Claude model mapping: junior→haiku, medior→sonnet, senior→opus
- **AND** include fallback guidance: if skill level is missing, agent determines model based on task complexity

#### Scenario: Non-Claude model handling

- **WHEN** an agent uses a non-Claude model ecosystem
- **THEN** the orchestrate command SHALL instruct to determine equivalent model tier
- **OR** ignore skill level if model selection is not available

### Requirement: Plan Proposal Skill Level Assignment

The plx/plan-proposal slash command SHALL instruct agents to auto-assign skill levels to generated tasks.

#### Scenario: Skill level heuristics in plan-proposal

- **WHEN** the plx/plan-proposal slash command is generated
- **THEN** include instruction to assign skill level to each generated task
- **AND** include heuristics for assignment:
  - junior: documentation, simple config, minor refactoring
  - medior: feature implementation, moderate integration, testing tasks
  - senior: architecture changes, complex algorithms, cross-cutting concerns

#### Scenario: Review and test task defaults

- **WHEN** creating standard review and test tasks
- **THEN** review tasks SHALL default to medior
- **AND** test tasks SHALL default to medior
