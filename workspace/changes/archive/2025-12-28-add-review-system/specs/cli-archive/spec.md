# CLI Archive Command Specification

## ADDED Requirements

### Requirement: Review Archive Support

The archive command SHALL support archiving reviews in addition to changes.

#### Scenario: Archiving a review

- **WHEN** `plx archive <id>` is executed and id matches a review
- **THEN** verify all tasks in `reviews/<id>/tasks/` have status: done
- **AND** if incomplete tasks found, prompt for confirmation
- **AND** process spec updates if `reviews/<id>/specs/` exists
- **AND** move to `reviews/archive/YYYY-MM-DD-<id>/`

#### Scenario: Review spec updates

- **WHEN** archiving a review with `specs/` directory containing delta content
- **THEN** display spec update confirmation (matching change archive behavior)
- **AND** apply deltas using existing `buildUpdatedSpec()` logic
- **AND** validate rebuilt specs before writing
- **AND** update review.md frontmatter: `spec-updates-applied: true`

#### Scenario: Review without spec updates

- **WHEN** archiving a review without `specs/` directory
- **THEN** skip spec update phase
- **AND** update review.md frontmatter: `spec-updates-applied: false`

#### Scenario: Review archive metadata update

- **WHEN** archiving a review
- **THEN** update review.md frontmatter:
  - `status: archived`
  - `archived-at: <ISO timestamp>`
  - `spec-updates-applied: true|false`

### Requirement: Entity Type Detection

The archive command SHALL auto-detect whether the ID refers to a change or review.

#### Scenario: Auto-detecting entity type

- **WHEN** `plx archive <id>` is executed
- **THEN** check if id exists in `workspace/changes/` → archive as change
- **AND** check if id exists in `workspace/reviews/` → archive as review
- **AND** if found in neither, display error: "No change or review found with id '<id>'"

#### Scenario: Ambiguous ID

- **WHEN** the same id exists in both `changes/` and `reviews/`
- **THEN** prompt user to select which entity to archive
- **OR** use `--type change|review` flag to disambiguate

#### Scenario: Explicit type flag

- **WHEN** `plx archive <id> --type review` is executed
- **THEN** look only in `workspace/reviews/` for the id
- **AND** skip change directory check
