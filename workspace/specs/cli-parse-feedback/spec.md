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
- **THEN** create `openspec/reviews/<review-name>/` directory
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

- **WHEN** the specified review-name already exists in `openspec/reviews/`
- **THEN** display error: "Review '<review-name>' already exists."
- **AND** exit with code 1

### Requirement: File Scanning

The command SHALL respect project ignore patterns when scanning.

#### Scenario: Respecting .gitignore

- **WHEN** scanning the codebase
- **THEN** exclude files and directories listed in .gitignore
- **AND** exclude common non-source directories: node_modules, dist, build, .git

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

