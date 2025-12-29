---
status: in-progress
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

- [ ] `npm view @appboypov/pew-pew-plx` shows package info
- [ ] `npm install -g @appboypov/pew-pew-plx` succeeds
- [ ] `plx --version` outputs expected version

## Implementation Checklist

- [ ] Ensure Tasks 001-003 are complete
- [ ] Pull latest changes to ensure package.json has new name
- [ ] Run `pnpm run build` to ensure dist is up to date
- [ ] Run `pnpm run check:pack-version` to verify tarball
- [ ] Run `npm publish` (or follow standard release workflow)
- [ ] Verify package appears on npmjs.com
- [ ] Test installation in clean environment
- [ ] Verify CLI works after global install

## Notes

First publish creates the package on npm registry. Subsequent releases follow normal changeset workflow.
