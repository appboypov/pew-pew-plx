---
status: done
---

# Task: Slim down RELEASE.md to config-style

## End Goal

RELEASE.md is a minimal config file (~50 lines) containing only project-specific selections, not documentation.

## Currently

RELEASE.md is 481 lines with full template examples, format documentation, badge URL patterns, and style templates - acting as both config AND documentation.

## Should

RELEASE.md contains:
- Purpose statement
- Selected defaults (keep-a-changelog, standard style, technical audience, no emoji)
- Project-specific overrides section
- Release checklist
- No template examples or format documentation

## Constraints

- [ ] Keep same filename and location (RELEASE.md at project root)
- [ ] Preserve the release checklist section
- [ ] Defaults must be sensible for CLI tools (keep-a-changelog format, technical audience)

## Acceptance Criteria

- [ ] RELEASE.md is under 60 lines
- [ ] Contains clear default selections for: format, style, audience, emoji level
- [ ] No format template examples (keep-a-changelog, simple-list, github-release)
- [ ] No style template examples (minimal, standard, comprehensive, CLI tool, library)
- [ ] No badge URL patterns documentation

## Implementation Checklist

- [x] 1.1 Read current RELEASE.md to identify sections to keep
- [x] 1.2 Create slimmed RELEASE.md with Purpose, Defaults, Overrides, Checklist sections
- [x] 1.3 Set defaults: format=keep-a-changelog, style=standard, audience=technical, emoji=none
- [x] 1.4 Remove all template examples and format documentation
- [x] 1.5 Verify RELEASE.md is under 60 lines

## Notes

The verbose documentation moves to refine-release command in task 002.
