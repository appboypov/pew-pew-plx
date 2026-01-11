# cli-show Specification

## Purpose
TBD - created by archiving change add-interactive-show-command. Update Purpose after archive.
## Requirements
### Requirement: Top-level show command

The CLI SHALL provide a top-level `show` command for displaying changes and specs with intelligent selection.

#### Scenario: Interactive show selection

- **WHEN** executing `plx show` without arguments
- **THEN** prompt user to select type (change or spec)
- **AND** display list of available items for selected type
- **AND** show the selected item's content

#### Scenario: Non-interactive environments do not prompt

- **GIVEN** stdin is not a TTY or `--no-interactive` is provided or environment variable `PLX_INTERACTIVE=0`
- **WHEN** executing `plx show` without arguments
- **THEN** do not prompt
- **AND** print a helpful hint with examples for `plx show <item>` or `plx change/spec show`
- **AND** exit with code 1

#### Scenario: Direct item display

- **WHEN** executing `plx show <item-name>`
- **THEN** automatically detect if item is a change or spec
- **AND** display the item's content
- **AND** use appropriate formatting based on item type

#### Scenario: Type detection and ambiguity handling

- **WHEN** executing `plx show <item-name>`
- **THEN** if `<item-name>` uniquely matches a change or a spec, show that item
- **AND** if it matches both, print an ambiguity error and suggest `--type change|spec` or using `plx change show`/`plx spec show`
- **AND** if it matches neither, print not-found with nearest-match suggestions

#### Scenario: Explicit type override

- **WHEN** executing `plx show --type change <item>`
- **THEN** treat `<item>` as a change ID and show it (skipping auto-detection)

- **WHEN** executing `plx show --type spec <item>`
- **THEN** treat `<item>` as a spec ID and show it (skipping auto-detection)

### Requirement: Output format options

The show command SHALL support various output formats consistent with existing commands, including tracked issue metadata when available.

#### Scenario: JSON output

- **WHEN** executing `plx show <item> --json`
- **THEN** output the item in JSON format
- **AND** include parsed metadata and structure
- **AND** include `trackedIssues` array if present in frontmatter
- **AND** maintain format consistency with existing change/spec show commands

#### Scenario: Flag scoping and delegation

- **WHEN** showing a change or a spec via the top-level command
- **THEN** accept common flags such as `--json`
- **AND** pass through type-specific flags to the corresponding implementation
  - Change-only flags: `--deltas-only` (alias `--requirements-only` deprecated)
  - Spec-only flags: `--requirements`, `--no-scenarios`, `-r/--requirement`
- **AND** ignore irrelevant flags for the detected type with a warning

### Requirement: Interactivity controls

- The CLI SHALL respect `--no-interactive` to disable prompts.
- The CLI SHALL respect `PLX_INTERACTIVE=0` to disable prompts globally.
- Interactive prompts SHALL only be shown when stdin is a TTY and interactivity is not disabled.

#### Scenario: Change-specific options

- **WHEN** showing a change with `plx show <change-name> --deltas-only`
- **THEN** display only the deltas in JSON format
- **AND** maintain compatibility with existing change show options

#### Scenario: Spec-specific options  

- **WHEN** showing a spec with `plx show <spec-id> --requirements`
- **THEN** display only requirements in JSON format
- **AND** support other spec options (--no-scenarios, -r)
- **AND** maintain compatibility with existing spec show options

### Requirement: Deprecation Warning

The show command SHALL emit deprecation warnings directing users to the new `plx get` equivalents.

#### Scenario: Deprecation warning on show

- **WHEN** `plx show <item>` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx show' is deprecated. Use 'plx get <type> --id <item>' instead."
- **AND** continue with normal show operation

#### Scenario: Deprecation warning with type detection

- **WHEN** `plx show my-change` is executed
- **AND** `my-change` is detected as a change
- **THEN** emit warning: "Deprecation: 'plx show' is deprecated. Use 'plx get change --id my-change' instead."

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx show <item> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal show operation

#### Scenario: JSON output unaffected by deprecation

- **WHEN** `plx show <item> --json` is executed
- **THEN** deprecation warning goes to stderr
- **AND** JSON output goes to stdout
- **AND** JSON remains valid and parseable

