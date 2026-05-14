# Change: Rename Package to OpenSplx

## Why

The package was originally named "OpenSplx" as a temporary fork name. We need to rename it back to "OpenSplx" to align with the original project identity and provide a more professional, maintainable brand. This includes renaming the CLI command from `splx` to `splx`, updating the package name, deprecating the current package, and updating all references throughout the codebase.

## What Changes

- **BREAKING**: CLI command renamed from `splx` to `splx`
- **BREAKING**: Package name changed from `@appboypov/OpenSplx` to `@appboypov/OpenSplx`
- **BREAKING**: Repository URL updated from `appboypov/OpenSplx` to `appboypov/OpenSplx`
- All occurrences of "OpenSplx", "splx", and "Splx" renamed to "OpenSplx" and "splx" throughout:
  - Source code files
  - Documentation (README.md, ARCHITECTURE.md, AGENTS.md, etc.)
  - Templates and generated content
  - Package.json metadata
- Deprecate current npm package `@appboypov/OpenSplx` with migration notice
- Update npm package page for release pipeline using Playwright automation
- Update git repository configuration

## Impact

- Affected specs:
  - `cli-init` - Command name references
  - `cli-*` (all CLI specs) - Command name references
  - `splx-slash-commands` - Slash command names and references
  - `docs-agent-instructions` - Documentation references
  - `splx-conventions` - Naming conventions
- Affected code:
  - `bin/splx.js` → `bin/splx.js`
  - `package.json` - Package name, bin entry, repository URLs
  - All source files with "splx" references
  - All template files
  - All documentation files
  - `.git/config` - Repository URL
- Breaking changes:
  - Existing users must reinstall with new package name
  - All scripts using `splx` command must be updated to `splx`
  - All documentation references to `splx` must be updated
