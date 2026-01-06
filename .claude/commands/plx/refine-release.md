---
name: Pew Pew Plx: Refine Release
description: Create or update RELEASE.md.
category: Pew Pew Plx
tags: [plx, release, documentation]
---
<!-- PLX:START -->
**Guardrails**
- Reference @RELEASE.md template structure.
- Preserve existing release configuration.
- Use question tool to guide user through configuration options.
- Write final selections to RELEASE.md Config section.

## Configuration Options Reference

### Format Options
| Format | Description | Best For |
|--------|-------------|----------|
| `keep-a-changelog` | Standard format following keepachangelog.com with Added/Changed/Deprecated/Removed/Fixed/Security sections | Open source projects, libraries, packages with structured release notes |
| `simple-list` | Minimal bullet-point list with prefixed categories (Added:, Changed:, Fixed:) | Internal projects, rapid releases, minimal documentation needs |
| `github-release` | GitHub Releases compatible format with "What's Changed" sections and PR/contributor links | GitHub-hosted projects using GitHub Releases feature |

### Style Options
| Style | Sections Included | Best For |
|-------|-------------------|----------|
| `minimal` | Title, description, install, usage | Simple utilities, scripts, internal tools |
| `standard` | Above + features, contributing, license | Most open source projects |
| `comprehensive` | Full documentation with ToC, API, config, FAQ | Libraries with complex APIs |
| `cli-tool` | Commands, flags, examples, options tables | Command-line applications |
| `library` | API reference, class docs, method signatures | SDK/API packages |

### Audience Options
| Audience | Focus | Tone |
|----------|-------|------|
| `technical` | Implementation details, API changes, migration guides | Developer-centric, precise |
| `semi-technical` | Features and fixes with light technical context | Balanced for mixed readers |
| `general-interest` | User-facing improvements, benefits | Non-technical, benefit-focused |

### Emoji Levels
| Level | Usage | Example |
|-------|-------|---------|
| `none` | No emojis anywhere | "Added new feature" |
| `minimal` | Section headers only | "## ✨ Added" |
| `standard` | Headers and major items | "- ✨ New dashboard view" |

### Badge Patterns (shields.io)
```
Build:     ![Build](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/WORKFLOW.yml?branch=main)
Coverage:  ![Coverage](https://img.shields.io/codecov/c/github/OWNER/REPO)
npm:       ![npm](https://img.shields.io/npm/v/PACKAGE)
Downloads: ![Downloads](https://img.shields.io/npm/dm/PACKAGE)
License:   ![License](https://img.shields.io/npm/l/PACKAGE)
Stars:     ![Stars](https://img.shields.io/github/stars/OWNER/REPO)
Issues:    ![Issues](https://img.shields.io/github/issues/OWNER/REPO)
PRs:       ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
TypeScript:![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
Node:      ![Node](https://img.shields.io/node/v/PACKAGE)
```

**Steps**

## Part 1: Documentation Config
1. Check if @RELEASE.md exists:
   - If not: create from template.
   - If exists: read current configuration.

2. Guide user through Format selection:
   - Present format options: keep-a-changelog, simple-list, github-release.
   - Explain each format's structure and use case.
   - Record selection.

3. Guide user through Style selection:
   - Present style options: minimal, standard, comprehensive, cli-tool, library.
   - Explain sections included in each style.
   - Record selection.

4. Guide user through Audience selection:
   - Present audience options: technical, semi-technical, general-interest.
   - Explain tone and focus of each.
   - Record selection.

5. Guide user through Emoji level selection:
   - Present emoji options: none, minimal, standard.
   - Show examples for each level.
   - Record selection.

6. Badge configuration (optional):
   - Ask if user wants badges in readme.
   - If yes, present badge options and record selections.
   - Collect OWNER, REPO, PACKAGE values if needed.

7. Write selections to RELEASE.md Documentation Config section.

## Part 2: Consistency Checklist Research
8. Research and populate each Consistency Checklist section in @RELEASE.md:

   **Primary Sources**
   - Search for entry points, main configs, core definitions
   - Identify files that other files depend on
   - List files that must change first when modifying behavior

   **Derived Artifacts**
   - Find code generation (templates, schemas, configs that produce other files)
   - Identify build outputs that derive from source
   - Determine the regeneration command
   - Count total derived files

   **Shared Values**
   - Search for version numbers, project names, identifiers
   - Find values appearing in multiple files (configs, docs, code)
   - Note environment-specific values that must align

   **Behavioral Contracts**
   - Find type definitions, schemas, interfaces
   - Identify API contracts, database schemas
   - Locate spec files defining expected behavior

   **Assertion Updates**
   - Find test files with string assertions
   - Identify snapshot tests
   - Note tests checking specific output formats or messages

   **Documentation References**
   - List markdown files with code examples
   - Find docs referencing specific implementations
   - Identify inline documentation with version-specific content

   **External Integrations**
   - Find IDE configurations, editor settings
   - Locate CI/CD pipeline definitions
   - Identify third-party service configs referencing codebase

   **Platform Variations**
   - Find platform-specific directories
   - Identify files duplicated across targets
   - Count synchronized files per platform

   **Cleanup**
   - Note patterns for files to delete when features are removed

   **Verification**
   - Determine test command for project
   - Identify validation/lint commands
   - Document grep patterns for common changes

9. Write findings to each section with file paths and counts.

## Part 3: Confirm
10. Present summary of configuration and populated checklist.
11. Explain how `/plx:prepare-release` will use this configuration.
<!-- PLX:END -->
