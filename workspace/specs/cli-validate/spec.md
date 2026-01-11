# cli-validate Specification

## Purpose
TBD - created by archiving change improve-validate-error-messages. Update Purpose after archive.
## Requirements
### Requirement: Validation SHALL provide actionable remediation steps
Validation output SHALL include specific guidance to fix each error, including expected structure, example headers, and suggested commands to verify fixes.

#### Scenario: No deltas found in change
- **WHEN** validating a change with zero parsed deltas
- **THEN** show error "No deltas found" with guidance:
  - Explain that change specs must include `## ADDED Requirements`, `## MODIFIED Requirements`, `## REMOVED Requirements`, or `## RENAMED Requirements`
  - Remind authors that files must live under `workspace/changes/{id}/specs/<capability>/spec.md`
  - Include an explicit note: "Spec delta files cannot start with titles before the operation headers"
  - Suggest running `plx get change --id {id} --json --deltas-only` for debugging

#### Scenario: Missing required sections
- **WHEN** a required section is missing
- **THEN** include expected header names and a minimal skeleton:
  - For Spec: `## Purpose`, `## Requirements`
  - For Change: `## Why`, `## What Changes`
  - Provide an example snippet of the missing section with placeholder prose ready to copy
  - Mention the quick-reference section in `workspace/AGENTS.md` as the authoritative template

#### Scenario: Missing requirement descriptive text
- **WHEN** a requirement header lacks descriptive text before scenarios
- **THEN** emit an error explaining that `### Requirement:` lines must be followed by narrative text before any `#### Scenario:` headers
  - Show compliant example: "### Requirement: Foo" followed by "The system SHALL ..."
  - Suggest adding 1-2 sentences describing the normative behavior prior to listing scenarios
  - Reference the pre-validation checklist in `workspace/AGENTS.md`

### Requirement: Validator SHALL detect likely misformatted scenarios and warn with a fix
The validator SHALL recognize bulleted lines that look like scenarios (e.g., lines beginning with WHEN/THEN/AND) and emit a targeted warning with a conversion example to `#### Scenario:`.

#### Scenario: Bulleted WHEN/THEN under a Requirement
- **WHEN** bullets that start with WHEN/THEN/AND are found under a requirement without any `#### Scenario:` headers
- **THEN** emit warning: "Scenarios must use '#### Scenario:' headers", and show a conversion template:
```
#### Scenario: Short name
- **WHEN** ...
- **THEN** ...
- **AND** ...
```

### Requirement: All issues SHALL include file paths and structured locations
Error, warning, and info messages SHALL include:
- Source file path (`workspace/changes/{id}/proposal.md`, `.../specs/{cap}/spec.md`)
- Structured path (e.g., `deltas[0].requirements[0].scenarios`)

#### Scenario: Zod validation error
- **WHEN** a schema validation fails
- **THEN** the message SHALL include `file`, `path`, and a remediation hint if applicable

### Requirement: Invalid results SHALL include a Next steps footer in human-readable output
The CLI SHALL append a Next steps footer when the item is invalid and not using `--json`, including:
- Summary line with counts
- Top-3 guidance bullets (contextual to the most frequent or blocking errors)
- A suggestion to re-run with `--json` and/or the debug command

#### Scenario: Change invalid summary
- **WHEN** a change validation fails
- **THEN** print "Next steps" with 2-3 targeted bullets and suggest `plx get change --id <id> --json --deltas-only`

### Requirement: Top-level validate command

The CLI SHALL provide a top-level `validate` command for validating changes and specs with flexible selection options.

#### Scenario: Interactive validation selection

- **WHEN** executing `plx validate` without arguments
- **THEN** prompt user to select what to validate (all, changes, specs, or specific item)
- **AND** perform validation based on selection
- **AND** display results with appropriate formatting

#### Scenario: Non-interactive environments do not prompt

- **GIVEN** stdin is not a TTY or `--no-interactive` is provided or environment variable `PLX_INTERACTIVE=0`
- **WHEN** executing `plx validate` without arguments
- **THEN** do not prompt interactively
- **AND** print a helpful hint listing available commands/flags and exit with code 1

#### Scenario: Direct item validation

- **WHEN** executing `plx validate <item-name>`
- **THEN** automatically detect if item is a change or spec
- **AND** validate the specified item
- **AND** display validation results

### Requirement: Bulk and filtered validation

The validate command SHALL support subcommands for bulk validation (`all`, `changes`, `specs`) and flags for filtered validation by type.

#### Scenario: Validate everything

- **WHEN** executing `plx validate all`
- **THEN** validate all changes in workspace/changes/ (excluding archive)
- **AND** validate all specs in workspace/specs/
- **AND** display a summary showing passed/failed items
- **AND** exit with code 1 if any validation fails

#### Scenario: Scope of bulk validation

- **WHEN** validating with `all` or `changes` subcommand
- **THEN** include all change proposals under `workspace/changes/`
- **AND** exclude the `workspace/changes/archive/` directory

- **WHEN** validating with `specs` subcommand
- **THEN** include all specs that have a `spec.md` under `workspace/specs/<id>/spec.md`

#### Scenario: Validate all changes

- **WHEN** executing `plx validate --changes`
- **THEN** validate all changes in workspace/changes/ (excluding archive)
- **AND** display results for each change
- **AND** show summary statistics

#### Scenario: Validate all specs

- **WHEN** executing `plx validate --specs`
- **THEN** validate all specs in workspace/specs/
- **AND** display results for each spec
- **AND** show summary statistics

### Requirement: Validation options and progress indication

The validate command SHALL support standard validation options (--strict, --json) and display progress during bulk operations.

#### Scenario: Strict validation

- **WHEN** executing `plx validate all --strict`
- **THEN** apply strict validation to all items
- **AND** treat warnings as errors
- **AND** fail if any item has warnings or errors

#### Scenario: JSON output

- **WHEN** executing `plx validate all --json`
- **THEN** output validation results as JSON
- **AND** include detailed issues for each item
- **AND** include summary statistics

#### Scenario: JSON output schema for bulk validation

- **WHEN** executing `plx validate all --json` (or `--changes` / `--specs`)
- **THEN** output a JSON object with the following shape:
  - `items`: Array of objects with fields `{ id: string, type: "change"|"spec", valid: boolean, issues: Issue[], durationMs: number }`
  - `summary`: Object `{ totals: { items: number, passed: number, failed: number }, byType: { change?: { items: number, passed: number, failed: number }, spec?: { items: number, passed: number, failed: number } } }`
  - `version`: String identifier for the schema (e.g., `"1.0"`)
- **AND** exit with code 1 if any `items[].valid === false`

Where `Issue` follows the existing per-item validation report shape `{ level: "ERROR"|"WARNING"|"INFO", path: string, message: string }`.

#### Scenario: Show validation progress

- **WHEN** validating multiple items (`all`, `changes`, or `specs` subcommand)
- **THEN** show progress indicator or status updates
- **AND** indicate which item is currently being validated
- **AND** display running count of passed/failed items

#### Scenario: Concurrency limits for performance

- **WHEN** validating multiple items
- **THEN** run validations with a bounded concurrency (e.g., 4–8 in parallel)
- **AND** ensure progress indicators remain responsive

### Requirement: Item type detection and ambiguity handling

The validate command SHALL handle ambiguous names and explicit type overrides to ensure clear, deterministic behavior.

#### Scenario: Direct item validation with automatic type detection

- **WHEN** executing `plx validate <item-name>`
- **THEN** if `<item-name>` uniquely matches a change or a spec, validate that item

#### Scenario: Ambiguity between change and spec names

- **GIVEN** `<item-name>` exists both as a change and as a spec
- **WHEN** executing `plx validate <item-name>`
- **THEN** print an ambiguity error explaining both matches
- **AND** suggest passing `--type change` or `--type spec`, or using `plx change validate` / `plx spec validate`
- **AND** exit with code 1 without performing validation

#### Scenario: Unknown item name

- **WHEN** the `<item-name>` matches neither a change nor a spec
- **THEN** print a not-found error
- **AND** show nearest-match suggestions when available
- **AND** exit with code 1

#### Scenario: Explicit type override

- **WHEN** executing `plx validate --type change <item>`
- **THEN** treat `<item>` as a change ID and validate it (skipping auto-detection)

- **WHEN** executing `plx validate --type spec <item>`
- **THEN** treat `<item>` as a spec ID and validate it (skipping auto-detection)

### Requirement: Interactivity controls

- The CLI SHALL respect `--no-interactive` to disable prompts.
- The CLI SHALL respect `PLX_INTERACTIVE=0` to disable prompts globally.
- Interactive prompts SHALL only be shown when stdin is a TTY and interactivity is not disabled.

#### Scenario: Disabling prompts via flags or environment

- **WHEN** `plx validate` is executed with `--no-interactive` or with environment `PLX_INTERACTIVE=0`
- **THEN** the CLI SHALL not display interactive prompts
- **AND** SHALL print non-interactive hints or chosen outputs as appropriate

### Requirement: Parser SHALL handle cross-platform line endings
The markdown parser SHALL correctly identify sections regardless of line ending format (LF, CRLF, CR).

#### Scenario: Required sections parsed with CRLF line endings
- **GIVEN** a change proposal markdown saved with CRLF line endings
- **AND** the document contains `## Why` and `## What Changes`
- **WHEN** running `plx validate <change-id>`
- **THEN** validation SHALL recognize the sections and NOT raise parsing errors

### Requirement: Task Skill Level Validation Warning

The CLI SHALL warn in strict mode when tasks are missing the `skill-level` field.

#### Scenario: Warning for missing skill level in strict mode

- **WHEN** user runs `plx validate <change-id> --strict`
- **AND** a task file exists without a `skill-level` field in frontmatter
- **THEN** the system SHALL emit a WARNING (not ERROR)
- **AND** the warning message SHALL indicate which task is missing skill level
- **AND** validation SHALL still pass if no other issues exist

#### Scenario: No warning in non-strict mode

- **WHEN** user runs `plx validate <change-id>` (without --strict)
- **AND** a task file exists without a `skill-level` field
- **THEN** no warning SHALL be emitted for missing skill level

#### Scenario: Valid skill level values

- **WHEN** a task has `skill-level` in frontmatter
- **AND** the value is one of: junior, medior, senior
- **THEN** no warning SHALL be emitted for that field

#### Scenario: Invalid skill level value

- **WHEN** a task has `skill-level` in frontmatter
- **AND** the value is not one of: junior, medior, senior
- **THEN** the system SHALL emit a WARNING about invalid skill level

### Requirement: Entity Subcommands

The validate command SHALL support entity subcommands with singular/plural distinction.

#### Scenario: Validate specific change

- **WHEN** `plx validate change --id <id>` is executed
- **THEN** validate the specified change
- **AND** display validation results

#### Scenario: Validate all changes

- **WHEN** `plx validate changes` is executed
- **THEN** validate all changes in workspace/changes/ (excluding archive)
- **AND** display results for each change
- **AND** show summary statistics

#### Scenario: Validate specific spec

- **WHEN** `plx validate spec --id <id>` is executed
- **THEN** validate the specified spec
- **AND** display validation results

#### Scenario: Validate all specs

- **WHEN** `plx validate specs` is executed
- **THEN** validate all specs in workspace/specs/
- **AND** display results for each spec
- **AND** show summary statistics

#### Scenario: Strict validation with subcommand

- **WHEN** `plx validate change --id <id> --strict` is executed
- **THEN** apply strict validation
- **AND** treat warnings as errors

#### Scenario: JSON output with subcommand

- **WHEN** `plx validate changes --json` is executed
- **THEN** output validation results as JSON
- **AND** include detailed issues for each item

### Requirement: Legacy Command Deprecation

The validate command SHALL emit deprecation warnings for legacy syntax.

#### Scenario: Deprecation warning on positional argument

- **WHEN** `plx validate <item>` is executed (without subcommand)
- **THEN** emit warning to stderr: "Deprecation: 'plx validate <item>' is deprecated. Use 'plx validate <type> --id <item>' instead."
- **AND** continue with normal validation

#### Scenario: Deprecation warning on --changes flag

- **WHEN** `plx validate --changes` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx validate --changes' is deprecated. Use 'plx validate changes' instead."
- **AND** continue with normal validation

#### Scenario: Deprecation warning on --specs flag

- **WHEN** `plx validate --specs` is executed
- **THEN** emit warning to stderr: "Deprecation: 'plx validate --specs' is deprecated. Use 'plx validate specs' instead."
- **AND** continue with normal validation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx validate --changes --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal validation

