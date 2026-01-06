export interface SpecContext {
  name: string;
}

export const specTemplate = (context: SpecContext): string => `# ${context.name} Specification

## Purpose
TBD - Define the purpose and scope of this capability.

## Requirements

### Requirement: Example Requirement
TBD - Describe what the system SHALL provide.

#### Scenario: Example scenario
- **WHEN** TBD
- **THEN** TBD
`;
