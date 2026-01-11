## ADDED Requirements

### Requirement: Task Skill Level Display

The CLI SHALL display task skill level in output when the field is present in task frontmatter.

#### Scenario: Skill level shown in text output

- **WHEN** user runs `plx get task`
- **AND** the task has a `skill-level` field in frontmatter
- **THEN** the skill level (junior/medior/senior) SHALL be displayed in the task header

#### Scenario: Skill level shown in JSON output

- **WHEN** user runs `plx get task --json`
- **AND** the task has a `skill-level` field in frontmatter
- **THEN** the JSON output SHALL include a `skillLevel` field with the value

#### Scenario: Skill level in tasks list

- **WHEN** user runs `plx get tasks`
- **AND** tasks have `skill-level` fields in frontmatter
- **THEN** the skill level SHALL be displayed in the table alongside status

#### Scenario: Missing skill level handled gracefully

- **WHEN** user runs `plx get task`
- **AND** the task does not have a `skill-level` field
- **THEN** the output SHALL not include skill level information
- **AND** no error SHALL occur
