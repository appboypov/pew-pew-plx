## MODIFIED Requirements

### Requirement: Package Naming Convention

The package SHALL be named `@appboypov/OpenSplx` and the CLI command SHALL be `splx`.

#### Scenario: Package installation

- **WHEN** installing the package
- **THEN** use `npm install -g @appboypov/OpenSplx`
- **AND** the command is available as `splx`

#### Scenario: Repository references

- **WHEN** referencing the repository
- **THEN** use `appboypov/OpenSplx` as the repository identifier
- **AND** GitHub URLs use `https://github.com/appboypov/OpenSplx`

### Requirement: Command Name Convention

All CLI commands SHALL use `splx` as the base command name.

#### Scenario: Command execution

- **WHEN** executing CLI commands
- **THEN** use `splx` as the command prefix (e.g., `splx init`, `splx get task`)
- **AND** shell completions are generated for `splx` command
