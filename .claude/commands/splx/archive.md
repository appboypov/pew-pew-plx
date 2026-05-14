---
name: Archive
description: Archive a deployed change and update specs.
category: OpenSplx
tags: [splx, archive]
---
<!-- PLX:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `workspace/AGENTS.md` (located inside the `workspace/` directory—run `ls workspace` or `splx update` if you don't see it) if you need additional OpenSplx conventions or clarifications.
- When clarification is needed, use your available question tool (if one exists) instead of asking in chat. If no question tool is available, ask in chat.

**Steps**
1. Determine the change ID to archive:
   - If this prompt already includes a specific change ID (for example inside a `<ChangeId>` block populated by slash-command arguments), use that value after trimming whitespace.
   - If the conversation references a change loosely (for example by title or summary), run `splx get changes` to surface likely IDs, share the relevant candidates, and confirm which one the user intends.
   - Otherwise, review the conversation, run `splx get changes`, and ask the user which change to archive; wait for a confirmed change ID before proceeding.
   - If you still cannot identify a single change ID, stop and tell the user you cannot archive anything yet.
2. Validate the change ID by running `splx get changes` (or `splx get change --id <id>`) and stop if the change is missing, already archived, or otherwise not ready to archive.
3. Run `splx archive change --id <id> --yes` so the CLI moves the change and applies spec updates without prompts (use `--skip-specs` only for tooling-only work).
4. Review the command output to confirm the target specs were updated and the change landed in `changes/archive/`.
5. Validate with `splx validate all --strict` and inspect with `splx get change --id <id>` if anything looks off.

**Reference**
- Use `splx get changes` to confirm change IDs before archiving.
- Inspect refreshed specs with `splx get specs` and address any validation issues before handing off.
<!-- PLX:END -->
