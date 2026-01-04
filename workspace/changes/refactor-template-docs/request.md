# Request: Refactor Template Documentation Pattern

## Source Input

> The current RELEASE.md template is way too verbose - all the instructions for what could be done should be inside commands refine-release and prepare-release and the RELEASE.md should serve as the folder that shows the actual implementations for release for this project - so it should contain some default instructions but not all options - e.g make the default all the default options keep-a-changelog, etc etc - and then refine-release has all the instructions for all other options to change that. It's a config file so to speak. Same for REVIEW.md (which is already done pretty well but double check to be sure). Then while we're at it I want to introduce the test variant - so a TESTING.md should behave the same way with refine and plx/test commands - where this one is more like the review command as in can take arguments for changes, tasks, etc.

## Current Understanding

### Current State Analysis

**RELEASE.md (481 lines):**
- Contains extensive documentation of ALL options (source selection, format templates, style templates, badge patterns)
- Acts as both documentation AND configuration
- Verbose: includes full template examples for all format styles

**REVIEW.md (28 lines):**
- Concise config-style format
- Defines review types, feedback format, checklist
- Project-specific configuration only
- No verbose "how-to" instructions

**Commands Pattern:**
- `refine-release` / `refine-review`: Create or update the .md file
- `prepare-release` / `review`: Execute the workflow reading from the .md config

### Proposed New Pattern

1. **RELEASE.md**: Slim down to config-style (like REVIEW.md)
   - Default selections only (keep-a-changelog, standard style, etc.)
   - Project-specific overrides
   - No full template documentation

2. **refine-release command**: Contains all option documentation
   - Shows available options when run
   - Guides user through customization
   - Updates RELEASE.md with selections

3. **TESTING.md**: New config file for test workflows
   - Similar structure to REVIEW.md
   - Defines test types, coverage requirements, test patterns

4. **refine-testing command**: Create/update TESTING.md

5. **plx/test command**: Execute testing workflow
   - Takes arguments like review: `--change-id`, `--task-id`, `--spec-id`
   - Reads TESTING.md for configuration

## Identified Ambiguities

1. **RELEASE.md default config content**: What specific defaults should be pre-selected?
   - Format: keep-a-changelog (confirmed)
   - What else? Style? Audience? Emoji level?

2. **Where do verbose instructions go?**
   - Embedded in command prompts?
   - Separate reference doc?
   - In-memory during command execution?

3. **TESTING.md structure**: What should it configure?
   - Test types (unit, integration, e2e)?
   - Coverage thresholds?
   - Test patterns/naming?
   - Framework-specific configs?

4. **plx/test vs plx review**: How similar should they be?
   - Same argument pattern (--change-id, --task-id, --spec-id)?
   - Different output format?

5. **REVIEW.md verification**: Is current format acceptable as-is?

## Decisions

1. **RELEASE.md**: Pure config file with defaults selected (keep-a-changelog format, etc.). No template examples or verbose documentation.

2. **Verbose instructions**: Move into the command prompts (refine-release, prepare-release). Commands contain all option documentation internally.

3. **REVIEW.md**: Already follows the correct pattern. Keep as-is.

4. **TESTING.md**: New config file following same pattern as REVIEW.md.
   - Test types, patterns, coverage requirements
   - Config-style, not documentation-style

5. **plx/test command**: Follows same argument pattern as review (--change-id, --task-id, --spec-id).

6. **refine-testing command**: Create/update TESTING.md with all options documented in the command itself.

## Final Intent

**Goal**: Establish consistent pattern across template docs where:
- `.md` files (RELEASE.md, REVIEW.md, TESTING.md) are minimal **config files** containing only project-specific selections
- `refine-*` commands contain all documentation for available options and guide users through customization
- `prepare-*` / action commands read the config and execute the workflow

**Deliverables**:
1. Slim down RELEASE.md to config-style (defaults: keep-a-changelog, standard style, no emoji, technical audience)
2. Move all verbose documentation into refine-release and prepare-release command prompts
3. Verify REVIEW.md follows pattern (it does)
4. Create TESTING.md config template
5. Create refine-testing command
6. Create plx/test command with --change-id, --task-id, --spec-id arguments

Run `plx/plan-proposal refactor-template-docs` to scaffold the proposal.
