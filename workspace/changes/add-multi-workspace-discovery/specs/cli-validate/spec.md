## ADDED Requirements

### Requirement: Multi-Workspace Validation
The validate command SHALL discover and validate items from all workspace directories when using bulk validation flags.

#### Scenario: Validate all across workspaces
- **WHEN** executing `plx validate --all`
- **AND** multiple workspaces exist
- **THEN** validate all changes and specs from all discovered workspaces
- **AND** display items with project name prefix in output
- **AND** include workspace context in summary

#### Scenario: Validate changes across workspaces
- **WHEN** executing `plx validate --changes`
- **AND** multiple workspaces exist
- **THEN** validate all changes from all discovered workspaces
- **AND** display results grouped or prefixed by workspace

#### Scenario: Validate specs across workspaces
- **WHEN** executing `plx validate --specs`
- **AND** multiple workspaces exist
- **THEN** validate all specs from all discovered workspaces
- **AND** display results grouped or prefixed by workspace

### Requirement: Workspace Filter Flag
The validate command SHALL support a `--workspace` flag to filter validation to a specific workspace.

#### Scenario: Filter validation to workspace
- **WHEN** executing `plx validate --all --workspace project-a`
- **THEN** only validate items from project-a workspace
- **AND** do not prefix items with project name in output

#### Scenario: Direct item validation with workspace prefix
- **WHEN** executing `plx validate project-a/add-feature`
- **THEN** resolve the item from project-a workspace
- **AND** validate that specific item

## MODIFIED Requirements

### Requirement: Item type detection and ambiguity handling
The validate command SHALL handle ambiguous names and explicit type overrides, considering workspace prefixes in multi-workspace mode.

#### Scenario: Direct item validation with automatic type detection
- **WHEN** executing `plx validate <item-name>`
- **AND** single workspace exists
- **THEN** if `<item-name>` uniquely matches a change or a spec, validate that item

#### Scenario: Ambiguity between workspaces
- **GIVEN** `<item-name>` exists in multiple workspaces
- **WHEN** executing `plx validate <item-name>`
- **THEN** print an ambiguity error explaining the multiple matches
- **AND** suggest using workspace prefix (e.g., `project-a/item-name`)
- **AND** exit with code 1 without performing validation

#### Scenario: Unknown item name in multi-workspace
- **WHEN** the `<item-name>` matches neither a change nor a spec in any workspace
- **THEN** print a not-found error
- **AND** show nearest-match suggestions from all workspaces when available
- **AND** exit with code 1

### Requirement: Bulk and filtered validation
The validate command SHALL support flags for bulk validation (--all) and filtered validation by type (--changes, --specs), aggregating across all discovered workspaces.

#### Scenario: Validate everything in multi-workspace
- **WHEN** executing `plx validate --all`
- **AND** multiple workspaces exist
- **THEN** validate all changes and specs from all workspaces
- **AND** display a summary showing passed/failed items per workspace
- **AND** exit with code 1 if any validation fails

#### Scenario: JSON output schema for multi-workspace bulk validation
- **WHEN** executing `plx validate --all --json` in multi-workspace mode
- **THEN** output includes additional fields per item:
  - `workspacePath`: Absolute path to workspace
  - `projectName`: Project name for prefix
- **AND** summary includes per-workspace breakdown
