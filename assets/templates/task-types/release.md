---
type: release
---

# 🚀 Release Template

Use this template for version bumping, changelog updates, and release preparation.

**Title Format**: `🚀 Prepare release v<version>`

**Examples**:
- 🚀 Prepare release v2.0.0
- 🚀 Prepare release v1.5.3

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 📦 Release Information

### Version
- **Current Version**: <!-- REPLACE: Current version -->
- **New Version**: <!-- REPLACE: New version -->
- **Release Type**: Major / Minor / Patch

### Release Date
- **Target Date**: <!-- REPLACE: Target release date -->

## 📋 Release Checklist

### Pre-Release
- [ ] All planned features are complete
- [ ] All tests pass
- [ ] No critical bugs outstanding
- [ ] Documentation is up to date
- [ ] CHANGELOG is updated

### Version Bump
- [ ] Update version in package.json / pubspec.yaml / etc.
- [ ] Update version constants in code (if any)
- [ ] Update version references in documentation

### Changelog
- [ ] Add new version section to CHANGELOG.md
- [ ] List all notable changes since last release
- [ ] Categorize changes (Added, Changed, Fixed, Removed)
- [ ] Include links to relevant PRs/issues

### Build & Test
- [ ] Run full test suite
- [ ] Build production artifacts
- [ ] Test production build locally

### Release
- [ ] Create git tag
- [ ] Push tag to remote
- [ ] Create GitHub release (if applicable)
- [ ] Publish to package registry (npm, pub.dev, etc.)

### Post-Release
- [ ] Verify package is available
- [ ] Update any dependent projects
- [ ] Announce release (if applicable)

## 📝 Changelog Draft

```markdown
## [<!-- REPLACE: version -->] - <!-- REPLACE: date -->

### Added
- <!-- REPLACE: New features -->

### Changed
- <!-- REPLACE: Changes to existing features -->

### Fixed
- <!-- REPLACE: Bug fixes -->

### Removed
- <!-- REPLACE: Removed features -->
```

## 🚨 Breaking Changes
> List any breaking changes that require user action

- [ ] <!-- REPLACE: Breaking change --> - Migration: <!-- REPLACE: How to migrate -->

## ✅ Completion Criteria
> How do we verify the release is successful?

- [ ] New version is published and installable
- [ ] Changelog accurately reflects changes
- [ ] No regressions in functionality
- [ ] <!-- REPLACE: Additional criteria -->

## 📝 Notes
> Additional context if needed

<!-- REPLACE: Any additional notes -->
