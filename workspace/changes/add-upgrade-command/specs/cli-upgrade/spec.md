## ADDED Requirements

### Requirement: Upgrade Command

The `plx upgrade` command SHALL update the CLI binary to the latest published version.

#### Scenario: Running upgrade when update available
- **WHEN** user runs `plx upgrade`
- **AND** a newer version is available on npm
- **THEN** display current and latest versions
- **AND** execute the appropriate package manager command to update globally
- **AND** display success message with new version

#### Scenario: Running upgrade when already latest
- **WHEN** user runs `plx upgrade`
- **AND** the installed version matches the latest on npm
- **THEN** display message indicating already up to date
- **AND** exit with code 0

### Requirement: Version Check

The upgrade command SHALL check versions against the npm registry before attempting upgrade.

#### Scenario: Checking version
- **WHEN** the command starts
- **THEN** fetch latest version from npm registry for `@appboypov/pew-pew-plx`
- **AND** compare against locally installed version from package.json

#### Scenario: Network failure during version check
- **WHEN** the npm registry is unreachable
- **THEN** display error message about network failure
- **AND** exit with code 1

### Requirement: Check-Only Mode

The command SHALL support a `--check` flag to only report version status without installing.

#### Scenario: Check flag with update available
- **WHEN** user runs `plx upgrade --check`
- **AND** a newer version is available
- **THEN** display current version and available version
- **AND** exit with code 0 without installing

#### Scenario: Check flag when up to date
- **WHEN** user runs `plx upgrade --check`
- **AND** the installed version matches latest
- **THEN** display message indicating already up to date
- **AND** exit with code 0

### Requirement: Package Manager Detection

The command SHALL detect and use the appropriate package manager (npm or pnpm).

#### Scenario: Detecting package manager
- **WHEN** executing the upgrade
- **THEN** detect if pnpm is available and prefer it
- **AND** fall back to npm if pnpm is not available
- **AND** use the `-g` flag for global installation

#### Scenario: Package manager execution
- **WHEN** running the package manager command
- **THEN** execute `<pm> install -g @appboypov/pew-pew-plx@latest`
- **AND** stream output to the terminal
- **AND** report success or failure based on exit code

### Requirement: Clear Distinction from Update

The upgrade command SHALL clearly communicate its purpose vs `plx update`.

#### Scenario: Help text clarity
- **WHEN** user runs `plx upgrade --help`
- **THEN** display description: "Upgrade the PLX CLI to the latest version"
- **AND** note that this differs from `plx update` which refreshes project files

#### Scenario: Upgrade output messaging
- **WHEN** displaying upgrade progress
- **THEN** use messaging like "Upgrading PLX CLI..." not "Updating..."
- **AND** distinguish from project file updates
