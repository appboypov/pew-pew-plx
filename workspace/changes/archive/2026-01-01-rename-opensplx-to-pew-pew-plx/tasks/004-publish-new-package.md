---
status: done
---

# Task: Publish New Package

## End Goal

The first version of `@appboypov/pew-pew-plx` is published to npm and installable by users.

## Currently

Only `@appboypov/opensplx` exists on npm. The new package name has no published versions.

## Should

- `@appboypov/pew-pew-plx` is published on npm
- Version matches current package.json version
- Package is installable via `npm install -g @appboypov/pew-pew-plx`
- `plx --version` outputs correct version after install

## Constraints

- Must be done after GitHub repository is renamed (Task 003)
- Requires npm publish permissions
- Must use standard `npm publish` workflow

## Acceptance Criteria

- [x] `npm view @appboypov/pew-pew-plx` shows package info
- [x] `npm install -g @appboypov/pew-pew-plx` succeeds
- [x] `plx --version` outputs expected version

## Implementation Checklist

- [x] Ensure Tasks 001-003 are complete
- [x] Pull latest changes to ensure package.json has new name
- [x] Run `pnpm run build` to ensure dist is up to date
- [x] Run `pnpm run check:pack-version` to verify tarball
- [x] Run `npm publish` (or follow standard release workflow)
- [x] Verify package appears on npmjs.com
- [x] Test installation in clean environment
- [x] Verify CLI works after global install

## Notes

First publish creates the package on npm registry. Subsequent releases follow normal changeset workflow.
