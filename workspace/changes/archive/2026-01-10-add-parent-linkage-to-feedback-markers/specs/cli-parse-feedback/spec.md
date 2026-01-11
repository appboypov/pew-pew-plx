# cli-parse-feedback Delta

## MODIFIED Requirements

### Requirement: Feedback Marker Detection

The command SHALL detect feedback markers with optional parent linkage using language-aware comment syntax.

#### Scenario: Detecting markers with parent linkage

- **WHEN** a marker includes `{type}:{id} |` prefix (where type is task, change, or spec)
- **THEN** extract the parent type and parent id
- **AND** associate them with the feedback marker

#### Scenario: Detecting markers without parent linkage

- **WHEN** a marker does not include `{type}:{id} |` prefix
- **THEN** set parentType and parentId to null
- **AND** require CLI flag or interactive selection to assign parent

### Requirement: Marker Grouping

The command SHALL group markers by their parent before generating reviews.

#### Scenario: Grouping markers by parent

- **WHEN** markers specify different parent types and IDs
- **THEN** group markers by `{parentType}:{parentId}` key
- **AND** separate markers without parent linkage into an unassigned group

#### Scenario: Handling unassigned markers with CLI fallback

- **WHEN** unassigned markers exist AND CLI flag is provided (--change-id, --spec-id, --task-id)
- **THEN** assign unassigned markers to the CLI-specified parent
- **AND** merge with existing group if one exists for that parent

#### Scenario: Handling unassigned markers interactively

- **WHEN** unassigned markers exist AND no CLI flag is provided AND interactive mode is enabled
- **THEN** prompt user to select a parent type (task, change, spec)
- **AND** prompt user to select a specific parent ID from available options
- **AND** assign unassigned markers to the selected parent

#### Scenario: Handling unassigned markers in non-interactive mode

- **WHEN** unassigned markers exist AND no CLI flag is provided AND interactive mode is disabled
- **THEN** display error: "Found N markers without parent linkage. Use --change-id, --spec-id, or --task-id"
- **AND** exit with code 1

### Requirement: Multi-Review Generation

The command SHALL create multiple reviews when markers have different parents.

#### Scenario: Single parent group

- **WHEN** all markers (after unassigned handling) share the same parent
- **THEN** create a single review with the specified review name

#### Scenario: Multiple parent groups

- **WHEN** markers have different parents (after unassigned handling)
- **THEN** create separate reviews for each parent group
- **AND** suffix review names: `{reviewName}-{parentType}-{index}`
- **AND** display summary of all created reviews

#### Scenario: Multi-review JSON output

- **WHEN** multiple reviews are created AND --json flag is provided
- **THEN** output JSON with reviews array containing all created reviews
- **AND** include totalMarkers and totalTasks counts

## REMOVED Requirements

### Requirement: Spec Impact Tracking

_(Removed - replaced by parent linkage)_

#### Scenario: Detecting spec-impacting feedback

_(Removed)_

#### Scenario: Standard feedback without spec impact

_(Removed)_
