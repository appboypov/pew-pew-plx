---
status: done
---

# Create RELEASE.md Template

## End Goal

A new `release-template.ts` file that exports the RELEASE.md template content with full interactive workflow instructions for changelog, readme, and architecture updates.

## Currently

- `review-template.ts` exists as a pattern to follow
- No release preparation template exists

## Should

- Create `src/core/templates/release-template.ts`
- Export `releaseTemplate()` function returning template string
- Include full Activity XML structure for:
  - Changelog update (source selection, version bump, format, audience, emoji, templates)
  - Readme update (style, sections, badges, audience, templates)
  - Architecture update (refresh workflow)
- Follow the pattern established by `review-template.ts`

## Constraints

- Must be a function returning a string (like `reviewTemplate`)
- Must include interactive workflow guidance using AskUserQuestion pattern
- Must include all format templates inline (keep-a-changelog, simple-list, etc.)
- Must include all style templates inline (minimal, standard, comprehensive, etc.)
- Must include badge URL patterns

## Acceptance Criteria

- [x] File exists at `src/core/templates/release-template.ts`
- [x] Function exports as `releaseTemplate`
- [x] Template includes Purpose section
- [x] Template includes Changelog Update Activity with all options
- [x] Template includes Readme Update Activity with all options
- [x] Template includes Architecture Update Activity
- [x] Template includes Release Checklist section
- [x] TypeScript compiles without errors

## Implementation Checklist

- [x] Create `src/core/templates/release-template.ts`
- [x] Implement `releaseTemplate()` function
- [x] Add Purpose section explaining release preparation
- [x] Add Changelog Update Activity section with:
  - [x] Source selection options
  - [x] Commit range options
  - [x] Version bump configuration
  - [x] Format selection options
  - [x] Audience selection options
  - [x] Emoji level options
  - [x] Format templates (keep-a-changelog, simple-list, github-release)
- [x] Add Readme Update Activity section with:
  - [x] Operation selection options
  - [x] Style selection options
  - [x] Audience selection options
  - [x] Section configuration options
  - [x] Badge configuration options
  - [x] Style templates (minimal, standard, comprehensive, CLI tool, library/package)
  - [x] Badge URL patterns
- [x] Add Architecture Update Activity section
- [x] Add Release Checklist section
- [x] Verify TypeScript compilation

## Notes

Reference the user-provided prompts in the Linear issue for the exact Activity XML structure and content for changelog and readme updates.
