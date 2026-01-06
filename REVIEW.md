# Review Guidelines

## Purpose
This file defines how code reviews should be conducted in this project.
Run `/plx:refine-review` to populate project-specific review scope.

## Review Config
```yaml
review_types: [implementation, architecture]
feedback_format: marker
checklist_level: standard
```

## Feedback Format
```
#FEEDBACK #TODO | {feedback}
#FEEDBACK #TODO | {feedback} (spec:<spec-id>)
```

## Review Scope

### Architecture Patterns
- Command pattern: `src/commands/*.ts` — each command is a class with execute()
- Service pattern: `src/services/*.ts` — shared business logic
- Template pattern: `src/core/templates/*.ts` — string templates for file generation
- Configurator pattern: `src/core/configurators/*.ts` — AI tool configuration

### Project Conventions
- ESLint config: `.eslintrc.json`
- TypeScript strict mode: `tsconfig.json`
- File naming: kebab-case for files, PascalCase for classes
- Command structure: verb-entity pattern (`plx get change`, `plx validate spec`)
- Test files: `*.test.ts` colocated in `test/` mirror of `src/`

### Critical Paths
- `src/cli/index.ts` — main CLI entry point, affects all commands
- `src/core/templates/slash-command-templates.ts` — generates 600+ provider files
- `src/core/templates/agents-template.ts` — generates AGENTS.md instructions
- `src/core/configurators/slash/registry.ts` — controls which tools get configured

### Security-Sensitive
- `src/utils/file-system.ts` — file operations, path traversal risks
- `src/core/global-config.ts` — user configuration handling

### Performance-Critical
- `src/utils/item-discovery.ts` — workspace scanning, called frequently
- `src/core/completions/completion-provider.ts` — shell completion, must be fast

### Public API Surface
- `src/cli/index.ts` — all CLI commands and flags
- `src/core/schemas/` — type definitions for specs, changes, tasks
- Exported types in `src/index.ts`

### State Management
- `src/core/global-config.ts` — global PLX configuration
- `src/core/config.ts` — project-level configuration

### Configuration
- `package.json` — version, dependencies, bin entry
- `vitest.config.ts` — test configuration
- `.github/workflows/` — CI/CD pipelines

### Package Adherence
- **Commander.js** — all CLI parsing; no manual argv handling
- **Inquirer** — all interactive prompts; no readline/process.stdin
- **Chalk** — all terminal colors; no ANSI escape codes
- **Ora** — all spinners; no custom spinner implementations
- **fs/promises** — all file I/O via `src/utils/file-system.ts` wrapper

### External Dependencies
- Commander.js for CLI parsing
- Inquirer for interactive prompts
- Chalk for terminal styling

## Review Checklist
- [ ] Code follows project conventions
- [ ] Changes match spec requirements
- [ ] Tests cover new functionality
- [ ] Error handling is appropriate
- [ ] Documentation updated
- [ ] No security vulnerabilities introduced
- [ ] Performance impact considered
