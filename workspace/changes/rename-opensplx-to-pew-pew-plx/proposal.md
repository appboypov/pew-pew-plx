# Change: Rename OpenSplx to Pew Pew Plx

## Why

The project display name was rebranded to "Pew Pew Plx" but the package name, repository references, and asset files still use "OpenSplx" / "opensplx". This creates inconsistency between the user-facing display name and the technical identifiers.

## What Changes

- **Package name**: `@appboypov/opensplx` to `@appboypov/pew-pew-plx`
- **GitHub repository**: References updated from `appboypov/OpenSplx` to `appboypov/pew-pew-plx`
- **Asset files**: Rename `opensplx_pixel_*.svg` to `pew_pew_plx_pixel_*.svg`
- **Documentation**: Update all "OpenSplx" display text to "Pew Pew Plx"
- **Archived changes**: Update historical references for consistency
- **npm registry**: Deprecate old package, publish under new name
- **GitHub repository**: Rename repository to match new identity

## Non-Changes

- CLI command remains `plx`
- Internal constants (`PLX_DIR_NAME`, `PLX_INTERACTIVE`, etc.) unchanged
- Workspace directory structure unchanged
- Upstream OpenSpec relationship unchanged

## Impact

- Affected files: package.json, README.md, CHANGELOG.md, ARCHITECTURE.md, scripts/, workflows/, archived changes
- Breaking changes: Package name change requires users to reinstall
- Migration: Users must `npm uninstall @appboypov/opensplx && npm install @appboypov/pew-pew-plx`

## Constraints

1. Old npm package must be deprecated with clear migration message
2. GitHub repository rename must happen after code changes are merged
3. Asset files must be renamed before updating references to them
4. GitHub maintains URL redirects from old repository name
