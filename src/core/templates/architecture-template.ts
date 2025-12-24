export interface ArchitectureContext {
  description?: string;
}

export const architectureTemplate = (context: ArchitectureContext = {}): string => `# Architecture

## Overview
${context.description || 'TBD - Describe the project purpose and high-level architecture.'}

## Project Setup

### Prerequisites
- TBD

### Installation
- TBD

### Development
- TBD

## Technology Stack

### Core Technologies
- TBD

### Key Dependencies
- TBD

## Project Structure
\`\`\`
TBD - Document folder structure
\`\`\`

## Service Types and Patterns

### Service Architecture
- TBD

### Common Patterns
- TBD

## State Management

### Approach
- TBD

### State Flow
- TBD

## Conventions

### Naming Conventions
- TBD

### Code Organization
- TBD

### Error Handling
- TBD

## API Patterns

### External APIs
- TBD

### Internal APIs
- TBD
`;
