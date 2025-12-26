---
status: done
---

# Task: Update template files

## End Goal

The slash command templates and AGENTS.md template include guidance for using question tools.

## Currently

Templates mention "ask clarifying questions" but do not specify to use question tools.

## Should

Templates instruct AI assistants to use their available question tools for gathering clarifications.

## Constraints

- [ ] Use tool-agnostic phrasing ("your available question tool")
- [ ] Include fallback for tools without question capabilities
- [ ] Keep changes minimal and focused

## Acceptance Criteria

- [ ] Base guardrails include question tool guidance
- [ ] AGENTS.md template references question tools at clarification points
- [ ] Phrasing is generic and works across all 20+ supported AI tools

## Implementation Checklist

- [x] 1.1 Update `baseGuardrails` in `src/core/templates/slash-command-templates.ts` to add: "When clarification is needed, use your available question tool (if one exists) instead of asking in chat. If no question tool is available, ask in chat."
- [x] 1.2 Update `proposalGuardrails` in `src/core/templates/slash-command-templates.ts` to change "ask the necessary follow-up questions" to "gather the necessary clarifications"
- [x] 1.3 Update line ~79 in `src/core/templates/agents-template.ts` (Before Creating Specs) to add "(using your question tool if available)"
- [x] 1.4 Update line ~526 in `src/core/templates/agents-template.ts` (Error Recovery) to add "(use your question tool if available)"

## Notes

PLX-specific templates (`plx-slash-command-templates.ts`) do not need changes as they are task-execution focused and rarely require clarification questions.
