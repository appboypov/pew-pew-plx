# List Command Specification

## Purpose

The `plx list` command SHALL provide developers with a quick overview of all active changes in the project, showing their names and task completion status.
## Requirements
### Requirement: Command Execution
The command SHALL scan and analyze either active changes or specs based on the selected mode.

#### Scenario: Scanning for changes (default)
- **WHEN** `plx list` is executed without flags
- **THEN** scan the `workspace/changes/` directory for change directories
- **AND** exclude the `archive/` subdirectory from results
- **AND** trigger auto-migration if legacy `tasks.md` exists without `tasks/` directory
- **AND** parse each change's `tasks/` directory to count task completion across all task files

#### Scenario: Scanning for specs
- **WHEN** `plx list --specs` is executed
- **THEN** scan the `workspace/specs/` directory for capabilities
- **AND** read each capability's `spec.md`
- **AND** parse requirements to compute requirement counts

### Requirement: Task Counting

The command SHALL accurately count task completion status by aggregating across all task files in the `tasks/` directory, ignoring checkboxes under Constraints and Acceptance Criteria sections.

#### Scenario: Counting tasks in tasks directory

- **WHEN** parsing a change's task files
- **THEN** scan the `tasks/` directory for files matching `NNN-*.md` pattern
- **AND** count tasks in each file matching these patterns:
  - Completed: Lines containing `- [x]`
  - Incomplete: Lines containing `- [ ]`
- **AND** ignore checkboxes under `## Constraints` header
- **AND** ignore checkboxes under `## Acceptance Criteria` header
- **AND** calculate aggregate total as sum of all task files' completed and incomplete counts

### Requirement: Output Format
The command SHALL display items in a clear, readable table format with mode-appropriate progress or counts, including tracked issue references when available.

#### Scenario: Displaying change list (default)
- **WHEN** displaying the list of changes
- **THEN** show a table with columns:
  - Change name (directory name)
  - Tracked issue identifier (if present in frontmatter, e.g., "(SM-123)")
  - Task progress (e.g., "3/5 tasks" or "✓ Complete")

#### Scenario: Displaying change with tracked issue
- **WHEN** a change has `tracked-issues` in proposal.md frontmatter
- **THEN** display the first issue identifier in parentheses after the change name
- **AND** format as: `change-name (ISSUE-ID) [task progress]`

#### Scenario: Displaying change without tracked issue
- **WHEN** a change has no `tracked-issues` in proposal.md frontmatter
- **THEN** display the change without issue identifier
- **AND** format as: `change-name [task progress]`

#### Scenario: Displaying spec list
- **WHEN** displaying the list of specs
- **THEN** show a table with columns:
  - Spec id (directory name)
  - Requirement count (e.g., "requirements 12")

### Requirement: Flags
The command SHALL accept flags to select the noun being listed.

#### Scenario: Selecting specs
- **WHEN** `--specs` is provided
- **THEN** list specs instead of changes

#### Scenario: Selecting changes
- **WHEN** `--changes` is provided
- **THEN** list changes explicitly (same as default behavior)

### Requirement: Empty State
The command SHALL provide clear feedback when no items are present for the selected mode.

#### Scenario: Handling empty state (changes)
- **WHEN** no active changes exist (only archive/ or empty changes/)
- **THEN** display: "No active changes found."

#### Scenario: Handling empty state (specs)
- **WHEN** no specs directory exists or contains no capabilities
- **THEN** display: "No specs found."

### Requirement: Error Handling

The command SHALL gracefully handle missing files and directories with appropriate messages.

#### Scenario: Missing tasks directory

- **WHEN** a change directory has no `tasks/` directory and no `tasks.md` file
- **THEN** display the change with "No tasks" status

#### Scenario: Empty tasks directory

- **WHEN** a change directory has an empty `tasks/` directory
- **THEN** display the change with "No tasks" status

#### Scenario: Missing changes directory

- **WHEN** `workspace/changes/` directory doesn't exist
- **THEN** display error: "No PLX changes directory found. Run 'plx init' first."
- **AND** exit with code 1

### Requirement: Sorting

The command SHALL maintain consistent ordering of changes for predictable output.

#### Scenario: Ordering changes

- **WHEN** displaying multiple changes
- **THEN** sort them in alphabetical order by change name

### Requirement: Review Listing Mode

The command SHALL support listing reviews alongside changes and specs.

#### Scenario: Listing reviews

- **WHEN** `plx list --reviews` is executed
- **THEN** scan the `workspace/reviews/` directory for review directories
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

### Requirement: Deprecation Warning

The list command SHALL emit deprecation warnings directing users to the new `plx get` equivalents.

#### Scenario: Deprecation warning on list

- **WHEN** `plx list` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx list' is deprecated. Use 'plx get changes' instead."
- **AND** continue with normal list operation

#### Scenario: Deprecation warning on list specs

- **WHEN** `plx list --specs` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx list --specs' is deprecated. Use 'plx get specs' instead."
- **AND** continue with normal list operation

#### Scenario: Deprecation warning on list reviews

- **WHEN** `plx list --reviews` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx list --reviews' is deprecated. Use 'plx get reviews' instead."
- **AND** continue with normal list operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx list --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal list operation

#### Scenario: JSON output unaffected by deprecation

- **WHEN** `plx list --json` is executed
- **THEN** deprecation warning goes to stderr
- **AND** JSON output goes to stdout
- **AND** JSON remains valid and parseable

## Why

Developers need a quick way to:
- See what changes are in progress
- Identify which changes are ready to archive
- Understand the overall project evolution status
- Get a bird's-eye view without opening multiple files

This command provides that visibility with minimal effort, following Pew Pew Plx's philosophy of simplicity and clarity.