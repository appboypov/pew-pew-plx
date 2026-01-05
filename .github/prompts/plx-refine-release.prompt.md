---
description: Create or update RELEASE.md.
---

$ARGUMENTS
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
1. Check if @RELEASE.md exists:
   - If not: create from template with empty Config section.
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

7. Write all selections to RELEASE.md Config section:
   ```yaml
   # Config
   format: <selected-format>
   style: <selected-style>
   audience: <selected-audience>
   emoji: <selected-emoji>
   badges:
     - <badge1>
     - <badge2>
   owner: <github-owner>
   repo: <github-repo>
   package: <npm-package>
   ```

8. Confirm configuration saved and explain how `plx/prepare-release` will use it.
<!-- PLX:END -->
