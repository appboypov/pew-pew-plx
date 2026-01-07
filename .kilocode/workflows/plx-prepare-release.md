<!-- PLX:START -->
**Guardrails**
- Read @RELEASE.md Config section for release configuration.
- Apply defaults when config values are not specified.
- Reference @README.md, @CHANGELOG.md, and @ARCHITECTURE.md for updates.
- Execute steps sequentially: changelog → readme → architecture.
- User confirms or skips each step before proceeding.
- Preserve existing content when updating files.
- Never use 'Unreleased' in changelog entries - always determine the concrete next version number based on semantic versioning.
- Run the `date` command to get the accurate release date in YYYY-MM-DD format.

**Monorepo Awareness**
- Derive target package from the user's request context (mentioned package name, file paths, or current focus).
- If target package is unclear in a monorepo, clarify with user before proceeding.
- Create artifacts in the relevant package's workspace folder (e.g., `packages/foo/workspace/`), not the monorepo root.
- For root-level changes (not package-specific), use the root workspace.
- If multiple packages are affected, process each package separately.
- Follow each package's AGENTS.md instructions if present.

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
   - Analyze commits for version bump type:
     - Breaking changes or BREAKING footer → suggest major version bump
     - feat commits → suggest minor version bump
     - fix commits → suggest patch version bump
     - Apply AI judgment on overall scope to confirm or adjust suggestion
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
