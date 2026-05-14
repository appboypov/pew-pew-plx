# Update Command Specification

## Purpose

As a developer using PLX, I want to update the PLX instructions in my project when new versions are released, so that I can benefit from improvements to AI agent instructions.

## Core Requirements

### Update Behavior

The update command SHALL update PLX instruction files to the latest templates.

WHEN a user runs `splx update` THEN the command SHALL:
- Check if the `splx` directory exists
- Replace `workspace/README.md` with the latest template (complete replacement)
- Update the PLX-managed block in `CLAUDE.md` using markers
  - Preserve user content outside markers
  - Create `CLAUDE.md` if missing
- Display ASCII-safe success message: "Updated PLX instructions"

### Prerequisites

The command SHALL require:
- An existing `splx` directory (created by `splx init`)

IF the `splx` directory does not exist THEN:
- Display error: "No PLX directory found. Run 'splx init' first."
- Exit with code 1

### File Handling

The update command SHALL:
- Completely replace `workspace/README.md` with the latest template
- Update only the PLX-managed block in `CLAUDE.md` using markers
- Use the default directory name `splx`
- Be idempotent (repeated runs have no additional effect)

## Edge Cases

### File Permissions
IF file write fails THEN let the error bubble up naturally with file path.

### Missing CLAUDE.md
IF CLAUDE.md doesn't exist THEN create it with the template content.

### Custom Directory Name
Not supported in this change. The default directory name `splx` SHALL be used.

## Success Criteria

Users SHALL be able to:
- Update PLX instructions with a single command
- Get the latest AI agent instructions
- See clear confirmation of the update

The update process SHALL be:
- Simple and fast (no version checking)
- Predictable (same result every time)
- Self-contained (no network required)
