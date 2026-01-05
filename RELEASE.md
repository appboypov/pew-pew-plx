# Release Preparation

## Purpose
This file configures release preparation for the project.
Run `plx prepare` to update changelog, readme, and architecture documentation before publishing.

## Changelog Format
- **Default**: keep-a-changelog

## README Style
- **Default**: standard

## Audience
- **Default**: technical

## Emoji Level
- **Default**: none

## Project Overrides
<!-- Customize defaults here -->
```yaml
changelog_format: keep-a-changelog
readme_style: standard
audience: technical
emoji_level: none
```

## Release Checklist
- [ ] Changelog updated with new version
- [ ] Readme reflects current project state
- [ ] Architecture documentation current
- [ ] Version bumped in package.json
- [ ] All changes reviewed and confirmed
