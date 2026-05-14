## ADDED Requirements

### Requirement: Project Identity and Naming

The project SHALL use consistent naming conventions across all artifacts and registries.

#### Scenario: Package naming on npm

- **WHEN** the package is published to npm
- **THEN** the package name SHALL be `@appboypov/OpenSplx`
- **AND** the previous package `@appboypov/OpenSplx` SHALL be deprecated with migration instructions

#### Scenario: Repository naming on GitHub

- **WHEN** accessing the project repository
- **THEN** the repository SHALL be at `github.com/appboypov/OpenSplx`
- **AND** old URLs SHALL redirect automatically

#### Scenario: Display name usage

- **WHEN** displaying the project name in documentation or UI
- **THEN** the display name SHALL be "OpenSplx"
- **AND** asset files SHALL use snake_case prefix `pew_pew_splx_`

#### Scenario: CLI command naming

- **WHEN** users invoke the CLI
- **THEN** the command SHALL remain `splx`
- **AND** internal constants SHALL use `PLX_` prefix
