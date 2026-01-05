---
name: Pew Pew Plx: Prepare Release
description: Prepare release by updating changelog, readme, and architecture documentation.
category: Pew Pew Plx
tags: [plx, release, documentation]
---
<!-- PLX:START -->
**Guardrails**
- Read @RELEASE.md Config section for release configuration.
- Apply defaults when config values are not specified.
- Reference @README.md, @CHANGELOG.md, and @ARCHITECTURE.md for updates.
- Execute steps sequentially: changelog → readme → architecture.
- User confirms or skips each step before proceeding.
- Preserve existing content when updating files.

## Default Configuration
When RELEASE.md Config section is missing or incomplete, apply these defaults:
| Setting | Default Value |
|---------|---------------|
| format | keep-a-changelog |
| style | standard |
| audience | technical |
| emoji | none |
| badges | (none) |

**Steps**
1. Parse configuration from @RELEASE.md:
   - Read Config section (YAML block after "# Config" header).
   - Extract: format, style, audience, emoji, badges, owner, repo, package.
   - Apply defaults for any missing values:
     - format: keep-a-changelog
     - style: standard
     - audience: technical
     - emoji: none

2. Execute changelog update:
   - Ask user for change source: git commits, branch diff, or manual entry.
   - If git commits: ask for range (recent N, since date, since tag, tag range).
   - Analyze commits for version bump type (major/minor/patch).
   - Generate changelog entry using configured format and emoji level.
   - Prepend to CHANGELOG.md (create if not exists).

3. Execute readme update:
   - Apply configured style to determine sections.
   - Apply configured audience for tone.
   - If badges configured: generate badge markdown using owner/repo/package values.
   - Update or create README.md preserving user content.

4. Execute architecture update:
   - Read existing ARCHITECTURE.md.
   - Explore codebase for current patterns and structure.
   - Update documentation while preserving user-written content.
   - Add sections for undocumented patterns.

5. Present summary:
   - List all files updated.
   - Show version bump applied.
   - Highlight any sections that need manual review.
<!-- PLX:END -->
