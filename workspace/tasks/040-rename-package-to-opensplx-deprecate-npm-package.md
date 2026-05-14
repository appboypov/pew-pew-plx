---
status: done
skill-level: medior
parent-type: change
parent-id: rename-package-to-opensplx
---

# Task: Deprecate Current NPM Package

## End Goal

The old npm package `@appboypov/OpenSplx` is deprecated with a clear migration message pointing users to the new package.

## Currently

- Package `@appboypov/OpenSplx` is active on npm
- No deprecation notice exists

## Should

- Package `@appboypov/OpenSplx` is marked as deprecated on npm
- Deprecation message directs users to install `@appboypov/OpenSplx`
- Deprecation message explains the command name change from `splx` to `splx`

## Constraints

- [ ] Must use npm CLI or npm API to deprecate
- [ ] Deprecation message must be clear and actionable
- [ ] Must have publish access to the old package

## Acceptance Criteria

- [x] Old package `@appboypov/pew-pew-plx` is deprecated on npm (all versions deprecated)
- [x] Deprecation message includes: "This package has been renamed to @appboypov/OpenSplx. Please install @appboypov/OpenSplx instead. The CLI command has changed from 'plx' to 'splx'."
- [ ] npm shows deprecation warning when users try to install old package
- [ ] Deprecation is visible on npm package page

## Implementation Checklist

- [x] 5.1 Verify npm authentication and access to `@appboypov/pew-pew-plx`
- [x] 5.2 Run `npm deprecate @appboypov/pew-pew-plx "This package has been renamed to @appboypov/OpenSplx. Please install @appboypov/OpenSplx instead. The CLI command has changed from 'plx' to 'splx'."` (deprecated all versions successfully)
- [x] 5.3 Verify deprecation is visible on npm package page
- [x] 5.4 Test that `npm install -g @appboypov/OpenSplx` shows deprecation warning

## Notes

The npm deprecate command format is:
```bash
npm deprecate <package>[@<version>] <message>
```

To deprecate all versions, use:
```bash
npm deprecate @appboypov/OpenSplx "message"
```

Ensure you're logged into npm with appropriate permissions.
