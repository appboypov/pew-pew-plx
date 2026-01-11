# CLI Archive Command Specification

## Purpose
The archive command moves completed changes from the active changes directory to the archive folder with date-based naming, following PLX conventions.

## Command Syntax
```bash
plx archive [change-name] [--yes|-y]
```

Options:
- `--yes`, `-y`: Skip confirmation prompts (for automation)
## Requirements
### Requirement: Change Selection

The command SHALL support both interactive and direct change selection methods.

#### Scenario: Interactive selection

- **WHEN** no change-name is provided
- **THEN** display interactive list of available changes (excluding archive/)
- **AND** allow user to select one

#### Scenario: Direct selection

- **WHEN** change-name is provided
- **THEN** use that change directly
- **AND** validate it exists

### Requirement: Task Completion Check

The command SHALL verify task completion status before archiving by aggregating across all task files in the `tasks/` directory.

#### Scenario: Incomplete tasks found

- **WHEN** incomplete tasks are found across any task files in `tasks/` directory (marked with `- [ ]`)
- **THEN** display all incomplete tasks to the user grouped by task file
- **AND** prompt for confirmation to continue
- **AND** default to "No" for safety

#### Scenario: All tasks complete

- **WHEN** all tasks across all task files in `tasks/` directory are complete OR no `tasks/` directory exists
- **THEN** proceed with archiving without prompting

#### Scenario: Auto-migration before check

- **WHEN** a change has legacy `tasks.md` without `tasks/` directory
- **THEN** trigger auto-migration to `tasks/001-tasks.md` before checking completion
- **AND** display migration info message

### Requirement: Archive Process

The archive operation SHALL follow a structured process to safely move changes to the archive, including the entire `tasks/` directory.

#### Scenario: Performing archive

- **WHEN** archiving a change
- **THEN** execute these steps:
  1. Create archive/ directory if it doesn't exist
  2. Generate target name as `YYYY-MM-DD-[change-name]` using current date
  3. Check if target directory already exists
  4. Update main specs from the change's future state specs (see Spec Update Process below)
  5. Move the entire change directory to the archive location, including the `tasks/` directory with all task files

#### Scenario: Archive already exists

- **WHEN** target archive already exists
- **THEN** fail with error message
- **AND** do not overwrite existing archive

#### Scenario: Successful archive

- **WHEN** move succeeds
- **THEN** display success message with archived name and list of updated specs
- **AND** confirm that all task files in `tasks/` directory were preserved in archive

### Requirement: Spec Update Process

Before moving the change to archive, the command SHALL apply delta changes to main specs to reflect the deployed reality.

#### Scenario: Applying delta changes

- **WHEN** archiving a change with delta-based specs
- **THEN** parse and apply delta changes as defined in plx-conventions
- **AND** validate all operations before applying

#### Scenario: Validating delta changes

- **WHEN** processing delta changes
- **THEN** perform validations as specified in plx-conventions
- **AND** if validation fails, show specific errors and abort

#### Scenario: Conflict detection

- **WHEN** applying deltas would create duplicate requirement headers
- **THEN** abort with error message showing the conflict
- **AND** suggest manual resolution

### Requirement: Confirmation Behavior

The spec update confirmation SHALL provide clear visibility into changes before they are applied.

#### Scenario: Displaying confirmation

- **WHEN** prompting for confirmation
- **THEN** display a clear summary showing:
  - Which specs will be created (new capabilities)
  - Which specs will be updated (existing capabilities)
  - The source path for each spec
- **AND** format the confirmation prompt as:
  ```
  The following specs will be updated:
  
  NEW specs to be created:
    - cli-archive (from changes/add-archive-command/specs/cli-archive/spec.md)
  
  EXISTING specs to be updated:
    - cli-init (from changes/update-init-command/specs/cli-init/spec.md)
  
  Update 2 specs and archive 'add-archive-command'? [y/N]:
  ```
#### Scenario: Handling confirmation response

- **WHEN** waiting for user confirmation
- **THEN** default to "No" for safety (require explicit "y" or "yes")
- **AND** skip confirmation when `--yes` or `-y` flag is provided

#### Scenario: User declines confirmation

- **WHEN** user declines the confirmation
- **THEN** abort the entire archive operation
- **AND** display message: "Archive cancelled. No changes were made."
- **AND** exit with non-zero status code

### Requirement: Error Conditions

The command SHALL handle various error conditions gracefully.

#### Scenario: Handling errors

- **WHEN** errors occur
- **THEN** handle the following conditions:
  - Missing workspace/changes/ directory
  - Change not found
  - Archive target already exists
  - File system permissions issues

### Requirement: Skip Specs Option

The archive command SHALL support a `--skip-specs` flag that skips all spec update operations and proceeds directly to archiving.

#### Scenario: Skipping spec updates with flag

- **WHEN** executing `plx archive <change> --skip-specs`
- **THEN** skip spec discovery and update confirmation
- **AND** proceed directly to moving the change to archive
- **AND** display a message indicating specs were skipped

### Requirement: Non-blocking confirmation

The archive operation SHALL proceed when the user declines spec updates instead of cancelling the entire operation.

#### Scenario: User declines spec update confirmation

- **WHEN** the user declines spec update confirmation
- **THEN** skip spec updates
- **AND** continue with the archive operation
- **AND** display a success message indicating specs were not updated

### Requirement: Display Output

The command SHALL provide clear feedback about delta operations and tracked issues.

#### Scenario: Showing delta application

- **WHEN** applying delta changes
- **THEN** display for each spec:
  - Number of requirements added
  - Number of requirements modified
  - Number of requirements removed
  - Number of requirements renamed
- **AND** use standard output symbols (+ ~ - →) as defined in plx-conventions:
  ```
  Applying changes to specs/user-auth/spec.md:
    + 2 added
    ~ 3 modified
    - 1 removed
    → 1 renamed
  ```

#### Scenario: Showing tracked issues on archive

- **WHEN** archiving a change with tracked issues in frontmatter
- **THEN** display the tracked issue identifiers in the success message
- **AND** format as: `Archived 'change-name' (ISSUE-ID)`

#### Scenario: Archiving change without tracked issues

- **WHEN** archiving a change without tracked issues
- **THEN** display the standard success message without issue reference

### Requirement: Archive Validation

The archive command SHALL validate changes before applying them to ensure data integrity.

#### Scenario: Pre-archive validation

- **WHEN** executing `plx archive change-name`
- **THEN** validate the change structure first
- **AND** only proceed if validation passes
- **AND** show validation errors if it fails

#### Scenario: Force archive without validation

- **WHEN** executing `plx archive change-name --no-validate`
- **THEN** skip validation (unsafe mode)
- **AND** show warning about skipping validation

### Requirement: Architecture Update Suggestion

The archive command SHALL suggest refreshing architecture documentation after applying spec updates.

#### Scenario: Displaying architecture update suggestion

- **GIVEN** an active change with spec updates
- **WHEN** the user runs `plx archive <change-name>` and specs are updated
- **THEN** display a tip message: "Tip: Run /plx/update-architecture to refresh your architecture documentation."
- **AND** display the suggestion in gray/muted color to indicate it is informational, not required
- **AND** continue with archive workflow without requiring any action on the suggestion

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

### Requirement: Entity Subcommands

The archive command SHALL support entity subcommands for explicit type specification.

#### Scenario: Archive specific change

- **WHEN** `plx archive change --id <id>` is executed
- **THEN** archive the specified change
- **AND** follow existing archive process (task check, spec updates, move to archive)

#### Scenario: Archive specific review

- **WHEN** `plx archive review --id <id>` is executed
- **THEN** archive the specified review
- **AND** follow existing review archive process

#### Scenario: Archive change with options

- **WHEN** `plx archive change --id <id> --yes` is executed
- **THEN** skip confirmation prompts
- **AND** proceed with archive

#### Scenario: Archive change skipping specs

- **WHEN** `plx archive change --id <id> --skip-specs` is executed
- **THEN** skip spec update phase
- **AND** proceed with archive

#### Scenario: Change not found via subcommand

- **WHEN** `plx archive change --id nonexistent` is executed
- **AND** no change matches the ID
- **THEN** display error: "Change 'nonexistent' not found"
- **AND** exit with non-zero status

#### Scenario: Review not found via subcommand

- **WHEN** `plx archive review --id nonexistent` is executed
- **AND** no review matches the ID
- **THEN** display error: "Review 'nonexistent' not found"
- **AND** exit with non-zero status

#### Scenario: Interactive selection with subcommand

- **WHEN** `plx archive change` is executed without `--id`
- **THEN** display interactive list of available changes
- **AND** allow user to select one to archive

### Requirement: Legacy Command Deprecation

The archive command SHALL emit deprecation warnings for legacy syntax.

#### Scenario: Deprecation warning on positional argument

- **WHEN** `plx archive <id>` is executed (without subcommand)
- **THEN** emit warning to stderr: "Deprecation: 'plx archive <id>' is deprecated. Use 'plx archive <type> --id <id>' instead."
- **AND** continue with normal archive operation

#### Scenario: Deprecation warning on --type flag

- **WHEN** `plx archive <id> --type review` is executed
- **THEN** emit warning to stderr: "Deprecation: '--type' flag is deprecated. Use 'plx archive review --id <id>' instead."
- **AND** continue with normal archive operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx archive <id> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal archive operation

## Why These Decisions

**Interactive selection**: Reduces typing and helps users see available changes
**Task checking**: Prevents accidental archiving of incomplete work
**Date prefixing**: Maintains chronological order and prevents naming conflicts
**No overwrite**: Preserves historical archives and prevents data loss
**Spec updates before archiving**: Specs in the main directory represent current reality; when a change is deployed and archived, its future state specs become the new reality and must replace the main specs
**Confirmation for spec updates**: Provides visibility into what will change, prevents accidental overwrites, and ensures users understand the impact before specs are modified
**--yes flag for automation**: Allows CI/CD pipelines to archive without interactive prompts while maintaining safety by default for manual use