## ADDED Requirements

### Requirement: Act Next Actionable Filtering

The system SHALL filter out non-actionable changes when selecting the next task via `plx act next`.

#### Scenario: Skipping changes with all checkboxes complete

- **WHEN** a change has all implementation checkboxes marked as complete (`- [x]`)
- **THEN** the `plx act next` command SHALL skip that change
- **AND** select a change with incomplete checkboxes instead

#### Scenario: Skipping changes with no checkboxes

- **WHEN** a change has zero implementation checkboxes in its task files
- **THEN** the `plx act next` command SHALL skip that change
- **AND** select a change with incomplete checkboxes instead

#### Scenario: Returning null when no actionable changes exist

- **WHEN** all active changes are either complete or have no checkboxes
- **THEN** the `plx act next` command SHALL return null
- **AND** display "No active changes found" message
