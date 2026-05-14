---
status: done
skill-level: junior
parent-type: change
parent-id: add-create-command
---
# Task: Update documentation for create command

## End Goal

All documentation reflects the new `splx create` command including AGENTS.md, ARCHITECTURE.md, and CLI help text.

## Currently

Documentation does not reference `splx create` command as it does not exist.

## Should

- AGENTS.md command table includes `splx create` entries
- ARCHITECTURE.md lists CreateCommand in command pattern section
- CLI help text is clear and complete for all subcommands
- README (if applicable) includes create command examples

## Constraints

- [ ] Update only managed sections in AGENTS.md (within PLX markers)
- [ ] Follow existing documentation patterns
- [ ] Keep help text concise and actionable

## Acceptance Criteria

- [ ] `workspace/AGENTS.md` command table includes create command entries
- [ ] `ARCHITECTURE.md` mentions CreateCommand in command list
- [ ] `splx create --help` provides clear usage information
- [ ] Subcommand help text describes all options

## Implementation Checklist

- [x] 6.1 Update `src/core/templates/agents-template.ts` with create command entries
- [x] 6.2 Update `ARCHITECTURE.md` command list
- [x] 6.3 Verify help text clarity for main command
- [x] 6.4 Verify help text clarity for each subcommand
- [x] 6.5 Run `splx update` to regenerate managed content

## Notes

- AGENTS.md command table follows format: `splx create task "Title"` | Create standalone task | Entity creation
- Help text should include examples for common use cases
