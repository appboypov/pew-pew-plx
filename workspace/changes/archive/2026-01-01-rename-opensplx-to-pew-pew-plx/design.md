# Design: Rename OpenSplx to Pew Pew Plx

## Overview

This change completes the rebrand by updating all remaining "OpenSplx" / "opensplx" references to use the new identity:
- Package name: `@appboypov/pew-pew-plx`
- Repository: `github.com/appboypov/pew-pew-plx`
- Display name: "Pew Pew Plx"

## Scope Analysis

### Files Requiring Updates (14 total)

| File | Changes |
|------|---------|
| `package.json` | name, homepage, repository URL |
| `README.md` | GitHub links, npm badges, install command, asset paths |
| `CHANGELOG.md` | Title, release notes |
| `ARCHITECTURE.md` | Title, descriptions, directory structure diagram |
| `scripts/pack-version-check.mjs` | Log messages, binary path |
| `.github/workflows/release-prepare.yml` | Repository condition |
| `assets/opensplx_pixel_*.svg` | Rename files |
| 8 archived change files | GitHub URLs, display names |

### Asset File Renames

```
assets/opensplx_pixel_dark.svg  → assets/pew_pew_plx_pixel_dark.svg
assets/opensplx_pixel_light.svg → assets/pew_pew_plx_pixel_light.svg
```

Legacy OpenSpec assets can remain for historical reference:
- `assets/openspec_pixel_dark.svg`
- `assets/openspec_pixel_light.svg`

## Execution Phases

### Phase 1: Code Changes
1. Rename asset files (must happen first)
2. Update package.json
3. Update documentation (README, CHANGELOG, ARCHITECTURE)
4. Update scripts and workflows
5. Update archived change references
6. Verify with build and grep

### Phase 2: npm Migration
1. Merge and push code changes
2. Use Playwright to navigate npmjs.com
3. Deprecate `@appboypov/opensplx` with message: "This package has been renamed to @appboypov/pew-pew-plx"
4. Publish first version under new package name

### Phase 3: GitHub Rename
1. Use Playwright to navigate github.com settings
2. Rename repository from `OpenSplx` to `pew-pew-plx`
3. GitHub automatically maintains redirects
4. Update local git remote (optional)

## Naming Conventions

| Context | Format | Value |
|---------|--------|-------|
| npm package | kebab-case | `@appboypov/pew-pew-plx` |
| GitHub repo | kebab-case | `pew-pew-plx` |
| Display name | Title Case | "Pew Pew Plx" |
| Asset files | snake_case | `pew_pew_plx_pixel_*.svg` |

## Verification Checklist

- [ ] `pnpm run build` passes
- [ ] `pnpm test` passes
- [ ] `grep -ri "opensplx" .` returns no matches (excluding .git)
- [ ] README badges render correctly after npm publish
- [ ] Old package shows deprecation warning
- [ ] GitHub redirects work from old URL
