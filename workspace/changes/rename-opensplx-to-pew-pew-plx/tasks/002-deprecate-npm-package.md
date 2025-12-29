---
status: done
---

# Task: Deprecate npm Package

## End Goal

The old `@appboypov/opensplx` npm package is deprecated with a clear migration message directing users to `@appboypov/pew-pew-plx`.

## Currently

The package `@appboypov/opensplx` is active on npm. Users installing it receive no indication that the name has changed.

## Should

- Old package displays deprecation warning on install
- Deprecation message clearly states the new package name
- Users can still install old package (npm doesn't allow deletion)

## Constraints

- Must be done after code changes are merged and pushed
- Requires npm authentication (via browser login)
- Use Playwright browser automation on npmjs.com

## Acceptance Criteria

- [ ] Running `npm install @appboypov/opensplx` shows deprecation warning
- [ ] Deprecation message includes text "renamed to @appboypov/pew-pew-plx"

## Implementation Checklist

- [x] Ensure code changes from Task 001 are committed and pushed
- [x] Launch Playwright browser
- [x] Navigate to https://www.npmjs.com/login
- [x] Log in with npm credentials (user enters manually)
- [x] Navigate to https://www.npmjs.com/package/@appboypov/opensplx/settings
- [x] Locate deprecation section
- [x] Enter message: "This package has been renamed to @appboypov/pew-pew-plx"
- [x] Submit deprecation
- [x] Verify deprecation banner on package page
- [x] Test by running `npm show @appboypov/opensplx` to confirm deprecated status

## Notes

npm package deprecation via web UI:
1. Settings page has a "Deprecate package" section
2. Enter custom deprecation message
3. Click deprecate button
4. Package remains installable but shows warning
