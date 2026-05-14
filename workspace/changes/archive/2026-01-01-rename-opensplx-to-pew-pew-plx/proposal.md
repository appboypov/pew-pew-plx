# Change: Rename OpenSplx to OpenSplx

## Why

The project display name was rebranded to "OpenSplx" but the package name, repository references, and asset files still use "OpenSplx" / "OpenSplx". This creates inconsistency between the user-facing display name and the technical identifiers.

## What Changes

- **Package name**: `@appboypov/OpenSplx` to `@appboypov/OpenSplx`
- **GitHub repository**: References updated from `appboypov/OpenSplx` to `appboypov/OpenSplx`
- **Asset files**: Rename `OpenSplx_pixel_*.svg` to `pew_pew_splx_pixel_*.svg`
- **Documentation**: Update all "OpenSplx" display text to "OpenSplx"
- **Archived changes**: Update historical references for consistency
- **npm registry**: Deprecate old package, publish under new name
- **GitHub repository**: Rename repository to match new identity

## Non-Changes

- CLI command remains `splx`
- Internal constants (`PLX_DIR_NAME`, `PLX_INTERACTIVE`, etc.) unchanged
- Workspace directory structure unchanged
- Upstream OpenSpec relationship unchanged

## Impact

- Affected files: package.json, README.md, CHANGELOG.md, ARCHITECTURE.md, scripts/, workflows/, archived changes
- Breaking changes: Package name change requires users to reinstall
- Migration: Users must `npm uninstall @appboypov/OpenSplx && npm install @appboypov/OpenSplx`

## Constraints

1. Old npm package must be deprecated with clear migration message
2. GitHub repository rename must happen after code changes are merged
3. Asset files must be renamed before updating references to them
4. GitHub maintains URL redirects from old repository name
