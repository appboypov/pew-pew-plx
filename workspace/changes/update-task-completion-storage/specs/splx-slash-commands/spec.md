## MODIFIED Requirements
### Requirement: Act Next Actionable Filtering
The system SHALL filter out non-actionable changes when selecting the next task via `splx act next`.

#### Scenario: Skipping changes with all tasks complete
- **WHEN** a change's task files contain no unchecked markdown checkboxes
- **THEN** the `splx act next` command SHALL skip that change
- **AND** select a change with incomplete tasks instead

#### Scenario: Skipping changes with no checkboxes
- **WHEN** a change has task files but zero markdown checkboxes across those files
- **THEN** the `splx act next` command SHALL treat the change as complete and skip it
- **AND** select a change with incomplete tasks instead

#### Scenario: Returning null when no actionable changes exist
- **WHEN** all active changes are either complete or have no unchecked checkboxes
- **THEN** the `splx act next` command SHALL return null
- **AND** display "No active changes found" message
