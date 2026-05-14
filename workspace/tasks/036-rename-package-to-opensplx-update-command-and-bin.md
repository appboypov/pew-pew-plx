---
status: done
skill-level: medior
parent-type: change
parent-id: rename-package-to-opensplx
---

# Task: Update Command and Bin File

## End Goal

The CLI command is renamed from `splx` to `splx` and the bin file is updated accordingly.

## Currently

- CLI command is `splx` defined in `bin/splx.js`
- Package.json bin entry points to `splx`
- All command references use `splx`

## Should

- CLI command is `splx` defined in `bin/splx.js`
- Package.json bin entry points to `splx`
- Bin file renamed from `splx.js` to `splx.js`

## Constraints

- [ ] Must maintain backward compatibility during transition (consider deprecation notice)
- [ ] Bin file must remain executable
- [ ] All imports must be updated

## Acceptance Criteria

- [x] `bin/splx.js` renamed to `bin/splx.js`
- [x] `package.json` bin entry updated to `"splx": "./bin/splx.js"`
- [x] Bin file content updated if it references the command name
- [x] `splx --version` works after build
- [x] All references to `bin/splx.js` in code updated

## Implementation Checklist

- [x] 1.1 Rename `bin/splx.js` to `bin/splx.js`
- [x] 1.2 Update `package.json` bin entry from `"splx": "./bin/splx.js"` to `"splx": "./bin/splx.js"`
- [x] 1.3 Check bin file content for any hardcoded `splx` references
- [x] 1.4 Update any imports or references to `bin/splx.js` in source code
- [x] 1.5 Update build scripts if they reference `bin/splx.js`
- [x] 1.6 Test that `splx --version` works after build

## Notes

The bin file is a simple entry point that imports the CLI. Check if it has any hardcoded references to the command name.
