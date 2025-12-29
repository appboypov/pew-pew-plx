---
status: done
---

# Task: Update CLI Command Descriptions

## End Goal

All CLI command `.description()` calls display "Pew Pew Plx" instead of "PLX".

## Currently

CLI commands use "PLX" in their descriptions:
- "Initialize PLX in your project"
- "Update PLX instruction files"
- "Manage PLX change proposals"

## Should

Display "Pew Pew Plx" in user-facing descriptions while keeping `plx` in command usage examples.

## Constraints

- [ ] CLI command name stays as `plx` (lowercase)
- [ ] Only change `.description()` text, not command names or flags
- [ ] Keep command usage examples using `plx` (e.g., "Run 'plx init' first")

## Acceptance Criteria

- [ ] All command descriptions in `src/cli/index.ts` use "Pew Pew Plx"
- [ ] Command descriptions in `src/commands/*.ts` use "Pew Pew Plx"
- [ ] Error messages referencing the CLI use "Pew Pew Plx" for the product, `plx` for commands

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
- "PLX" as a product name → "Pew Pew Plx"
- "`plx`" as a command → stays as "`plx`"
