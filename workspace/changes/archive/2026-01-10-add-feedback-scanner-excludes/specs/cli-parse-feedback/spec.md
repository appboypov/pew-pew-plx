## MODIFIED Requirements

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
