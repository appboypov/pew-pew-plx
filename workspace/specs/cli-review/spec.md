# cli-review Specification

## Purpose
TBD - created by archiving change add-review-system. Update Purpose after archive.
## Requirements
### Requirement: Review List Command

The command SHALL list all active reviews in the project.

#### Scenario: Listing active reviews

- **WHEN** `plx review list` is executed
- **THEN** scan the `workspace/reviews/` directory for review directories
- **AND** exclude the `archive/` subdirectory from results
- **AND** display each review with name, target type, target ID, and task progress

#### Scenario: JSON output for review list

- **WHEN** `plx review list --json` is executed
- **THEN** output a JSON array of review objects
- **AND** each object includes: id, status, targetType, targetId, reviewedAt, taskProgress

#### Scenario: Empty reviews directory

- **WHEN** no active reviews exist
- **THEN** display: "No active reviews found."

### Requirement: Review Show Command

The command SHALL display details of a specific review.

#### Scenario: Showing review details

- **WHEN** `plx review show <review-id>` is executed
- **THEN** read the review.md from `workspace/reviews/<review-id>/`
- **AND** display: status, target type, target ID, reviewed date, scope, findings summary
- **AND** list tasks with their status and spec-impact

#### Scenario: Review not found

- **WHEN** the specified review-id does not exist
- **THEN** display error: "Review '<review-id>' not found."
- **AND** exit with code 1

#### Scenario: JSON output for review show

- **WHEN** `plx review show <review-id> --json` is executed
- **THEN** output a JSON object with full review details
- **AND** include tasks array with status and specImpact fields

### Requirement: Review Discovery

The system SHALL provide functions to discover reviews in the project.

#### Scenario: Finding active reviews

- **WHEN** scanning for active reviews
- **THEN** look in `workspace/reviews/` for directories containing `review.md`
- **AND** exclude the `archive/` subdirectory
- **AND** return sorted list of review IDs

#### Scenario: Finding archived reviews

- **WHEN** scanning for archived reviews
- **THEN** look in `workspace/reviews/archive/` for directories
- **AND** return sorted list of archived review IDs with date prefixes

