# cli-parse-feedback Specification

## Purpose
TBD - created by archiving change add-review-system. Update Purpose after archive.
## Requirements
### Requirement: Feedback Marker Detection

The command SHALL detect feedback markers using language-aware comment syntax.

#### Scenario: Detecting single-line comment markers

- **WHEN** scanning files with single-line comment syntax
- **THEN** match markers in these formats:
  - `// #FEEDBACK #TODO | {text}` for .js, .ts, .jsx, .tsx, .c, .cpp, .java, .swift, .go, .rs, .dart, .kt, .scala, .m
  - `# #FEEDBACK #TODO | {text}` for .py, .rb, .sh, .bash, .zsh, .yaml, .yml, .toml, .pl, .r
  - `-- #FEEDBACK #TODO | {text}` for .sql, .lua, .hs
  - `; #FEEDBACK #TODO | {text}` for .lisp, .clj, .el

#### Scenario: Detecting block comment markers

- **WHEN** scanning files with block comment syntax
- **THEN** match markers in these formats:
  - `<!-- #FEEDBACK #TODO | {text} -->` for .html, .xml, .svg, .md
  - `/* #FEEDBACK #TODO | {text} */` for .css, .scss, .less

#### Scenario: Detecting spec-impacting feedback

- **WHEN** a marker includes `(spec:<spec-id>)` suffix
- **THEN** extract the spec-id and associate it with the feedback
- **AND** set task's `spec-impact` field to the extracted spec-id

#### Scenario: Standard feedback without spec impact

- **WHEN** a marker does not include `(spec:...)` suffix
- **THEN** set task's `spec-impact` field to `none`

### Requirement: Review Generation

The command SHALL create a review entity from parsed feedback markers.

#### Scenario: Creating review directory structure

- **WHEN** `plx parse feedback <review-name>` is executed
- **THEN** create `workspace/reviews/<review-name>/` directory
- **AND** create `review.md` with metadata
- **AND** create `tasks/` directory with generated task files

#### Scenario: Generating review.md

- **WHEN** creating the review entity
- **THEN** populate review.md with:
  - status: active
  - target-type: feedback-scan
  - target-id: null
  - reviewed-at: current ISO timestamp
  - archived-at: null
  - spec-updates-applied: false
- **AND** include Summary section with marker count
- **AND** include Scope section with scanned files
- **AND** include Spec Impact Findings section with unique spec references

#### Scenario: Generating task files

- **WHEN** feedback markers are found
- **THEN** create one task file per marker in `tasks/` directory
- **AND** name files with pattern `NNN-{kebab-case-summary}.md`
- **AND** include: status, spec-impact frontmatter
- **AND** include: Feedback, End Goal, Currently, Should, Constraints, Acceptance Criteria, Implementation Checklist, Notes sections

### Requirement: Interactive Review Name

The command SHALL prompt for a review name if not provided.

#### Scenario: No review name argument

- **WHEN** `plx parse feedback` is executed without review-name
- **THEN** prompt user for a review name
- **OR** generate default name from timestamp: `review-YYYYMMDD-HHMMSS`

#### Scenario: Review name already exists

- **WHEN** the specified review-name already exists in `workspace/reviews/`
- **THEN** display error: "Review '<review-name>' already exists."
- **AND** exit with code 1

### Requirement: File Scanning

The command SHALL respect project ignore patterns when scanning.

#### Scenario: Respecting .gitignore

- **WHEN** scanning the codebase
- **THEN** exclude files and directories listed in .gitignore
- **AND** exclude common non-source directories: node_modules, dist, build, .git

#### Scenario: Excluding test files by default

- **WHEN** scanning the codebase with default excludes enabled
- **THEN** exclude directories: test/, tests/, __tests__/
- **AND** exclude files matching: *.test.ts, *.test.js, *.spec.ts, *.spec.js

#### Scenario: Excluding AI tool template directories by default

- **WHEN** scanning the codebase with default excludes enabled
- **THEN** exclude AI tool directories: .claude/, .cursor/, .agent/, .qoder/, .codebuddy/, .kilocode/, .roo/, .crush/, .amazonq/, .factory/, .windsurf/, .cospec/, .iflow/, .gemini/, .clinerules/, .opencode/, .augment/, .qwen/, .github/prompts/

#### Scenario: Excluding documentation files by default

- **WHEN** scanning the codebase with default excludes enabled
- **THEN** exclude files: README.md, REVIEW.md, ARCHITECTURE.md, CHANGELOG.md
- **AND** exclude directories: docs/

#### Scenario: Excluding workspace archives by default

- **WHEN** scanning the codebase with default excludes enabled
- **THEN** exclude directories: workspace/changes/archive/, workspace/specs/*/archive/

#### Scenario: Custom exclude patterns via CLI

- **WHEN** `plx parse feedback <name> --exclude "src/legacy/,*.old.ts"` is executed
- **THEN** additionally exclude paths matching the comma-separated patterns

#### Scenario: Disabling default excludes via CLI

- **WHEN** `plx parse feedback <name> --no-default-excludes` is executed
- **THEN** only apply .gitignore and ALWAYS_EXCLUDED patterns
- **AND** scan test files, documentation, and AI tool directories

#### Scenario: Scanning from project root

- **WHEN** executing the command
- **THEN** scan from the current working directory
- **AND** recursively search all subdirectories (respecting ignore patterns)

### Requirement: Output Format

The command SHALL provide clear feedback about the parsing results.

#### Scenario: Text output summary

- **WHEN** parsing completes successfully
- **THEN** display: "Found N feedback markers in M files."
- **AND** display: "Created review '<review-name>' with N tasks."
- **AND** display: "Run 'plx review show <review-name>' to view details."

#### Scenario: JSON output

- **WHEN** `plx parse feedback <review-name> --json` is executed
- **THEN** output JSON object with: reviewId, markersFound, filesScanned, tasksCreated, specImpacts

#### Scenario: No markers found

- **WHEN** no feedback markers are found in the codebase
- **THEN** display: "No feedback markers found."
- **AND** do not create a review entity
- **AND** exit with code 0

### Requirement: Comment Marker Utility

The system SHALL provide a utility for working with language-aware comment markers.

#### Scenario: Getting comment style for file

- **WHEN** determining comment style for a file path
- **THEN** return { prefix, suffix? } based on file extension
- **AND** return { prefix: '//' } for unknown extensions as fallback

#### Scenario: Formatting feedback marker

- **WHEN** formatting a marker for a specific file
- **THEN** use appropriate comment syntax for the file type
- **AND** include spec reference if provided

#### Scenario: Parsing feedback marker

- **WHEN** parsing a line that may contain a feedback marker
- **THEN** return { feedback, specImpact?, line, file } if marker found
- **AND** return null if no marker present

### Requirement: Generic Parent Flags

The parse feedback command SHALL support `--parent-id` and `--parent-type` flags for parent linkage.

#### Scenario: Link feedback to change with explicit type

- **WHEN** `plx parse feedback "name" --parent-id <id> --parent-type change` is executed
- **THEN** create review linked to the specified change
- **AND** set review.md frontmatter: target-type: change, target-id: <id>

#### Scenario: Link feedback to spec with explicit type

- **WHEN** `plx parse feedback "name" --parent-id <id> --parent-type spec` is executed
- **THEN** create review linked to the specified spec
- **AND** set review.md frontmatter: target-type: spec, target-id: <id>

#### Scenario: Link feedback to task with explicit type

- **WHEN** `plx parse feedback "name" --parent-id <id> --parent-type task` is executed
- **THEN** create review linked to the specified task
- **AND** set review.md frontmatter: target-type: task, target-id: <id>

#### Scenario: Auto-detect parent type

- **WHEN** `plx parse feedback "name" --parent-id <id>` is executed (without --parent-type)
- **AND** `<id>` matches exactly one parent type (change, spec, or task)
- **THEN** use the detected type
- **AND** create review with correct target-type frontmatter

#### Scenario: Ambiguous parent ID

- **WHEN** `plx parse feedback "name" --parent-id <id>` is executed
- **AND** `<id>` matches multiple parent types
- **THEN** display error: "Ambiguous parent ID '<id>'. Use --parent-type to specify: change, spec, task"
- **AND** exit with non-zero status

#### Scenario: Parent ID not found

- **WHEN** `plx parse feedback "name" --parent-id <id>` is executed
- **AND** `<id>` matches no existing parent
- **THEN** display error: "Parent '<id>' not found"
- **AND** exit with non-zero status

#### Scenario: Invalid parent type

- **WHEN** `plx parse feedback "name" --parent-id <id> --parent-type invalid` is executed
- **THEN** display error with valid options: change, spec, task
- **AND** exit with non-zero status

### Requirement: Legacy Flag Deprecation

The parse feedback command SHALL emit deprecation warnings for legacy entity-specific flags.

#### Scenario: Deprecation warning on --change-id

- **WHEN** `plx parse feedback "name" --change-id <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: '--change-id' is deprecated. Use '--parent-id <id> --parent-type change' instead."
- **AND** continue with normal operation

#### Scenario: Deprecation warning on --spec-id

- **WHEN** `plx parse feedback "name" --spec-id <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: '--spec-id' is deprecated. Use '--parent-id <id> --parent-type spec' instead."
- **AND** continue with normal operation

#### Scenario: Deprecation warning on --task-id

- **WHEN** `plx parse feedback "name" --task-id <id>` is executed
- **THEN** emit warning to stderr: "Deprecation: '--task-id' is deprecated. Use '--parent-id <id> --parent-type task' instead."
- **AND** continue with normal operation

#### Scenario: Suppressing deprecation warnings

- **WHEN** `plx parse feedback "name" --change-id <id> --no-deprecation-warnings` is executed
- **THEN** do not emit deprecation warning
- **AND** continue with normal operation

