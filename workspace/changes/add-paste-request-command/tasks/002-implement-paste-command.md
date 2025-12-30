---
status: to-do
---

# Task: Implement PasteCommand class and CLI registration

## End Goal

A `plx paste request` command that saves clipboard content to `workspace/drafts/request.md`.

## Currently

No paste command exists in the CLI.

## Should

- `PasteCommand` class in `src/commands/paste.ts`
- CLI registration in `src/cli/index.ts`
- Support for `--json` flag

## Constraints

- [ ] Follow existing command patterns from `src/commands/complete.ts`
- [ ] Follow CLI registration pattern from `src/cli/index.ts`
- [ ] Use `FileSystemUtils.writeFile()` for file operations

## Acceptance Criteria

- [ ] `plx paste request` writes clipboard to `workspace/drafts/request.md`
- [ ] `--json` flag outputs machine-readable JSON
- [ ] Error handling matches existing command patterns

## Implementation Checklist

- [ ] Create `src/commands/paste.ts` file
- [ ] Implement `PasteCommand` class with `request()` method
- [ ] Add import for `PasteCommand` in `src/cli/index.ts`
- [ ] Register `paste` parent command with description
- [ ] Register `request` subcommand with `--json` option
- [ ] Implement action handler with try/catch error handling

## Notes

The command should use `ora().succeed()` for success messages, matching the existing CLI style.
