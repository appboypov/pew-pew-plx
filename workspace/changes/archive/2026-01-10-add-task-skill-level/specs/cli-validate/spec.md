## ADDED Requirements

### Requirement: Task Skill Level Validation Warning

The CLI SHALL warn in strict mode when tasks are missing the `skill-level` field.

#### Scenario: Warning for missing skill level in strict mode

- **WHEN** user runs `plx validate <change-id> --strict`
- **AND** a task file exists without a `skill-level` field in frontmatter
- **THEN** the system SHALL emit a WARNING (not ERROR)
- **AND** the warning message SHALL indicate which task is missing skill level
- **AND** validation SHALL still pass if no other issues exist

#### Scenario: No warning in non-strict mode

- **WHEN** user runs `plx validate <change-id>` (without --strict)
- **AND** a task file exists without a `skill-level` field
- **THEN** no warning SHALL be emitted for missing skill level

#### Scenario: Valid skill level values

- **WHEN** a task has `skill-level` in frontmatter
- **AND** the value is one of: junior, medior, senior
- **THEN** no warning SHALL be emitted for that field

#### Scenario: Invalid skill level value

- **WHEN** a task has `skill-level` in frontmatter
- **AND** the value is not one of: junior, medior, senior
- **THEN** the system SHALL emit a WARNING about invalid skill level
