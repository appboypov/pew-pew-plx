---
status: done
skill-level: medior
parent-type: change
parent-id: add-upgrade-command
---

# Task: Implement plx upgrade command

## End Goal

A working `plx upgrade` command that self-updates the CLI binary via npm/pnpm.

## Currently

- `plx update` only refreshes project instruction files
- No way to check for or install CLI updates from within the CLI
- Users must manually run `npm update -g @appboypov/pew-pew-plx`

## Should

- `plx upgrade` checks npm registry for latest version
- Compares against installed version
- Executes package manager to update globally if newer version available
- Supports `--check` flag for version check without install

## Constraints

- [ ] Must not require additional dependencies (use native fetch API)
- [ ] Must detect npm vs pnpm and use the appropriate one
- [ ] Must handle network failures gracefully
- [ ] Must work on macOS, Linux, and Windows

## Acceptance Criteria

- [ ] `plx upgrade` updates CLI when newer version available
- [ ] `plx upgrade` reports "already up to date" when on latest
- [ ] `plx upgrade --check` shows version info without installing
- [ ] Network errors produce clear error messages
- [ ] Package manager detection works correctly

## Implementation Checklist

- [x] 1.1 Create `src/core/upgrade.ts` with UpgradeCommand class
- [x] 1.2 Implement version check using npm registry API (`https://registry.npmjs.org/@appboypov/pew-pew-plx/latest`)
- [x] 1.3 Implement package manager detection (check for pnpm first, fall back to npm)
- [x] 1.4 Implement upgrade execution with `spawn` to stream output
- [x] 1.5 Add `--check` flag support
- [x] 1.6 Register command in `src/cli/index.ts`
- [x] 1.7 Add error handling for network failures and package manager errors

## Notes

- Use native `fetch` (available in Node 18+) to avoid new dependencies
- Package name is `@appboypov/pew-pew-plx`
- Follow existing command patterns in `src/core/` (e.g., `update.ts`, `init.ts`)
