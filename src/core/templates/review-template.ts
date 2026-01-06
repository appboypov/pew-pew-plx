export const reviewTemplate = (): string => `# Review Guidelines

## Purpose
This file defines how code reviews should be conducted in this project.
Run \`/plx:refine-review\` to populate project-specific review scope.

## Review Config
\`\`\`yaml
review_types: [implementation, architecture]
feedback_format: marker
checklist_level: standard
\`\`\`

## Feedback Format
\`\`\`
#FEEDBACK #TODO | {feedback}
#FEEDBACK #TODO | {feedback} (spec:<spec-id>)
\`\`\`

## Review Scope

### Critical Paths
<!-- Files that affect many others; changes here need careful review -->

### Security-Sensitive
<!-- Authentication, authorization, input validation, data handling -->

### Performance-Critical
<!-- Hot paths, frequently called code, resource-intensive operations -->

### Public API Surface
<!-- Exported interfaces, public methods, external contracts -->

### State Management
<!-- Global state, caches, session handling, data persistence -->

### Configuration
<!-- Environment configs, feature flags, secrets handling -->

### External Dependencies
<!-- Third-party integrations, API clients, SDK usage -->

## Review Checklist
- [ ] Code follows project conventions
- [ ] Changes match spec requirements
- [ ] Tests cover new functionality
- [ ] Error handling is appropriate
- [ ] Documentation updated
- [ ] No security vulnerabilities introduced
- [ ] Performance impact considered
`;
