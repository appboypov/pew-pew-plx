---
name: OpenSpec: Apply
description: Implement an approved OpenSpec change and keep tasks in sync.
category: OpenSpec
tags: [openspec, apply]
---
<!-- OPENSPEC:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `openspec/AGENTS.md` (located inside the `openspec/` directory—run `ls openspec` or `openspec update` if you don't see it) if you need additional OpenSpec conventions or clarifications.

**Steps**
Track these steps as TODOs and complete them one by one.
1. Read `changes/<id>/proposal.md` and `design.md` (if present) to understand scope.
2. Find the next incomplete task in `tasks/` directory:
   - Scan task files in sequence order (001-*, 002-*, etc.)
   - Read completed task files for context
   - Stop at the first task with incomplete checkboxes in its Implementation Checklist
   - Do NOT read tasks beyond the next incomplete one
   - If user specified a task file in ARGUMENTS, use that instead
3. Work through that task's Implementation Checklist, keeping edits minimal.
4. Mark items complete (`[x]`) in that task file only.
5. Reference `openspec list` or `openspec show <item>` when additional context is required.
6. Run apply again in a new conversation for the next task.

**Reference**
- Use `openspec show <id> --json --deltas-only` if you need additional context from the proposal while implementing.
<!-- OPENSPEC:END -->
