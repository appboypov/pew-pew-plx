## ADDED Requirements

### Requirement: Task Skill Level Documentation

`workspace/AGENTS.md` SHALL document the task skill level field and its usage for model selection.

#### Scenario: Task template includes skill level

- **WHEN** an agent reads the task file template in workspace/AGENTS.md
- **THEN** the example frontmatter SHALL include `skill-level: junior|medior|senior` showing all choices
- **AND** a comment or note SHALL explain the valid values (junior, medior, senior)

#### Scenario: Model mapping guidance provided

- **WHEN** an agent reads the skill level documentation
- **THEN** find guidance on mapping skill levels to AI models
- **AND** find the Claude mapping: junior→haiku, medior→sonnet, senior→opus
- **AND** find guidance for non-Claude models: agent determines equivalent or ignores

#### Scenario: Skill level assignment guidance

- **WHEN** an agent creates tasks
- **THEN** find heuristics for assigning skill levels:
  - junior: straightforward changes, simple refactoring, documentation updates
  - medior: feature implementation, moderate complexity, integration work
  - senior: architectural changes, complex algorithms, cross-cutting concerns
