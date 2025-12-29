## ADDED Requirements

### Requirement: Project Identity and Naming

The project SHALL use consistent naming conventions across all artifacts and registries.

#### Scenario: Package naming on npm

- **WHEN** the package is published to npm
- **THEN** the package name SHALL be `@appboypov/pew-pew-plx`
- **AND** the previous package `@appboypov/opensplx` SHALL be deprecated with migration instructions

#### Scenario: Repository naming on GitHub

- **WHEN** accessing the project repository
- **THEN** the repository SHALL be at `github.com/appboypov/pew-pew-plx`
- **AND** old URLs SHALL redirect automatically

#### Scenario: Display name usage

- **WHEN** displaying the project name in documentation or UI
- **THEN** the display name SHALL be "Pew Pew Plx"
- **AND** asset files SHALL use snake_case prefix `pew_pew_plx_`

#### Scenario: CLI command naming

- **WHEN** users invoke the CLI
- **THEN** the command SHALL remain `plx`
- **AND** internal constants SHALL use `PLX_` prefix
