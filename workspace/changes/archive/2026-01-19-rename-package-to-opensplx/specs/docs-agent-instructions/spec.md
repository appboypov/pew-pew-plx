## MODIFIED Requirements

### Requirement: Documentation Branding

All agent instruction documentation SHALL reference "OpenSplx" instead of "OpenSplx" and use `splx` command instead of `splx`.

#### Scenario: AGENTS.md content

- **WHEN** generating or updating `workspace/AGENTS.md`
- **THEN** all references to "OpenSplx" are replaced with "OpenSplx"
- **AND** all command examples use `splx` instead of `splx`
- **AND** all package references use `@appboypov/OpenSplx` instead of `@appboypov/OpenSplx`

#### Scenario: README.md content

- **WHEN** updating README.md
- **THEN** title and all references use "OpenSplx"
- **AND** installation instructions use `@appboypov/OpenSplx`
- **AND** all command examples use `splx`

#### Scenario: ARCHITECTURE.md content

- **WHEN** updating ARCHITECTURE.md
- **THEN** all references to "OpenSplx" are replaced with "OpenSplx"
- **AND** all command examples use `splx`
- **AND** repository references use `appboypov/OpenSplx`
