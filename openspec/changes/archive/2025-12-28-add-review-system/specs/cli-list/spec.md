# List Command Specification

## ADDED Requirements

### Requirement: Review Listing Mode

The command SHALL support listing reviews alongside changes and specs.

#### Scenario: Listing reviews

- **WHEN** `plx list --reviews` is executed
- **THEN** scan the `openspec/reviews/` directory for review directories
- **AND** exclude the `archive/` subdirectory from results
- **AND** display each review with: name, target type, task progress

#### Scenario: Review output format

- **WHEN** displaying the list of reviews
- **THEN** show a table with columns:
  - Review name (directory name)
  - Target type (change, spec, task, feedback-scan)
  - Task progress (e.g., "3/5 tasks" or "✓ Complete")

#### Scenario: Empty reviews state

- **WHEN** no active reviews exist
- **THEN** display: "No active reviews found."
