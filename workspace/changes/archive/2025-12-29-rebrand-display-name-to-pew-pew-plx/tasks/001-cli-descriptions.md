---
status: done
---

# Task: Update CLI Command Descriptions

## End Goal

All CLI command `.description()` calls display "OpenSplx" instead of "PLX".

## Currently

CLI commands use "PLX" in their descriptions:
- "Initialize PLX in your project"
- "Update PLX instruction files"
- "Manage PLX change proposals"

## Should

Display "OpenSplx" in user-facing descriptions while keeping `splx` in command usage examples.

## Constraints

- [ ] CLI command name stays as `splx` (lowercase)
- [ ] Only change `.description()` text, not command names or flags
- [ ] Keep command usage examples using `splx` (e.g., "Run 'splx init' first")

## Acceptance Criteria

- [ ] All command descriptions in `src/cli/index.ts` use "OpenSplx"
- [ ] Command descriptions in `src/commands/*.ts` use "OpenSplx"
- [ ] Error messages referencing the CLI use "OpenSplx" for the product, `splx` for commands

## Implementation Checklist

- [x] Update `src/cli/index.ts` - init command description
- [x] Update `src/cli/index.ts` - update command description
- [x] Update `src/cli/index.ts` - change command description
- [x] Update `src/cli/index.ts` - completion command description
- [x] Update `src/commands/config.ts` - config command description
- [x] Update `src/commands/completion.ts` - completion command JSDoc and description
- [x] Update `src/commands/spec.ts` - spec command description

## Notes

Pattern to apply:
- "PLX" as a product name → "OpenSplx"
- "`splx`" as a command → stays as "`splx`"
